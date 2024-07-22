import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Project } from "ts-morph";
import { framework as frameworkType, type Framework } from "../registry/framework";
import type { RegistryEntry } from "./schema";

const REGISTRY_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const componentType = ["ui"] as const;
const project = new Project();

//
// NOTE Get all registeries
//
export async function getRegistry() {
  let registeries = [];
  // filter folder to match available frameworks
  const dir = (await fs.readdir(REGISTRY_PATH, { withFileTypes: true })).filter((item) => item.isDirectory() && frameworkType.some((fw) => fw.name === item.name));
  for (const framework of dir) {
    // will return registeries folder path, ex: .../registry/react
    const componentPath = path.resolve(framework.parentPath, framework.name);
    for (const type of componentType) {
      // read folder for each component type
      const files = await fs.readdir(path.join(componentPath, type));
      for (const file of files) {
        const { registryDependencies, dependencies } = await getDependencies(path.join(componentPath, type, file));

        registeries.push({
          name: file.replace(path.extname(file), ""),
          type: `components:${type}` as const,
          file: path.join(type, file),
          registryDependencies: Array.from(registryDependencies),
          dependencies: Array.from(dependencies).filter((item) => item !== framework.name), // framework dependencies is not required
          framework: framework.name as Framework["name"],
        } satisfies RegistryEntry);
      }
    }
  }
  return registeries;
}

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "m3tw-"));
  return path.join(dir, filename);
}

async function getDependencies(filepath: string) {
  const tempFile = await createTempSourceFile(filepath);
  const raw = await fs.readFile(filepath, { encoding: "utf-8" });
  const registryDependencies = new Set<string>();
  const dependencies = new Set<string>();

  const sourceFile = project.createSourceFile(tempFile, raw);

  const importDeclarations = sourceFile.getImportDeclarations();
  for (const importDeclaration of importDeclarations) {
    const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
    if (moduleSpecifier.startsWith("@/registry/")) {
      registryDependencies.add(moduleSpecifier);
    } else {
      dependencies.add(moduleSpecifier);
    }
  }

  return { registryDependencies, dependencies };
}
