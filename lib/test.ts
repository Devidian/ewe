import { writeFileSync } from "fs";
import {
  builder,
  generateModFileList,
  parser,
  readFileCheckBOM,
  readFileConvertToJSON,
} from "./sbcUtils";
import { Logger, mergeObjects } from "./utils";
import { generateXSLX } from "./xslsUtils";

const logger = new Logger("test");

export function test() {
  const files = generateModFileList("./se-vanilla");

  generateXSLX(files.filter((ent) => ent.name.endsWith(".sbc"))).then((buf) =>
    writeFileSync("test.local.xlsx", buf)
  );
}

function testCreateCubeBlocksList() {
  const files = generateModFileList("./se-vanilla");

  let definitionsTree: any = {};

  for (const fileEnt of files.filter((ent) => ent.name.endsWith(".sbc"))) {
    const data = readFileConvertToJSON(fileEnt);
    if (!data.Definitions) {
      logger.warn(`problem with ${fileEnt.name}`, data);
      continue;
    }
    if (!Object.keys(data.Definitions).includes("CubeBlocks")) continue;
    logger.verbose(`Merging ${fileEnt.name}`);
    definitionsTree = mergeObjects(definitionsTree, data);
  }

  writeFileSync(
    "def.cube-blocks.local.json",
    JSON.stringify(definitionsTree, undefined, 2)
  );
}

function testCreateCombinedJSONFromAllSBC() {
  const files = generateModFileList("./se-vanilla");

  let definitionsTree: any = {};

  for (const fileEnt of files.filter((ent) => ent.name.endsWith(".sbc"))) {
    const data = readFileConvertToJSON(fileEnt);
    if (!data.Definitions) {
      logger.warn(`problem with ${fileEnt.name}`, data);
      continue;
    }
    logger.verbose(`Merging ${fileEnt.name}`);
    definitionsTree = mergeObjects(definitionsTree, data);
  }
  writeFileSync(
    "deftree.local.json",
    JSON.stringify(definitionsTree, undefined, 2)
  );
  writeFileSync(
    "def.type-names.local.json",
    JSON.stringify(Object.keys(definitionsTree.Definitions), undefined, 2)
  );
}

function testReadAndWriteSBC() {
  const files = generateModFileList("./core-components");

  const [firstFile] = files.filter((ent) => ent.name.endsWith(".sbc"));

  const xmlContent = readFileCheckBOM(firstFile);

  const jsonContent = parser.parse(xmlContent);
  logger.log(jsonContent);
  //   logger.log(jsonContent.Definitions.AmmoMagazines.AmmoMagazine);
  const rebuildXML = builder.build(jsonContent);
  writeFileSync("local.test.xml", rebuildXML, "utf8");
}
