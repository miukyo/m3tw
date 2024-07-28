import { promises as fs } from "fs";
import { tmpdir } from "os";
import path from "path";
import { type Config } from "@/src/utils/get-config";
import { registryBaseColorSchema } from "@/src/utils/registry/schema";
import { transformCssVars } from "@/src/utils/transformers/transform-css-vars";
import { transformImport } from "@/src/utils/transformers/transform-import";
import { transformTwPrefixes } from "@/src/utils/transformers/transform-tw-prefix";
import { transformSFC } from "@/src/utils/transformers/transform-sfc";
import { Project, ScriptKind, type SourceFile } from "ts-morph";
import { z } from "zod";

export type TransformOpts = {
  filename: string;
  raw: string;
  config: Config;
  baseColor?: z.infer<typeof registryBaseColorSchema>;
  alias?: string[];
};

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile;
  }
) => Promise<Output>;

const transformers: Transformer[] = [transformImport, transformCssVars, transformTwPrefixes];

const project = new Project({
  compilerOptions: {},
});

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "m3tw-"));
  return path.join(dir, filename);
}

export async function transform(opts: TransformOpts) {
  const tempFile = await createTempSourceFile(opts.filename);
  const sourceFile = project.createSourceFile(tempFile, opts.raw, {
    scriptKind: ScriptKind.TSX,
  });

  for (const transformer of transformers) {
    transformer({ sourceFile, ...opts });
  }

  return await transformSFC({
    sourceFile,
    ...opts,
  });
}
