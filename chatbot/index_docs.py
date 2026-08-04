#!/usr/bin/env python3
"""
Indexes Docusaurus .md/.mdx docs into Qdrant using Ollama embeddings.

Usage:
    python index_docs.py

Env vars (all optional, defaults shown):
    OLLAMA_URL=http://127.0.0.1:11434
    EMBED_MODEL=nomic-embed-text
    QDRANT_URL=http://127.0.0.1:6333
    QDRANT_COLLECTION=realio_docs
    DOCS_DIR=../docs             (relative to this script)
    DOCS_BASE_URL=                (empty = relative links, e.g. /07-developers/foo)
"""
import os
import re
import glob
import uuid
import requests
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
EMBED_MODEL = os.environ.get("EMBED_MODEL", "nomic-embed-text")
QDRANT_URL = os.environ.get("QDRANT_URL", "http://127.0.0.1:6333")
COLLECTION = os.environ.get("QDRANT_COLLECTION", "realio_docs")
DOCS_DIR = os.environ.get("DOCS_DIR", os.path.join(SCRIPT_DIR, "..", "docs"))
# Left empty by default so links are relative (works on both
# docs.realio.network and realio-docs.decentrio.ventures). Set to an absolute
# origin only if you want fully-qualified links in chat answers.
DOCS_BASE_URL = os.environ.get("DOCS_BASE_URL", "")
MAX_CHUNK_CHARS = 1200

FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.DOTALL)
MDX_IMPORT_RE = re.compile(r"^\s*import .*$", re.MULTILINE)
JSX_TAG_RE = re.compile(r"</?[A-Z][A-Za-z0-9]*[^>]*>")
HEADING_RE = re.compile(r"^#{1,3}\s+")


def clean_mdx(text):
    text = FRONTMATTER_RE.sub("", text, count=1)
    text = MDX_IMPORT_RE.sub("", text)
    text = JSX_TAG_RE.sub("", text)
    return text


def chunk_by_headings(text, fallback_heading):
    lines = text.split("\n")
    chunks = []
    current_heading = fallback_heading
    current_lines = []

    def flush():
        content = "\n".join(current_lines).strip()
        if not content:
            return
        if len(content) > MAX_CHUNK_CHARS:
            for i in range(0, len(content), MAX_CHUNK_CHARS):
                chunks.append((current_heading, content[i : i + MAX_CHUNK_CHARS]))
        else:
            chunks.append((current_heading, content))

    for line in lines:
        if HEADING_RE.match(line):
            flush()
            current_lines = [line]
            current_heading = HEADING_RE.sub("", line).strip()
        else:
            current_lines.append(line)
    flush()
    return chunks


def file_to_url(path):
    rel = os.path.relpath(path, DOCS_DIR)
    rel = re.sub(r"\.mdx?$", "", rel)
    parts = [re.sub(r"^\d+-", "", p) for p in rel.split(os.sep)]
    rel = "/".join(parts)
    if rel.endswith("index"):
        rel = rel[: -len("index")]
    return DOCS_BASE_URL.rstrip("/") + "/" + rel.lstrip("/")


def embed(text, prefix):
    r = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": f"{prefix}{text}"},
        timeout=120,
    )
    r.raise_for_status()
    return r.json()["embedding"]


def main():
    files = sorted(
        glob.glob(os.path.join(DOCS_DIR, "**", "*.md"), recursive=True)
        + glob.glob(os.path.join(DOCS_DIR, "**", "*.mdx"), recursive=True)
    )
    print(f"Found {len(files)} docs files in {DOCS_DIR}")
    if not files:
        raise SystemExit("No .md/.mdx files found - check DOCS_DIR")

    all_chunks = []
    for path in files:
        with open(path, "r", encoding="utf-8") as f:
            raw = f.read()
        cleaned = clean_mdx(raw)
        url = file_to_url(path)
        for heading, content in chunk_by_headings(cleaned, os.path.basename(path)):
            if len(content.strip()) < 20:
                continue
            all_chunks.append(
                {
                    "source": os.path.relpath(path, DOCS_DIR),
                    "heading": heading,
                    "url": url,
                    "text": content.strip(),
                }
            )

    print(f"Built {len(all_chunks)} chunks. Embedding + indexing (this can take a few minutes on CPU)...")

    client = QdrantClient(url=QDRANT_URL)
    points = []
    vec_size = None
    for i, chunk in enumerate(all_chunks):
        vec = embed(chunk["text"], "search_document: ")
        if vec_size is None:
            vec_size = len(vec)
            if client.collection_exists(COLLECTION):
                client.delete_collection(COLLECTION)
            client.create_collection(
                collection_name=COLLECTION,
                vectors_config=VectorParams(size=vec_size, distance=Distance.COSINE),
            )
        points.append(PointStruct(id=str(uuid.uuid4()), vector=vec, payload=chunk))
        if (i + 1) % 10 == 0 or i + 1 == len(all_chunks):
            print(f"  embedded {i + 1}/{len(all_chunks)}")

    client.upsert(collection_name=COLLECTION, points=points)
    print(f"Indexed {len(points)} chunks into collection '{COLLECTION}'")


if __name__ == "__main__":
    main()
