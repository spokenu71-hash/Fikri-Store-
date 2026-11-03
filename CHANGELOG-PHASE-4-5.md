# Changelog — Phase 4–5

- Extracted catalog price formatting, product row mapping, image parsing, specification parsing, and filtering into a pure utility module.
- Added dependency-free Node.js tests for catalog transformations and filtering.
- Preserved the existing Supabase table query and field assumptions; no schema changes.
- Added a test report distinguishing automated coverage from browser and production checks that remain outstanding.
