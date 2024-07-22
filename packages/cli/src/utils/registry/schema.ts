import { z } from "zod";

// TODO: Extract this to a shared package.
export const registryItemSchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.string(),
  framework: z.enum(["react", "vue", "svelte"]),
  type: z.enum(["components:ui", "components:primitive"]),
});

export const registryIndexSchema = z.array(registryItemSchema);

export const registryItemWithContentSchema = registryItemSchema.extend({
  files: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
    })
  ),
});

export const registryWithContentSchema = z.array(registryItemWithContentSchema);

export const frameworksSchema = z.array(
  z.object({
    name: z.string(),
    label: z.string(),
  })
);

export const registryBaseColorSchema = z.object({
  cssVars: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string()),
  }),
  inlineColorsTemplate: z.string(),
  cssVarsTemplate: z.string(),
});

