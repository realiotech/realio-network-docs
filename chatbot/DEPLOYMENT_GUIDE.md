# Deploying this chatbot on a new server — battle-tested runbook

This is a generalized, gotcha-free version of how the Realio docs chatbot
was actually deployed, including every mistake made along the way so you
don't repeat them. Stack: Ollama (CPU) + Qdrant + Flask/gunicorn + nginx +
a vanilla-JS widget. Swap `qwen3:8b`, model names, domains, and paths for
your own.

## 0. Before you start

Check what's already running on the box so you don't collide with it:

```bash
docker ps -a
ss -tlnp
free -h
nproc
df -h /
ls /etc/nginx/sites-enabled/
```

Minimum comfortable spec for an 8B model on CPU: ~8GB RAM just for the
model, but budget 20-30GB+ available so the OS page cache and other
services aren't starved. More cores helps generation speed but doesn't
help concurrency (see step 7).

## 1. Install Ollama + pull models

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen3:8b            # or your generation model
ollama pull nomic-embed-text    # embedding model
ollama list
```

## 2. Run Qdrant, bound to localhost only

```bash
docker run -d --name qdrant --restart unless-stopped \
  -p 127.0.0.1:6333:6333 -p 127.0.0.1:6334:6334 \
  -v qdrant_data:/qdrant/storage qdrant/qdrant
curl http://127.0.0.1:6333/collections
```

Never expose 6333/6334 publicly — it has no auth by default.

## 3. Python environment — the one gotcha that will waste an hour

**Check `ctypes` works before creating the venv:**

```bash
/usr/bin/python3 -c "import ctypes; print('ok')"
```

If this fails, some `pyenv`-built Pythons on the box were compiled
without `libffi-dev` and are missing `ctypes` entirely — `pip install`
will succeed but `import qdrant_client` will crash deep in a C-extension
import with a cryptic `ModuleNotFoundError: No module named '_ctypes'`.
Skip pyenv and use the system Python instead:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 4. Index your docs

Adjust `index_docs.py`'s `DOCS_DIR`/file globs for your content format.
Run it once manually to build the index:

```bash
python index_docs.py
```

## 5. Tune for CPU speed before wiring up the API

These aren't optional polish — a naive setup will take 60-90s per answer
and blow past any reverse-proxy timeout (see step 7). All in the Ollama
`/api/generate` call:

- `"think": false` — if using a reasoning model (qwen3, deepseek-r1,
  etc.), this skips the internal "thinking" tokens. Single biggest lever.
- `"keep_alive": "30m"` — keeps the model resident in RAM between
  requests instead of reloading it (multi-GB) every time.
- `"options": {"num_predict": 250, "num_ctx": 4096}` — caps answer
  length and context window. Combined with a smaller `TOP_K` (how many
  retrieved chunks go into the prompt) and smaller chunk size in the
  indexer, this is the other big lever — less context in, faster
  prefill on CPU.

Expect roughly: default settings ~60-90s/answer → tuned ~15-20s/answer,
for an 8B model on ~20 CPU cores.

## 6. Flask API as a systemd service

```ini
[Unit]
Description=Docs Chatbot API
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/chatbot
Environment="OLLAMA_URL=http://127.0.0.1:11434"
Environment="QDRANT_URL=http://127.0.0.1:6333"
ExecStart=/path/to/chatbot/venv/bin/gunicorn -w 1 -b 127.0.0.1:8000 --timeout 180 app:app
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

**Use `-w 1`, not multiple workers.** This looks wrong (why not use more
of the CPU?) but it's right: the bottleneck is Ollama doing CPU-bound
inference, not Flask. Multiple gunicorn workers just let two requests
hit Ollama at the same moment, and two simultaneous generations
thrash each other for the same cores — worse combined latency than
doing them one after another. `-w 1` forces clean queuing instead.

Also set `OLLAMA_NUM_PARALLEL=1` on the Ollama service itself as a second
layer of defense (`systemctl edit ollama`, add under `[Service]`):

```ini
Environment="OLLAMA_NUM_PARALLEL=1"
```

```bash
systemctl daemon-reload
systemctl enable --now realio-chatbot
systemctl restart ollama
curl -s http://127.0.0.1:8000/api/health
```

**Concurrency reality check:** with this setup, multiple simultaneous
users get correct answers, but queued — not parallel. Person 2 waits
roughly (their own generation time) + (person 1's remaining time). For
a low-traffic docs site this is a fine trade-off. For higher traffic,
you'd need GPU inference or a smaller model, not just more CPU workers.

## 7. nginx reverse proxy — mind any CDN/proxy timeout in front of it

```nginx
location /api/chat {
    limit_except POST { deny all; }
    proxy_pass http://127.0.0.1:8000/api/chat;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 180s;
    client_max_body_size 200k;
    # required if the API streams a response (recommended, see step 8)
    proxy_buffering off;
    proxy_cache off;
    chunked_transfer_encoding on;
}
```

If the domain sits behind Cloudflare (or any CDN), check for a
proxied/orange-cloud DNS record — those enforce their own response
timeout (Cloudflare's is ~100s) independent of your nginx config. A slow
unstreamed answer can get killed with a generic `524` error that has
nothing to do with your server. `dig +short yourdomain.com` — if it
resolves to a CDN's IP range rather than your server's own IP, assume
a timeout applies and design around it (speed tuning from step 5,
streaming from step 8).

## 8. Stream the response instead of waiting for the full answer

Two benefits: it feels instant to the user (tokens appear as generated,
not after a 15s wait), and it keeps bytes flowing so CDN idle-timeouts
are far less likely to trigger. Have the Flask endpoint stream
newline-delimited JSON events (`{"type":"token","text":"..."}` per Ollama
streaming chunk, then `{"type":"done","sources":[...]}`), and consume it
client-side with `response.body.getReader()` instead of `response.json()`.
Set `X-Accel-Buffering: no` on the Flask response as a second safety net
alongside `proxy_buffering off` in nginx.

## 9. Frontend widget

- Theme it off your site's actual CSS variables, not hardcoded colors,
  so it doesn't clash (e.g. `var(--ifm-color-primary)` for Docusaurus).
- Position it somewhere that can't collide with existing floating UI
  (a "back to top" button, a cookie banner, etc.) — check what's already
  on the page before picking a corner.
- **Cache-bust on every change**: `<script src="/js/widget.js?v=2">`,
  bumping `v` each time you edit the file. Static JS/CSS served directly
  (not through a bundler with content hashing) will otherwise sit in
  visitors' browser caches indefinitely and silently serve stale code —
  this cost real debugging time here, showing up as a working `curl`
  test but a broken browser experience.

## 10. Auto re-indexing — don't forget to actually enable it

Easy mistake: writing the `.service`/`.timer` files and the reindex
script, documenting them, and then never running the install commands.
Writing the files is not the same as turning them on:

```bash
cp reindex.service reindex.timer /etc/systemd/system/
chmod +x reindex.sh
systemctl daemon-reload
systemctl enable --now reindex.timer
systemctl list-timers | grep reindex   # confirm it's actually scheduled
```

Verify it's real, not just installed: `journalctl -u reindex --since
"-1h"` should show actual run history after the first interval passes.

## 11. When the docs site is containerized / GitOps-deployed

The steps above assume the docs site and the AI backend live on the same
VM. Realio's production site does not: `docs.realio.network` is built by
GitHub Actions into a Docker image and deployed to Kubernetes via a
GitOps repo + ArgoCD, while Ollama/Qdrant/Flask run on a separate VM
(the `realio-docs.decentrio.ventures` box). If you're in that split
setup, the following differ:

**The docs pod cannot host the AI.** It's a static-file nginx image
(`nginx-unprivileged`, port 8080) with `cpu: 200m` / `memory: 256Mi` -
about a fifth of a core. An 8B model needs multiple GB of RAM resident.
Running the AI there means new Deployments, a PVC for Qdrant, and real
resource requests; it is not a config tweak.

**The widget must use an absolute API URL.** A relative `/api/chat`
404s on the containerized domain, because that nginx config only serves
static files - there's no backend to proxy to. Point `API_URL` at the
VM that actually runs the API, and add the docs domain to the Flask
`ALLOWED_ORIGINS`.

**nginx config lives in two different places.** The `location /api/chat`
proxy block belongs to the *VM's* nginx (`/etc/nginx/sites-enabled/...`),
not `conf/conf.d/default.conf` in this repo - that one ships inside the
docs image and only needs to serve static files.

**Don't enable git-history-dependent Docusaurus options.**
`showLastUpdateTime` / `showLastUpdateAuthor` shell out to `git log`,
but `.dockerignore` excludes `.git` from the build context, so the CI
build dies with `fatal: not a git repository`. This passes locally
(where `.git` exists) and fails only in CI - test by building from a
copy with `.git` removed, not from your working tree.

**Keep the indexer's branch in sync with production.** The chatbot
indexes docs from a git checkout on the AI VM. Production is built from
whatever branch `.github/workflows/prod.yaml` triggers on (`main`). If
the VM's checkout sits on a release branch instead, the chatbot answers
from docs that differ from what users are reading - a silent, confusing
failure. `reindex.sh` now checks this and switches branches, but verify
after any release-branch workflow change:

```bash
cd /root/realio-network-docs && git rev-parse --abbrev-ref HEAD   # expect: main
```

**Widget asset caching still applies.** The image build copies
`static/` into the site unhashed, so the `?v=N` cache-bust in
`docusaurus.config.js` is still the mechanism that gets updated widget
code to returning visitors. Bump it on every widget change.

**Availability coupling.** The production docs now depend on a separate
VM for the chat feature. If that box is down, the chat button renders
and fails rather than being absent. Consider hiding the widget on a
failed health check if that matters.

## 12. Final verification checklist

- [ ] `curl 127.0.0.1:8000/api/health` → `{"status":"ok"}`
- [ ] `curl 127.0.0.1:8000/api/chat -d '{"message":"..."}'` → real answer,
      reasonable latency
- [ ] Same curl against the public HTTPS domain → same result (proves
      nginx + any CDN in front of it aren't breaking things)
- [ ] Two concurrent curls (`cmd1 & cmd2 & wait`) → both complete
      correctly, latency matches the "queued not parallel" expectation
      from step 6, not wildly worse (thrashing = `-w 1` didn't take)
- [ ] Widget loads and answers correctly in an **incognito window**
      (rules out your own browser cache lying to you about what's live)
- [ ] `systemctl list-timers` shows the reindex timer scheduled
- [ ] Edit a doc, wait for reindex (or run it manually), confirm the
      chatbot's answer reflects the change
