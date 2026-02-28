#!/usr/bin/env bash

set -euo pipefail

REPO=""
REF="main"
APPLY="false"
TARGET_ROOT="designinhtmlcss"
declare -a PATHS=()

usage() {
  cat <<'EOF'
Usage:
  scripts/sync_upstream_design.sh \
    --repo owner/repo \
    [--ref <branch|tag|commit>] \
    --path <file-or-dir-under-upstream> [--path <...>] \
    [--target-root designinhtmlcss] \
    [--apply]

Examples:
  # Preview only (no file changes)
  scripts/sync_upstream_design.sh \
    --repo wakican4d-hash/designinhtmlcss \
    --ref 82e13ef \
    --path src/app/pages/AdminPage.tsx

  # Apply selected paths into local design folder
  scripts/sync_upstream_design.sh \
    --repo wakican4d-hash/designinhtmlcss \
    --ref main \
    --path src/app/pages/AdminPage.tsx \
    --path src/app/lib/api.ts \
    --apply

Notes:
- This script only syncs the explicit --path entries you pass.
- Upstream paths are copied into <target-root>/<path>.
- Without --apply, it runs in preview mode and prints diffs/stats only.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      REPO="${2:-}"
      shift 2
      ;;
    --ref)
      REF="${2:-}"
      shift 2
      ;;
    --path)
      PATHS+=("${2:-}")
      shift 2
      ;;
    --target-root)
      TARGET_ROOT="${2:-}"
      shift 2
      ;;
    --apply)
      APPLY="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$REPO" ]]; then
  echo "Error: --repo is required" >&2
  usage
  exit 1
fi

if [[ ${#PATHS[@]} -eq 0 ]]; then
  echo "Error: at least one --path is required" >&2
  usage
  exit 1
fi

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
DEST_ROOT="$ROOT_DIR/$TARGET_ROOT"

if [[ ! -d "$DEST_ROOT" ]]; then
  echo "Error: target root not found: $DEST_ROOT" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "Cloning https://github.com/$REPO at ref '$REF'..."
git clone --quiet "https://github.com/$REPO.git" "$TMP_DIR/upstream"
git -C "$TMP_DIR/upstream" checkout --quiet "$REF"

echo
echo "Mode: $([[ "$APPLY" == "true" ]] && echo "APPLY" || echo "PREVIEW")"
echo "Target root: $DEST_ROOT"

for relative in "${PATHS[@]}"; do
  SRC_PATH="$TMP_DIR/upstream/$relative"
  DST_PATH="$DEST_ROOT/$relative"

  if [[ ! -e "$SRC_PATH" ]]; then
    echo
    echo "[SKIP] Missing in upstream: $relative"
    continue
  fi

  echo
  echo "=== $relative ==="

  if [[ -d "$SRC_PATH" ]]; then
    mkdir -p "$DST_PATH"
    echo "Directory sync preview:"
    rsync -aivn --delete "$SRC_PATH/" "$DST_PATH/" | sed '/^sending incremental file list$/d' || true

    if [[ "$APPLY" == "true" ]]; then
      rsync -ai --delete "$SRC_PATH/" "$DST_PATH/" | sed '/^sending incremental file list$/d' || true
    fi
  else
    mkdir -p "$(dirname "$DST_PATH")"

    if [[ -f "$DST_PATH" ]]; then
      git --no-pager diff --no-index --stat "$DST_PATH" "$SRC_PATH" || true
      git --no-pager diff --no-index "$DST_PATH" "$SRC_PATH" | sed -n '1,160p' || true
    else
      echo "New file will be added: $relative"
    fi

    if [[ "$APPLY" == "true" ]]; then
      cp "$SRC_PATH" "$DST_PATH"
      echo "Applied: $relative"
    fi
  fi
done

echo
if [[ "$APPLY" == "true" ]]; then
  echo "Applied changes. Current git status:"
  git -C "$ROOT_DIR" status --short
else
  echo "Preview complete. Re-run with --apply to copy selected paths."
fi
