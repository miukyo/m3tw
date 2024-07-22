import { fileURLToPath } from "node:url";
import path from "pathe";
import fs from "node:fs";
import type { PackageJson } from "type-fest";

export function getPackageInfo() {
  const packageJsonPath = getPackageFilePath("../package.json");
  return fs.readFileSync(packageJsonPath, "utf-8") as PackageJson;
}

function getPackageFilePath(filePath: string) {
  const distPath = fileURLToPath(new URL(".", import.meta.url));

  return path.resolve(distPath, filePath);
}
