import consola from "consola";
import { ofetch } from "ofetch";
import path from "node:path";
import { frameworksSchema, registryBaseColorSchema, registryIndexSchema, registryItemWithContentSchema, registryWithContentSchema } from "./schema";
import type { z } from "zod";
import type { Config } from "../get-config";

const baseUrl = process.env.COMPONENTS_REGISTRY_URL ?? "http://localhost:4321/";

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistry(["index.json"]);

    return registryIndexSchema.parse(result);
  } catch (error) {
    throw new Error("Failed to fetch components from registry.");
  }
}

export async function getRegistryFrameworks() {
  try {
    const [result] = await fetchRegistry(["frameworks/index.json"]);

    return frameworksSchema.parse(result);
  } catch (error) {
    throw new Error("Failed to fetch frameworks from registry.");
  }
}

export function getRegistryBaseColors() {
  return [
    {
      name: "red",
      label: "Red",
    },
    {
      name: "yellow",
      label: "Yellow",
    },
    {
      name: "green",
      label: "Green",
    },
    {
      name: "blue",
      label: "Blue",
    },
    {
      name: "purple",
      label: "Purple",
    },
  ];
}

export async function getRegistryBaseColor(baseColor: string) {
  try {
    const [result] = await fetchRegistry([`colors/${baseColor}.json`]);

    return registryBaseColorSchema.parse(result);
  } catch (error) {
    throw new Error("Failed to fetch base color from registry.");
  }
}

export async function resolveTree(index: z.infer<typeof registryIndexSchema>, names: string[]) {
  const tree: z.infer<typeof registryIndexSchema> = [];

  for (const name of names) {
    const entry = index.find((entry) => entry.name === name);

    if (!entry) continue;

    tree.push(entry);

    if (entry.registryDependencies) {
      const dependencies = await resolveTree(index, entry.registryDependencies);
      tree.push(...dependencies);
    }
  }

  return tree.filter((component, index, self) => self.findIndex((c) => c.name === component.name) === index);
}

export async function fetchTree(framework: string, tree: z.infer<typeof registryIndexSchema>) {
  try {
    const paths = tree.map((item) => `frameworks/${framework}/${item.name}.json`);
    const result = await fetchRegistry(paths);

    return registryWithContentSchema.parse(result);
  } catch (error) {
    throw new Error("Failed to fetch tree from registry." + error);
  }
}

export function getItemTargetPath(config: Config, item: Pick<z.infer<typeof registryItemWithContentSchema>, "type">, override?: string) {
  // Allow overrides for all items but ui.
  if (override) return override;

  if (item.type === "components:ui" && config.aliases.ui) return config.resolvedPaths.ui;

  const [parent, type] = item.type.split(":");
  if (!(parent in config.resolvedPaths)) return null;

  return path.join(config.resolvedPaths[parent as keyof typeof config.resolvedPaths], type);
}

async function fetchRegistry(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const response = await ofetch(`${baseUrl}/registry/${path}`);

        return response;
      })
    );
    return results;
  } catch (error) {
    consola.error(error);
    throw new Error(`Failed to fetch registry from ${baseUrl}.`);
  }
}
