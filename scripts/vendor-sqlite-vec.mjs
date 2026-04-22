import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url);
const rootPath = root.pathname;
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const sqliteVecVersion = packageJson.sqliteVec?.version;

if (typeof sqliteVecVersion !== 'string' || sqliteVecVersion.length === 0) {
  throw new Error('package.json must define sqliteVec.version');
}

const targets = [
  {
    npmPackage: 'sqlite-vec-darwin-arm64',
    sourceBinary: 'vec0.dylib',
    packageDir: 'native/packages/darwin-arm64',
    destBinary: 'vec0.dylib'
  },
  {
    npmPackage: 'sqlite-vec-darwin-x64',
    sourceBinary: 'vec0.dylib',
    packageDir: 'native/packages/darwin-x64',
    destBinary: 'vec0.dylib'
  },
  {
    npmPackage: 'sqlite-vec-linux-arm64',
    sourceBinary: 'vec0.so',
    packageDir: 'native/packages/linux-arm64',
    destBinary: 'vec0.so'
  },
  {
    npmPackage: 'sqlite-vec-linux-x64',
    sourceBinary: 'vec0.so',
    packageDir: 'native/packages/linux-x64',
    destBinary: 'vec0.so'
  },
  {
    npmPackage: 'sqlite-vec-windows-x64',
    sourceBinary: 'vec0.dll',
    packageDir: 'native/packages/windows-x64',
    destBinary: 'vec0.dll'
  }
];

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: { 'accept': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const fetchBuffer = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed for ${url}: ${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
};

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

const main = async () => {
  const manifestUrl = `https://github.com/asg017/sqlite-vec/releases/download/v${sqliteVecVersion}/sqlite-dist-manifest.json`;
  const manifest = await fetchJson(manifestUrl);
  const releaseArtifacts = new Map(
    (manifest.artifacts ?? []).map((artifact) => [artifact.name, artifact])
  );

  for (const target of targets) {
    const metadataUrl = `https://registry.npmjs.org/${target.npmPackage}/${sqliteVecVersion}`;
    const metadata = await fetchJson(metadataUrl);
    const tarballUrl = metadata.dist?.tarball;

    if (typeof tarballUrl !== 'string') {
      throw new Error(`No dist.tarball found for ${target.npmPackage}@${sqliteVecVersion}`);
    }

    const expectedArtifactName = `${target.npmPackage}.tar.gz`;
    const releaseArtifact = releaseArtifacts.get(expectedArtifactName);

    if (!releaseArtifact) {
      throw new Error(`Upstream release manifest is missing ${expectedArtifactName}`);
    }

    const tarballBuffer = await fetchBuffer(tarballUrl);
    const actualSha = sha256(tarballBuffer);

    if (actualSha !== releaseArtifact.checksum_sha256) {
      throw new Error(
        `Checksum mismatch for ${target.npmPackage}@${sqliteVecVersion}: expected ${releaseArtifact.checksum_sha256}, got ${actualSha}`
      );
    }

    const workingDir = mkdtempSync(join(tmpdir(), 'absolute-rag-sqlite-'));
    const tarballPath = join(workingDir, `${target.npmPackage}.tgz`);
    writeFileSync(tarballPath, tarballBuffer);

    try {
      execFileSync('tar', ['-xzf', tarballPath, '-C', workingDir], { stdio: 'pipe' });
      const extractedBinary = join(workingDir, 'package', target.sourceBinary);

      if (!existsSync(extractedBinary)) {
        throw new Error(`Expected ${target.sourceBinary} inside ${target.npmPackage} tarball`);
      }

      const destinationPath = join(rootPath, target.packageDir, target.destBinary);
      copyFileSync(extractedBinary, destinationPath);
      console.log(`Vendored ${target.npmPackage}@${sqliteVecVersion} -> ${destinationPath}`);
    } finally {
      rmSync(workingDir, { recursive: true, force: true });
    }
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
