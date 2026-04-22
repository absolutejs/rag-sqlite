import {
  createRAGCollection,
  createSQLiteRAGStore as createCoreSQLiteRAGStore,
  ragPlugin,
  resolveAbsoluteSQLiteVec,
  resolveAbsoluteSQLiteVecExtensionPath,
} from "@absolutejs/rag";

export const ABSOLUTE_SQLITE_RAG_PACKAGE_NAME =
  "@absolutejs/absolute-rag-sqlite";

const nativeMessageFromResolution = (resolution) => {
  switch (resolution?.status) {
    case "resolved":
      return 'Native sqlite vec support is installed and can be activated with native.mode="vec0".';
    case "package_not_installed":
      return `Install ${ABSOLUTE_SQLITE_RAG_PACKAGE_NAME} and restart to let AbsoluteJS resolve the platform sqlite vec package automatically.`;
    case "binary_missing":
      return "The platform sqlite vec package was resolved but its native library file is missing.";
    case "unsupported_platform":
      return `No sqlite vec platform package is defined for ${resolution.platformKey}. JSON fallback remains available.`;
    case "package_invalid":
      return "The installed sqlite vec package is invalid. Reinstall the backend package and restart.";
    case "not_configured":
    default:
      return "Native sqlite vec support is not configured. JSON fallback remains available.";
  }
};

export const createSQLiteRAGStore = (options = {}) =>
  createCoreSQLiteRAGStore(options);

export const createSQLiteRAGCollection = (options = {}) => {
  const store =
    options.store ?? createSQLiteRAGStore(options.storeOptions ?? {});
  return createRAGCollection({ store });
};

export const createSQLiteRAG = (options = {}) => {
  const store =
    options.store ?? createSQLiteRAGStore(options.storeOptions ?? {});
  const collection = options.collection ?? createRAGCollection({ store });

  return {
    store,
    collection,
    getStatus: () => collection.getStatus?.() ?? store.getStatus?.(),
    getCapabilities: () =>
      collection.getCapabilities?.() ?? store.getCapabilities?.(),
    getNativeSupport: () => summarizeSQLiteRAGSupport(collection),
  };
};

export const createSQLiteRAGBackend = createSQLiteRAG;

export const getSQLiteRAGNativeSupport = () => resolveAbsoluteSQLiteVec();

export const summarizeSQLiteRAGSupport = (target) => {
  const status = target?.getStatus?.();
  const capabilities = target?.getCapabilities?.();
  const resolution = status?.native?.resolution ?? resolveAbsoluteSQLiteVec();
  const nativeRequested = status?.native?.requested ?? false;
  const nativeActive = status?.native?.active ?? false;

  let actionableMessage = nativeMessageFromResolution(resolution);

  if (nativeActive) {
    actionableMessage = "Native sqlite vec0 is active for this store.";
  } else if (resolution?.status === "resolved" && nativeRequested) {
    actionableMessage =
      "Native sqlite vec is installed, but this store is still running in fallback mode. Check the store diagnostics for load or query errors.";
  }

  return {
    backendPackageName: ABSOLUTE_SQLITE_RAG_PACKAGE_NAME,
    recommendedInstallCommand: `bun add ${ABSOLUTE_SQLITE_RAG_PACKAGE_NAME}`,
    resolution,
    status,
    capabilities,
    nativeRequested,
    nativeActive,
    actionableMessage,
  };
};

export {
  createRAGCollection,
  ragPlugin,
  resolveAbsoluteSQLiteVec,
  resolveAbsoluteSQLiteVecExtensionPath,
};
