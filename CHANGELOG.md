# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [0.2.0] - 2026-02-28

### Added
- Backend metadata CRUD endpoints for banks, card types, and card networks with authenticated write operations.
- Frontend API client methods for create/update/delete on metadata entities.
- Admin UI edit actions for card types and card networks.
- Standard fee field persistence for late payment, overlimit, cash advance, foreign transaction, returned payment, and card replacement fees.
- Vite manual chunk strategy for improved production bundle splitting.

### Changed
- Admin metadata management now uses API-backed persistence instead of local-only state updates.
- Metadata responses are normalized with a consistent `name` field.
- Replaced unresolved design-time image import in frontend seed data with a stable runtime URL.

### Fixed
- Production build failure caused by unresolved `figma:asset/...` import.
- Build warnings from oversized output chunk by splitting major vendor groups.

### Build
- Regenerated `designinhtmlcss/dist` outputs after source and build-config updates.
