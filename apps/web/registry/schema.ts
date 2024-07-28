import { z } from "zod";
import { framework, type Framework } from "./framework";

const frameworks = framework.map((a) => a.name) as [...[Framework["name"]]];

export const registryEntrySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
  framework: z.enum(frameworks),
  type: z.enum(["components:ui", "components:primitive"]),
  category: z.string().optional(),
});

export const registrySchema = z.array(registryEntrySchema);

export type RegistryEntry = z.infer<typeof registryEntrySchema>;

export type Registry = z.infer<typeof registrySchema>;
