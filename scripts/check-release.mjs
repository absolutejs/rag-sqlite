import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const rootPackageJson = JSON.parse(
  readFileSync(join(root, 'package.json'), 'utf8')
);

const platformTargets = [
  {
    dir: 'native/packages/darwin-arm64',
    binary: 'vec0.dylib',
    packageName: '@absolutejs/absolute-rag-sqlite-darwin-arm64'
  },
  {
    dir: 'native/packages/darwin-x64',
    binary: 'vec0.dylib',
    packageName: '@absolutejs/absolute-rag-sqlite-darwin-x64'
  },
  {
    dir: 'native/packages/linux-arm64',
    binary: 'vec0.so',
    packageName: '@absolutejs/absolute-rag-sqlite-linux-arm64'
  },
  {
    dir: 'native/packages/linux-x64',
    binary: 'vec0.so',
    packageName: '@absolutejs/absolute-rag-sqlite-linux-x64'
  },
  {
    dir: 'native/packages/windows-x64',
    binary: 'vec0.dll',
    packageName: '@absolutejs/absolute-rag-sqlite-windows-x64'
  }
];

let failed = false;

for (const target of platformTargets) {
  const packageJsonPath = join(root, target.dir, 'package.json');
  const binaryPath = join(root, target.dir, target.binary);
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  if (packageJson.name !== target.packageName) {
    console.error(
      `Name mismatch for ${target.dir}: expected ${target.packageName}, got ${packageJson.name}`
    );
    failed = true;
  }

  if (packageJson.version !== rootPackageJson.optionalDependencies[target.packageName]) {
    console.error(
      `Version mismatch for ${target.packageName}: root expects ${rootPackageJson.optionalDependencies[target.packageName]}, package has ${packageJson.version}`
    );
    failed = true;
  }

  if (!existsSync(binaryPath)) {
    console.warn(`Missing binary for ${target.packageName}: ${binaryPath}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('absolute-rag-sqlite release scaffold looks consistent');
