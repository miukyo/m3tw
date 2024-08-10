import { Project, ScriptKind, SyntaxKind } from "ts-morph";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import * as templates from "@/src/utils/templates";
import path from "path";
import { Config } from "../get-config";
import { transformSFC } from "./transform-sfc";
import { Transformer } from ".";

const project = new Project();

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "m3tw-"));
  return path.join(dir, filename);
}

export async function transfromTwConfig(filename: string, raw: string, config: Config) {
  const tempFile = await createTempSourceFile(filename);
  const file = project.createSourceFile(tempFile, raw, {
    scriptKind: ScriptKind.TS,
  });

  const transform: Transformer = async ({ sourceFile }) => {
    sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment).forEach((node) => {
      if (node.wasForgotten()) return;
      if (node.getName() === "theme") {
        node.replaceWithText(`theme: { extend: {${templates.TAILWIND_CONFIG_THEME_EXTEND}} }`);
      }
      if (config.tailwind.prefix) {
        if (node.getName() === "prefix") {
          node.replaceWithText(config.tailwind.prefix);
        } else {
          sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)[0].addPropertyAssignment({ name: "prefix", initializer: config.tailwind.prefix });
        }
      }
    });
    sourceFile.formatText({ indentSize: 2 });
    return sourceFile;
  };

  const opts = { raw, config, filename };

  transform({ sourceFile: file, ...opts });
  transformSFC({ sourceFile: file, ...opts });
  return file.getFullText();
}
