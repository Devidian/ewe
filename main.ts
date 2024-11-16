#!/usr/bin/env -S npx ts-node

import { argv, exit } from "node:process";
import { Logger } from "./lib/utils";
import { test } from "./lib/test";
import { writeFileSync } from "node:fs";
import { generateModFileList } from "./lib/sbcUtils";
import { generateXSLX } from "./lib/xslsUtils";

const logger = new Logger("main");

const [command] = argv.slice(2);

if (!command) {
  logger.error(`command argument missing! use ./main.ts [command]`);
  exit(1);
}

const commandHandler = {
  test: test,
  xlvanilla: () => {
    const files = generateModFileList("./se-vanilla");

    generateXSLX(files.filter((ent) => ent.name.endsWith(".sbc"))).then((buf) =>
      writeFileSync("resources/vanilla.data.xlsx", buf)
    );
  },
}[command];

if (!commandHandler) {
  logger.error(`Invalid command ${command} no handler found!`);
  exit(1);
}

commandHandler();
