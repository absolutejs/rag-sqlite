# Next Steps

1. Run `bun run vendor:binaries` whenever `sqliteVec.version` changes.
2. Keep the root package focused on adapter ergonomics, not core workflow APIs.
3. Verify that installing `@absolutejs/absolute-rag-sqlite` pulls the correct platform package on each supported OS/arch.
4. Publish the platform packages before the root package.
5. Add `@absolutejs/absolute-rag-pgvector` next so SQLite is not the only serious backend path.
