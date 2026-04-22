import type {
  RAGBackendCapabilities,
  RAGCollection,
  RAGVectorStore,
  RAGVectorStoreStatus,
  SQLiteRAGStoreOptions,
  SQLiteVecResolution
} from '@absolutejs/rag';
import {
  createRAGCollection,
  createSQLiteRAGStore as createCoreSQLiteRAGStore,
  ragPlugin,
  resolveAbsoluteSQLiteVec,
  resolveAbsoluteSQLiteVecExtensionPath
} from '@absolutejs/rag';

export declare const ABSOLUTE_SQLITE_RAG_PACKAGE_NAME = "@absolutejs/absolute-rag-sqlite";

export type SQLiteRAGCollectionOptions = {
  store?: RAGVectorStore;
  storeOptions?: SQLiteRAGStoreOptions;
};

export type SQLiteRAGOptions = {
  store?: RAGVectorStore;
  collection?: RAGCollection;
  storeOptions?: SQLiteRAGStoreOptions;
};

export type SQLiteRAGSupportSummary = {
  backendPackageName: typeof ABSOLUTE_SQLITE_RAG_PACKAGE_NAME;
  recommendedInstallCommand: string;
  resolution: SQLiteVecResolution;
  status?: RAGVectorStoreStatus;
  capabilities?: RAGBackendCapabilities;
  nativeRequested: boolean;
  nativeActive: boolean;
  actionableMessage: string;
};

export type SQLiteRAG = {
  store: RAGVectorStore;
  collection: RAGCollection;
  getStatus: () => RAGVectorStoreStatus | undefined;
  getCapabilities: () => RAGBackendCapabilities | undefined;
  getNativeSupport: () => SQLiteRAGSupportSummary;
};

export declare const createSQLiteRAGStore: typeof createCoreSQLiteRAGStore;
export declare const createSQLiteRAGCollection: (options?: SQLiteRAGCollectionOptions) => RAGCollection;
export declare const createSQLiteRAG: (options?: SQLiteRAGOptions) => SQLiteRAG;
export declare const createSQLiteRAGBackend: typeof createSQLiteRAG;
export declare const getSQLiteRAGNativeSupport: typeof resolveAbsoluteSQLiteVec;
export declare const summarizeSQLiteRAGSupport: (target?: Pick<RAGCollection, 'getStatus' | 'getCapabilities'> | Pick<RAGVectorStore, 'getStatus' | 'getCapabilities'>) => SQLiteRAGSupportSummary;

export {
  createRAGCollection,
  ragPlugin,
  resolveAbsoluteSQLiteVec,
  resolveAbsoluteSQLiteVecExtensionPath
};

export type {
  RAGBackendCapabilities,
  RAGCollection,
  RAGVectorStore,
  RAGVectorStoreStatus,
  SQLiteRAGStoreOptions,
  SQLiteVecResolution
};
