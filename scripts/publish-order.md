# Publish Order

1. Publish the six platform packages in `native/packages/*`.
2. Publish `@absolutejs/absolute-rag-sqlite`.
3. Install `@absolutejs/absolute-rag-sqlite` in consuming apps.

Do not publish the root package before the platform packages, or users may install
the feature package without any matching native package being available yet.
