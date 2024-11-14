#!/usr/bin/env -S npx ts-node

import { argv, exit } from "node:process";
import { Logger } from "./lib/utils";
import { test } from "./lib/test";

const logger = new Logger("main");

const [command] = argv.slice(2);

if (!command) {
  logger.error(`command argument missing! use ./main.ts [command]`);
  exit(1);
}

const commandHandler = {
  test: test,
}[command];

if (!commandHandler) {
  logger.error(`Invalid command ${command} no handler found!`);
  exit(1);
}

commandHandler();