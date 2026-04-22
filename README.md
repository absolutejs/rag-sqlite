# @absolutejs/absolute-rag-sqlite

SQLite adapter package for AbsoluteJS RAG workflows.

This package is not the RAG feature itself. Core `@absolutejs/absolute` owns the
workflow model, hooks, plugin protocol, and fallback behavior. This package owns
SQLite-specific backend ergonomics and optional native sqlite-vec acceleration.

## Install

```bash
bun add @absolutejs/absolute-rag-sqlite
```

## Supported native targets

The optional native sqlite-vec path currently vendors upstream binaries for:

- macOS arm64
- macOS x64
- Linux arm64
- Linux x64
- Windows x64

Unsupported targets stay on the owned fallback path until a backend package adds
support for them.

## What it gives you

- `createSQLiteRAGStore(...)`: SQLite-backed RAG store
- `createSQLiteRAGCollection(...)`: convenience wrapper that creates the store and collection together
- `createSQLiteRAG(...)`: one-shot SQLite RAG bundle with `store`, `collection`, and native support helpers
- `getSQLiteRAGNativeSupport()`: inspect whether the platform sqlite vec package is available
- `summarizeSQLiteRAGSupport(...)`: turn store diagnostics into an actionable backend summary

## Basic usage

```ts
import { createSQLiteRAG, ragPlugin } from "@absolutejs/absolute-rag-sqlite";

const rag = createSQLiteRAG({
  storeOptions: {
    path: "./rag.sqlite",
    native: {
      mode: "vec0"
    }
  }
});

app.use(
  ragPlugin({
    path: "/rag",
    collection: rag.collection
  })
);
```

## Native vec0 behavior

`sqlite-vec` is treated as an optional accelerator.

- If the platform package is available and `native.mode` is set to `"vec0"`, the store can activate native vec0 search.
- If it is unavailable, AbsoluteJS falls back to the owned JSON/sqlite-table path.
- Your application code does not need to hardcode native library paths in the normal case.

You can inspect what happened at runtime:

```ts
const support = rag.getNativeSupport();
console.log(support.actionableMessage);
```

## Release flow

```bash
bun run vendor:binaries
bun run check
bun run publish:all
```

The vendoring script verifies upstream checksums before copying binaries into the
platform package directories.

## Scope

This package should stay replaceable.

- SQLite is one backend path.
- Core AbsoluteJS must continue to work without it.
- Future backends such as `@absolutejs/absolute-rag-pgvector` should fit the same adapter contract.
