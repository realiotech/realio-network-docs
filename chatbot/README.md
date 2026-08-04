# Realio Docs Chatbot

Self-hosted RAG chatbot for the Docusaurus docs, using Ollama (CPU) +
Qdrant. Runs entirely on the same box as the docs site
(`realio-docs.decentrio.ventures`), no external API calls.

Stack: `qwen3:8b` (generation), `nomic-embed-text` (embeddings), Qdrant
(vector store), Flask + gunicorn (API), existing system nginx (reverse
proxy), a vanilla-JS floating widget injected into every doc page.

## One-time setup on the server

Already done as of this guide:
- Ollama installed, `qwen3:8b` and `nomic-embed-text` pulled
- Qdrant running in Docker, bound to `127.0.0.1:6333` only

Remaining steps, run from `/root/realio-network-docs` after `git pull`:

```bash
cd /root/realio-network-docs/chatbot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# build the index (re-run any time docs change)
python index_docs.py
```

Wire up the systemd service for the API:

```bash
cp /root/realio-network-docs/chatbot/realio-chatbot.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now realio-chatbot
systemctl status realio-chatbot
curl -s http://127.0.0.1:8000/api/health
curl -s -X POST http://127.0.0.1:8000/api/chat -H 'Content-Type: application/json' \
  -d '{"message":"What is Realio Network?"}'
```

Add the nginx location (see `nginx-snippet.conf` for the exact block) to
`/etc/nginx/sites-enabled/realio-docs.decentrio.ventures`, inside the
existing `server { ... }`, then:

```bash
nginx -t
systemctl reload nginx
```

Rebuild/restart the docs site so it picks up the widget script/css
(`scripts`/`stylesheets` added to `docusaurus.config.js`) and the new
`/api/chat` route, using whatever process already deploys this repo
(`npm run build` + restart the node process on port 3002, or your existing
CI/deploy flow).

Test from a browser at `https://realio-docs.decentrio.ventures` - a chat
bubble should appear bottom-right.

## Keeping the index fresh

`reindex.sh` does `git pull` + re-runs `index_docs.py`. Automate it with the
included timer:

```bash
cp realio-reindex.service realio-reindex.timer /etc/systemd/system/
chmod +x /root/realio-network-docs/chatbot/reindex.sh
systemctl daemon-reload
systemctl enable --now realio-reindex.timer
systemctl list-timers | grep realio-reindex
```

This re-pulls and re-indexes every 30 minutes. Adjust `OnUnitActiveSec` in
the timer if you want a different cadence.

## Notes / limitations

- `index_docs.py` derives doc URLs from file paths (stripping numeric
  ordering prefixes like `01-`). If a doc overrides its slug via
  frontmatter (`id:`/`slug:`), the generated link may not match exactly -
  spot check a few chat answers after first indexing.
- Qdrant and the Flask API are both bound to `127.0.0.1` only; nothing new
  is exposed to the internet except the `/api/chat` path proxied through
  the existing nginx vhost.
- The Flask rate limiter is a simple in-memory per-IP cooldown - fine for a
  low-traffic docs site, not a substitute for real abuse protection if
  this ever gets linked from somewhere high-traffic.
- `qwen3:8b` is a reasoning model; `app.py` strips `<think>...</think>`
  before returning the answer.
- Logs: `journalctl -u realio-chatbot -f` and `/var/log/realio-chatbot.log`.
