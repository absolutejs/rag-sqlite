import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const rootPackageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);
const packageVersion = rootPackageJson.version;
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

const packages = [
  "native/packages/darwin-arm64",
  "native/packages/darwin-x64",
  "native/packages/linux-arm64",
  "native/packages/linux-x64",
  "native/packages/windows-x64",
  ".",
];

for (const relativeDir of packages) {
  const cwd = relativeDir === "." ? root : join(root, relativeDir);
  const command = ["publish", "--access", "public"];

  if (dryRun) {
    command.push("--dry-run");
  }

  console.log(
    `Publishing ${relativeDir} @ ${packageVersion}${dryRun ? " (dry-run)" : ""}`,
  );
  const result = spawnSync("bun", command, { cwd, stdio: "inherit" });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
