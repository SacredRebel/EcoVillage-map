#!/usr/bin/env bash
# Vercel "ignored build step": exit 0 = skip the build, exit 1 = build.
# Commits that only touch the git-backed data (research list, uploads, icon layout, the provider
# meter and miss list) are read by the live site at request time through lib/store.js, so they need
# no redeploy. The meter in particular is written by the app itself on every vendor lookup - before
# this, each one cost a full rebuild and another deployment kept forever.
set -u
if ! git rev-parse --verify HEAD^ >/dev/null 2>&1; then exit 1; fi
if git diff --quiet HEAD^ HEAD -- . ':(exclude)data/research.json' ':(exclude)data/uploads.json' ':(exclude)data/zone-positions.json' ':(exclude)data/structures.json' ':(exclude)data/watch.json' ':(exclude)data/provider-meter.json' ':(exclude)data/provider-misses.json' ':(exclude)images/uploads' ':(exclude)docs/uploads'; then
  echo "only git-backed data changed — no build needed"; exit 0
fi
exit 1
