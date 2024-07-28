import { createRequire } from "node:module";
import { type Transformer } from "@/src/utils/transformers";
import { transform } from "detype";

export async function transformByDetype(content: string, filename: string) {
  return await transform(content, filename, {
    removeTsComments: true,
  });
}

export const transformSFC: Transformer<string> = async ({ sourceFile, config, filename }) => {
  const output = sourceFile?.getFullText();
  if (config?.typescript) return output;

  return await transformByDetype(output, filename);
};
