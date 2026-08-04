#!/usr/bin/env python3
"""
Flask chat API: retrieves relevant doc chunks from Qdrant, generates an
answer with Ollama (qwen3:8b), returns the answer plus source links.

Run in production via gunicorn (see realio-chatbot.service), not directly.
"""
import os
import re
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from qdrant_client import QdrantClient

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
EMBED_MODEL = os.environ.get("EMBED_MODEL", "nomic-embed-text")
CHAT_MODEL = os.environ.get("CHAT_MODEL", "qwen3:8b")
QDRANT_URL = os.environ.get("QDRANT_URL", "http://127.0.0.1:6333")
COLLECTION = os.environ.get("QDRANT_COLLECTION", "realio_docs")
TOP_K = int(os.environ.get("TOP_K", "5"))
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "https://realio-docs.decentrio.ventures")
RATE_LIMIT_SECONDS = float(os.environ.get("RATE_LIMIT_SECONDS", "3"))

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGIN}})

qdrant = QdrantClient(url=QDRANT_URL)

THINK_RE = re.compile(r"<think>.*?</think>", re.DOTALL)

# tiny in-memory per-IP rate limiter (single-process gunicorn worker state;
# fine for a low-traffic docs chatbot, not meant to be bulletproof)
_last_seen = {}

SYSTEM_PROMPT = (
    "You are a helpful documentation assistant for Realio Network. "
    "Answer ONLY using the provided context from the docs. If the answer "
    "isn't in the context, say you don't know and suggest checking the "
    "docs directly instead of guessing. Be concise."
)


def embed(text, prefix):
    r = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": f"{prefix}{text}"},
        timeout=60,
    )
    r.raise_for_status()
    return r.json()["embedding"]


def generate(prompt):
    r = requests.post(
        f"{OLLAMA_URL}/api/generate",
        json={"model": CHAT_MODEL, "prompt": prompt, "stream": False},
        timeout=180,
    )
    r.raise_for_status()
    text = r.json().get("response", "")
    return THINK_RE.sub("", text).strip()


@app.route("/api/chat", methods=["POST"])
def chat():
    ip = request.headers.get("X-Real-IP", request.remote_addr) or "unknown"
    now = time.time()
    if now - _last_seen.get(ip, 0) < RATE_LIMIT_SECONDS:
        return jsonify({"error": "Too many requests, please slow down."}), 429
    _last_seen[ip] = now

    data = request.get_json(silent=True) or {}
    question = (data.get("message") or "").strip()
    if not question:
        return jsonify({"error": "message is required"}), 400
    if len(question) > 1000:
        return jsonify({"error": "message too long (max 1000 chars)"}), 400

    try:
        q_vec = embed(question, "search_query: ")
        hits = qdrant.search(collection_name=COLLECTION, query_vector=q_vec, limit=TOP_K)
    except Exception as e:
        return jsonify({"error": f"retrieval failed: {e}"}), 502

    context_parts = []
    sources = []
    seen_urls = set()
    for h in hits:
        payload = h.payload or {}
        context_parts.append(f"[{payload.get('heading')}]\n{payload.get('text')}")
        url = payload.get("url")
        if url and url not in seen_urls:
            seen_urls.add(url)
            sources.append({"title": payload.get("heading"), "url": url})

    if not context_parts:
        return jsonify(
            {
                "answer": "I couldn't find anything relevant in the docs for that. "
                "Try rephrasing, or browse the docs directly.",
                "sources": [],
            }
        )

    context = "\n\n---\n\n".join(context_parts)
    prompt = f"{SYSTEM_PROMPT}\n\nContext:\n{context}\n\nQuestion: {question}\n\nAnswer:"

    try:
        answer = generate(prompt)
    except Exception as e:
        return jsonify({"error": f"generation failed: {e}"}), 502

    return jsonify({"answer": answer, "sources": sources})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)
