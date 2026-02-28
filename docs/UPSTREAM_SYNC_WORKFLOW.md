## Safe Upstream Sync Workflow

Use this when pulling design code from another GitHub repo.

### Why this workflow
- Syncs only explicit files/folders (no accidental full overwrite).
- Lets you pin a branch/tag/commit.
- Supports preview mode before applying any change.

### Script
- `scripts/sync_upstream_design.sh`

### Preview first (recommended)
```bash
scripts/sync_upstream_design.sh \
  --repo wakican4d-hash/designinhtmlcss \
  --ref main \
  --path src/app/pages/AdminPage.tsx
```

### Apply selected paths
```bash
scripts/sync_upstream_design.sh \
  --repo wakican4d-hash/designinhtmlcss \
  --ref 82e13ef \
  --path src/app/pages/AdminPage.tsx \
  --path src/app/lib/api.ts \
  --apply
```

### After apply
1. Run build: `npm --prefix designinhtmlcss run build && npm run build`
2. Sync static output if needed:
   - `rm -rf public/designinhtmlcss && mkdir -p public/designinhtmlcss`
   - `cp -R designinhtmlcss/dist/. public/designinhtmlcss/`
3. Review `git status` and commit.
