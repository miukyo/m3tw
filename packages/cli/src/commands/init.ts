import { existsSync, promises as fs } from "node:fs";
import { Command } from "commander";
import prompts from "prompts";
import { z } from "zod";
import path from "node:path";
import consola from "consola";
import { DEFAULT_COMPONENTS, DEFAULT_TAILWIND_CONFIG, DEFAULT_UTILS, getConfig, rawConfigSchema, resolveConfigPaths, type Config } from "../utils/get-config";
import { colors } from "consola/utils";
import { getRegistryBaseColor, getRegistryBaseColors, getRegistryFrameworks } from "../utils/registry";
import ora from "ora";
import * as templates from "../utils/templates";
import { applyPrefixesCss } from "../utils/transformers/transform-tw-prefix";
import { addDependency } from "nypm";
import { transfromTwConfig } from "../utils/transformers/transform-tw-config";
import format from "js-beautify";

const PROJECT_DEPENDENCIES = ["tailwindcss-animate", "clsx", "class-variance-authority", "tailwind-merge"];

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean(),
});

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", process.cwd())
  .action(async (opts) => {
    try {
      const options = initOptionsSchema.parse(opts);
      const cwd = path.resolve(options.cwd);
      // Ensure target directory exists.
      if (!existsSync(cwd)) {
        consola.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }
      const existingConfig = await getConfig(cwd);
      const config = await promptForConfig(cwd, existingConfig, options.yes);
      await runinit(cwd, config);

      consola.log("");
      consola.info(`${colors.green("Success!")} Project initialization completed.`);
      consola.log("");
    } catch (e) {}
  });

export async function promptForConfig(cwd: string, defaultConfig: Config | null = null, skip = false) {
  const highlight = (text: string) => colors.cyan(text);

  const frameworks = await getRegistryFrameworks();
  const baseColors = getRegistryBaseColors();

  const options = await prompts([
    {
      type: "toggle",
      name: "typescript",
      message: `Would you like to use ${highlight("TypeScript")}? ${colors.gray("(recommended)")}?`,
      initial: defaultConfig?.typescript ?? true,
      active: "yes",
      inactive: "no",
    },
    {
      type: "select",
      name: "framework",
      message: `Which ${highlight("framework")} are you using?`,
      choices: frameworks.map((framework) => ({
        title: framework.label,
        value: framework.name,
      })),
    },
    {
      type: "select",
      name: "tailwindBaseColor",
      message: `Which color would you like to use as ${highlight("base color")}?`,
      choices: baseColors.map((color) => ({
        title: color.label,
        value: color.name,
      })),
    },
    {
      type: "text",
      name: "tsConfigPath",
      message: (prev, values) => `Where is your ${highlight(values.typescript ? "tsconfig.json" : "jsconfig.json")} file?`,
      initial: (prev, values) => {
        return values.typescript ? "tsconfig.json" : "jsconfig.json";
      },
    },
    {
      type: "text",
      name: "tailwindCss",
      message: `Where is your ${highlight("global CSS")} file? ${colors.gray("(this file will be overwritten)")}`,
      initial: "src/index.css",
    },
    {
      type: "text",
      name: "tailwindPrefix",
      message: `Are you using a custom ${highlight("tailwind prefix eg. tw-")}? (Leave blank if not)`,
      initial: "",
    },
    {
      type: "text",
      name: "tailwindConfig",
      message: `Where is your ${highlight("tailwind.config")} located? ${colors.gray("(this file will be overwritten)")}`,
      initial: (prev, values) => {
        if (defaultConfig?.tailwind.config) return defaultConfig?.tailwind.config;
        else return DEFAULT_TAILWIND_CONFIG;
      },
    },
    {
      type: "text",
      name: "components",
      message: `Configure the import alias for ${highlight("components")}:`,
      initial: defaultConfig?.aliases.components ?? DEFAULT_COMPONENTS,
    },
    {
      type: "text",
      name: "utils",
      message: `Configure the import alias for ${highlight("utils")}:`,
      initial: defaultConfig?.aliases.utils ?? DEFAULT_UTILS,
    },
  ]);

  const config = rawConfigSchema.parse({
    typescript: options.typescript,
    tsConfigPath: options.tsConfigPath,
    framework: options.framework,
    tailwind: {
      config: options.tailwindConfig,
      css: options.tailwindCss,
      baseColor: options.tailwindBaseColor,
      prefix: options.tailwindPrefix,
    },
    aliases: {
      utils: options.utils,
      components: options.components,
    },
  });

  if (!skip) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Write configuration to ${highlight("components.json")}. Proceed?`,
      initial: true,
    });

    if (!proceed) process.exit(0);
  }

  // Write to file.
  consola.log("");
  const spinner = ora("Writing components.json...").start();
  const targetPath = path.resolve(cwd, "components.json");
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8");
  spinner.succeed();

  return await resolveConfigPaths(cwd, config);
}

export async function runinit(cwd: string, config: Config) {
  const spinner = ora("Initializing project...")?.start();

  // Ensure all resolved paths directories exist.
  for (const [key, resolvedPath] of Object.entries(config.resolvedPaths)) {
    // Determine if the path is a file or directory.
    // TODO: is there a better way to do this?
    let dirname = path.extname(resolvedPath) ? path.dirname(resolvedPath) : resolvedPath;

    // If the utils alias is set to something like "@/lib/utils",
    // assume this is a file and remove the "utils" file name.
    // TODO: In future releases we should add support for individual utils.
    if (key === "utils" && resolvedPath.endsWith("/utils")) {
      // Remove /utils at the end.
      dirname = dirname.replace(/\/utils$/, "");
    }

    if (!existsSync(dirname)) await fs.mkdir(dirname, { recursive: true });
  }

  const extension = config.typescript ? "ts" : "js";

  try {
    const twConfig = await fs.readFile(config.resolvedPaths.tailwindConfig, "utf-8");
    const content = await transfromTwConfig(path.basename(config.resolvedPaths.tailwindConfig), twConfig, config);
    await fs.writeFile(config.resolvedPaths.tailwindConfig, format.js(content, { indent_size: 2 }), "utf-8");

    // Write css file.
    const baseColor = await getRegistryBaseColor(config.tailwind.baseColor);
    if (baseColor) {
      await fs.writeFile(
        config.resolvedPaths.tailwindCss,
        format.css(config.tailwind.prefix ? applyPrefixesCss(baseColor.cssVarsTemplate, config.tailwind.prefix) : baseColor.cssVarsTemplate, { indent_size: 2 }),
        "utf8"
      );
    }

    // Write cn file.
    await fs.writeFile(`${config.resolvedPaths.utils}.${extension}`, extension === "ts" ? templates.UTILS : templates.UTILS_JS, "utf8");
  } catch (e) {
    consola.error(e);
    process.exit(1);
  }
  spinner?.succeed();
  // Install dependencies.
  const dependenciesSpinner = ora("Installing dependencies...")?.start();
  const deps = [...PROJECT_DEPENDENCIES];

  await addDependency(deps, {
    cwd,
    silent: true,
  });

  dependenciesSpinner?.succeed();
}
