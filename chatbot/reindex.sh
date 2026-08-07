#!/usr/bin/env bash
# Pulls latest docs from git and re-runs the indexer.
#
# IMPORTANT: this checkout must track the SAME branch that production
# docs.realio.network is built from (see .github/workflows/prod.yaml -
# currently `main`). If this box sits on a stale branch, the chatbot will
# confidently answer from docs that no longer match what users see.
set -euo pipefail

REPO_DIR="${REPO_DIR:-/root/realio-network-docs}"
DOCS_BRANCH="${DOCS_BRANCH:-main}"

cd "$REPO_DIR"

current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$current_branch" != "$DOCS_BRANCH" ]; then
  echo "WARNING: checkout is on '$current_branch' but indexing should track" \
       "'$DOCS_BRANCH' (the branch production is built from)." >&2
  echo "Switching to $DOCS_BRANCH..." >&2
  git checkout "$DOCS_BRANCH"
fi

git pull --ff-only
source chatbot/venv/bin/activate
python chatbot/index_docs.py
