import process from "node:process";

import { Command } from "commander";

// import { add } from '@/src/commands/add'
// import { diff } from '@/src/commands/diff'
// import { init } from '@/src/commands/init'
import { getPackageInfo } from "@/src/utils/get-package-info";
import { init } from "./commands/init";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const packageInfo = getPackageInfo();

  const program = new Command()
    .name("m3tw")
    .description("add components and dependencies to your project")
    .version(packageInfo.version || "0.0.1", "-v, --version", "display the version number");
  program.addCommand(init);
  //   program.addCommand(init).addCommand(add).addCommand(diff)

  program.parse();
}

main();
