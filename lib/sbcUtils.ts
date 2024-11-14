import { Dirent, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Logger } from "./utils";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

const BOMrx = /^\uFEFF/;
const logger = new Logger("sbcUtils");

export const parser = new XMLParser({
  attributeNamePrefix: "@_",
  ignoreAttributes: false,
});
export const builder = new XMLBuilder({
  attributeNamePrefix: "@_",
  format: true,
  ignoreAttributes: false,
  suppressEmptyNode: true,
});

export function generateModFileList(rootDirectory: string | string[]) {
  const directoriesToScan = Array.isArray(rootDirectory)
    ? rootDirectory
    : [rootDirectory];

  return directoriesToScan.flatMap((dir) =>
    readdirSync(dir, {
      recursive: true,
      encoding: "utf8",
      withFileTypes: true,
    }).filter((entry) => entry.isFile())
  );
}

export function readFileCheckBOM(file: Dirent) {
  const path = resolve(file.parentPath, file.name);
  let content = readFileSync(path, { encoding: "utf8" });
  if (content.match(BOMrx)) {
    content.replace(BOMrx, "");
    writeFileSync(path, content, "utf8");
    logger.warn(`BOM detected and removed on file ${path}`);
  }
  return content;
}

export function readFileConvertToJSON(file: Dirent) {
  const rawContent = readFileCheckBOM(file);
  return parser.parse(rawContent);
}
