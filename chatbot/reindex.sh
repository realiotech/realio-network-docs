#!/usr/bin/env bash
# Pulls latest docs from git and re-runs the indexer.
set -euo pipefail
cd /root/realio-network-docs
git pull --ff-only
source chatbot/venv/bin/activate
python chatbot/index_docs.py
