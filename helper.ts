#!/usr/bin/env -S npx ts-node

import { COPYFILE_EXCL } from "node:constants";
import {
  copyFileSync,
  Dirent,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { EOL } from "node:os";
import { basename, relative, resolve } from "node:path";
import { cwd } from "node:process";
import { convertXML } from "simple-xml-to-json";
import * as xl from "excel4node";

const rootPath = "minerals-core/";
const templateVoxelMaterialsPath = "templates/VoxelMaterials_template.sbc";

const extractiveNames = [
  "Stone",
  "Stone_01",
  "Stone_02",
  "Stone_03",
  "Stone_04",
  "Stone_05",
  "DesertRocks",
  "MarsRocks",
  "Anorthite",
  "AlienRockyTerrain",
  "AlienRockyMountain",
  "Sand_02",
  "AlienSand",
  "Soil",
  "MarsSoil",
  "Regolith",
  "AlienSoil",
  "Grass",
  "Grass_bare",
  "Grass_old",
  "Grass_old_bare",
  "Grass_02",
  "Woods_grass",
  "Woods_grass_bare",
  "Rocks_grass",
  "AlienGreenGrass",
  "AlienGreenGrass_bare",
  "AlienOrangeGrass",
  "AlienOrangeGrass_bare",
  "AlienYellowGrass",
  "AlienYellowGrass_bare",
  "AlienRockGrass",
  "AlienRockGrass_bare",
  "CarbonTetrachloride_AminoAcids",
];

const compositesNames: string[] = [
  "Arsenolite",
  "Bauxite",
  "Beryl",
  "Cassiterite",
  "Cerite",
  "Chaoite",
  "Chromferide",
  "Chromite",
  "Cinnabar",
  "Chalcopyrite",
  "Chamosite",
  "Coal",
  "Cobaltite",
  "Dolomite",
  "Ferchromide",
  "Fluorapatite",
  "Graphite",
  "Germanite",
  "Halite",
  "Hematite",
  "Ilmenite",
  "Indite",
  "Kentbrooksite",
  "Lepidolite",
  "Olivine",
  "Orpiment",
  "Pyrochlore",
  "Pyrite",
  "Quartz",
  "Realgar",
  "Rhodochrosite",
  "Rutheniridosmine",
  "Ruthenarsenite",
  "Spodumene",
  "Sylvite",
  "Sphalerite",
  "Sulfur",
  "Titanite",
  "Wulfenite",
  "Fontarnauite",
  "Boracite",
  "Borcarite",
  "Strontiofluorite",
  "Calaverite",
  "Cadmoindite",
  "Cadmoselite",
  "Telluropalladinite",
  "Palladseite",
  "Columbite",
  "Stibiotantalite",
  "Bismutotantalite",
  "Iodargyrite",
];

const compositesRadioActiveNames: string[] = [
  "Coffinite",
  "Hafnon",
  "Huttonite",
  "Monazite",
  "Thorite",
  "Uraninite_01",
  "Pitchblend",
  "Zircon",
];

function createExtractiveFiles() {
  for (const name of extractiveNames) {
    const targetFilePath = resolve(
      rootPath,
      "Data",
      "VoxelMaterials",
      "Extractive",
      `VoxelMaterials_${name}.sbc`
    );
    if (existsSync(targetFilePath)) continue;
    copyFileSync(templateVoxelMaterialsPath, targetFilePath, COPYFILE_EXCL);
  }
}

function createCompositesFiles() {
  for (const name of compositesNames) {
    const targetFilePath = resolve(
      rootPath,
      "Data",
      "VoxelMaterials",
      "Composites",
      `VoxelMaterials_${name}.sbc`
    );
    if (existsSync(targetFilePath)) continue;
    copyFileSync(templateVoxelMaterialsPath, targetFilePath, COPYFILE_EXCL);
  }
}

function createCompositesRadioActiveFiles() {
  for (const name of compositesRadioActiveNames) {
    const targetFilePath = resolve(
      rootPath,
      "Data",
      "VoxelMaterials",
      "Composites_RadioActive",
      `VoxelMaterials_${name}.sbc`
    );
    if (existsSync(targetFilePath)) continue;
    copyFileSync(templateVoxelMaterialsPath, targetFilePath, COPYFILE_EXCL);
  }
}

function voxelFixPath() {
  const textures = readdirSync("minerals-core/Textures/Voxels", {
    recursive: true,
    encoding: "utf8",
    withFileTypes: true,
  }).filter((entry) => entry.isFile());

  const voxelMaterialDefinitions = readdirSync(
    "minerals-core/Data/VoxelMaterials",
    {
      recursive: true,
      encoding: "utf8",
      withFileTypes: true,
    }
  ).filter((entry) => entry.isFile());

  // for (const entry of textures) {
  //   if(entry.isDirectory()) continue;
  //   const file = basename(entry.name);
  //   const type = basename(entry.parentPath);
  //   console.log(type, file);
  // }

  for (const voxelEntry of voxelMaterialDefinitions) {
    const voxelFile = voxelEntry.name;
    const path = resolve(voxelEntry.parentPath, voxelEntry.name);
    let content = readFileSync(path, { encoding: "utf8" });
    if (!content.includes("Textures\\Voxels")) continue;

    let change = false;

    for (const textureEntry of textures) {
      const file = textureEntry.name;
      const type = basename(textureEntry.parentPath);
      const searchPath = `Textures\\Voxels\\${file}`;
      const replacePath = `Textures\\Voxels\\${type}\\${file}`;
      if (content.includes(searchPath)) {
        console.log(`${voxelFile} includes ${searchPath}`);
        // content = content.replace(new RegExp(searchPath, "g"), replacePath);
        content = content.replaceAll(searchPath, replacePath);
        change = true;
      }
    }
    if (change) writeFileSync(path, content, { encoding: "utf8" });
  }
}

function findBlueprintClassEntryDupes(dir = "core-minerals/Data") {
  const files = readdirSync(dir, {
    recursive: true,
    encoding: "utf8",
    withFileTypes: true,
  }).filter((entry) => entry.isFile() && entry.name.endsWith("sbc"));

  const uniqueLines = new Set<string>();

  for (const file of files) {
    const path = resolve(file.parentPath, file.name);
    let content = readFileSync(path, { encoding: "utf8" });
    if (!content.includes("Entry Class")) continue;
    const lines = content
      .split(EOL)
      .filter((line) => line.includes("Entry Class"))
      .map((line) => line.trim());
    for (const line of lines) {
      if (!uniqueLines.has(line)) uniqueLines.add(line);
      else console.warn(`Dupe line ${line} in ${path}`);
    }
  }
  console.log(
    `Done with ${uniqueLines.size} uniqueLines in ${files.length} files`
  );
}

// reduce xml json results (remove .children)
function reduceChildren(object: any): any {
  if (typeof object !== "object") return object;

  if (Object.keys(object).length === 0) return "Null";

  if (object.content) {
    return object.content;
  }
  if (object.children) {
    object = object.children;
    return reduceChildren(object);
  }
  if (object.Definition) {
    object = object.Definition;
    return reduceChildren(object);
  }
  if (object.Definitions) {
    object = object.Definitions;
    return reduceChildren(object);
  }

  for (const k of Object.keys(object)) {
    object[k] = reduceChildren(object[k]);
  }

  if (Array.isArray(object)) {
    if (object.length === 1) return reduceChildren(object.at(0));
    const onlyOneSizeObjects = !object.some((o) => Object.keys(o).length > 1);
    const propertyNames = new Set(object.flatMap((o) => Object.keys(o)));
    const onlyUniqueProperties = propertyNames.size === object.length;

    if (propertyNames.size === 1)
      return object.map((entry) => reduceChildren(entry));
    if (onlyOneSizeObjects) return reduceChildren(Object.assign({}, ...object));

    return object.map((element: any) => reduceChildren(element));
  }

  return object;
}

function convertFile(file: Dirent) {
  const path = resolve(file.parentPath, file.name);
  // if (!file.name.endsWith("CubeBlocks_Logistics.sbc")) continue;
  let content = readFileSync(path, { encoding: "utf8" });
  try {
    let converted = convertXML(content);
    converted = reduceChildren(converted);

    //  remove repair flag
    if (file.name.startsWith("fix")) {
      rmSync(path);
      writeFileSync(
        resolve(file.parentPath, file.name.replace("fix.", "")),
        content,
        { encoding: "utf8" }
      );
    }
    return converted;
  } catch (error: any) {
    console.log(`Failed on file ${path}`, error.message);
    //  repair BOM files
    rmSync(path);
    writeFileSync(
      resolve(
        file.parentPath,
        (!file.name.startsWith("fix") ? "fix." : "") + file.name
      ),
      content.replace(/^\uFEFF/, ""),
      "utf8"
    );
  }
}

function sbcToJSON(dir = "ewe-legacy/Data/CubeBlocks") {
  const files = readdirSync(dir, {
    recursive: true,
    encoding: "utf8",
    withFileTypes: true,
  }).filter((entry) => entry.isFile() && entry.name.endsWith("sbc"));

  const data = [];

  for (const file of files) {
    const path = resolve(file.parentPath, file.name);
    const converted = convertFile(file);
    data.push(
      ...Array.from(converted?.CubeBlocks ?? []).map((v: any) => ({
        ...v,
        fromFile: path,
      }))
    );
  }
  return data;
}

function findEWEBlocks() {
  const vanillaBlocks = sbcToJSON(`./vanilla/Data/CubeBlocks`);
  const eweBlocks = sbcToJSON(`./ewe-legacy/Data/CubeBlocks`);
  const componentsBlocks = sbcToJSON(`./components/Data/CubeBlocks`);
  const enhancedBlocks = sbcToJSON(`./enhanced/Data/CubeBlocks`);

  console.log(`Found ${vanillaBlocks.length} vanilla blocks`);
  console.log(`Found ${eweBlocks.length} ewe blocks`);

  function idOf(d: any) {
    return `${d.Id?.TypeId}${
      typeof d.Id?.SubtypeId === "string" ? "." + d.Id?.SubtypeId : ""
    }`;
  }

  const eweBlockIdList = eweBlocks
    .filter((d: any) => d.Id)
    .map((d: any) => idOf(d));
  const vanillaBlockIdList = vanillaBlocks
    .filter((d: any) => d.Id)
    .map((d: any) => idOf(d));

  const eweBlockIdMap = new Map(
    eweBlocks.filter((d: any) => d.Id).map((d: any) => [idOf(d), d])
  );
  const componentBlockIdMap = new Map(
    componentsBlocks.filter((d: any) => d.Id).map((d: any) => [idOf(d), d])
  );
  const enhancedBlockIdMap = new Map(
    enhancedBlocks.filter((d: any) => d.Id).map((d: any) => [idOf(d), d])
  );
  const vanillaBlockIdSet = new Set(vanillaBlockIdList);

  const eweOnlyBlockIds = eweBlockIdList.filter(
    (id) => !vanillaBlockIdSet.has(id)
  );
  const eweChangedBlockIds = eweBlockIdList.filter((id) =>
    vanillaBlockIdSet.has(id)
  );

  console.log(`Found ${eweOnlyBlockIds.length} added blocks`);
  console.log(`Found ${eweChangedBlockIds.length} changed blocks`);

  writeFileSync(
    `eweBlocks.local.json`,
    JSON.stringify(eweBlocks, undefined, 2),
    "utf8"
  );
  writeFileSync(
    `eweBlockIdList.local.json`,
    JSON.stringify(eweBlockIdList, undefined, 2),
    "utf8"
  );
  writeFileSync(
    `eweOnlyBlockIds.local.json`,
    JSON.stringify(eweOnlyBlockIds, undefined, 2),
    "utf8"
  );

  const fileChangeCounter = new Map<string, string[]>();
  const fileAddedCounter = new Map<
    string,
    {
      file: string;
      total: number;
      added: number;
      updated: number;
      missing: string[];
    }
  >();
  const patchMismatch = [];

  for (const addedId of eweBlockIdList) {
    const block = eweBlockIdMap.get(addedId);
    if (!fileAddedCounter.has(block.fromFile)) {
      fileAddedCounter.set(block.fromFile, {
        file: block.fromFile,
        total: 1,
        added: vanillaBlockIdSet.has(idOf(block)) ? 0 : 1,
        updated: vanillaBlockIdSet.has(idOf(block)) ? 1 : 0,
        missing:
          !vanillaBlockIdSet.has(idOf(block)) &&
          !enhancedBlockIdMap.has(idOf(block))
            ? [idOf(block)]
            : [],
      });
    } else {
      const stats = fileAddedCounter.get(block.fromFile)!;
      stats.total++;
      if (
        !vanillaBlockIdSet.has(idOf(block)) &&
        !enhancedBlockIdMap.has(idOf(block))
      )
        stats.missing.push(idOf(block));
      vanillaBlockIdSet.has(idOf(block)) ? stats.updated++ : stats.added++;
    }
  }

  for (const changedId of eweChangedBlockIds) {
    const block = componentBlockIdMap.get(changedId);
    const legacyBlock = eweBlockIdMap.get(changedId);
    if (block.DisplayName !== legacyBlock.DisplayName) {
      patchMismatch.push(`ID<${changedId}> DisplayName mismatch`);
    }
    if (block.BlockPairName !== legacyBlock.BlockPairName) {
      patchMismatch.push(`ID<${changedId}> BlockPairName mismatch`);
    }
    if (!block) console.warn(`BlockId ${changedId} not found in components`);
    else {
      const before = fileChangeCounter.get(block.fromFile) ?? [];
      before.push(changedId);
      fileChangeCounter.set(block.fromFile, before);
    }
  }
  writeFileSync(
    `patchMismatch.local.json`,
    JSON.stringify(patchMismatch, undefined, 2),
    "utf8"
  );
  writeFileSync(
    `componentsBlockMap.local.json`,
    JSON.stringify(
      Array.from(fileChangeCounter.entries()).map((e) => ({
        ...e,
        n: e[1].length,
      })),
      undefined,
      2
    ),
    "utf8"
  );
  writeFileSync(
    `eweBlockMap.local.json`,
    JSON.stringify(
      Array.from(fileAddedCounter.entries()).filter(
        (v) => v[1].missing.length > 0
      ),
      undefined,
      2
    ),
    "utf8"
  );
}

function findUnusedFiles() {
  const [
    legacyFiles,
    eweComponentsFiles,
    eweCoreMineralsFiles,
    eweCoreComponentsFiles,
    eweEnhancedFiles,
  ] = [
    "ewe-legacy",
    "components",
    "core-minerals",
    "core-components",
    "enhanced",
  ].map((path) =>
    readdirSync(resolve(cwd(), path), {
      recursive: true,
      encoding: "utf8",
      withFileTypes: true,
    }).filter(
      (entry) =>
        entry.isFile() &&
        !entry.parentPath.includes(".git") &&
        !entry.parentPath.endsWith(path)
    )
  );

  const [
    legacyFilesMap,
    eweComponentsFilesMap,
    eweCoreMineralsFilesMap,
    eweCoreComponentsFilesMap,
    eweEnhancedFilesMap,
  ] = [
    legacyFiles,
    eweComponentsFiles,
    eweCoreMineralsFiles,
    eweCoreComponentsFiles,
    eweEnhancedFiles,
  ].map(
    (files) =>
      new Map(
        files.map((v) => [
          relative(resolve(cwd()), v.parentPath + "/" + v.name)
            .split("/")
            .splice(1)
            .join("/"),
          v.name,
        ])
      )
  );

  for (const [index, fileName] of legacyFilesMap) {
    if (fileName.endsWith(".old")) continue;
    if (index.startsWith("Data/PlanetDataFiles")) continue; // not required
    if (index.startsWith("Textures/GUI/Icons/ore_")) continue; // moved to another path
    if (index.startsWith("Textures/Voxels")) continue; // moved to another path
    if (index.startsWith("Data/CubeBlocks/CubeBlocks_")) continue; // merged in other files
    if (
      index.startsWith(
        "Data/PlanetGeneratorDefinitions/PlanetGeneratorDefinitions_"
      )
    )
      continue; // different location
    if (index.startsWith("Data/VoxelMaterials/VoxelMaterials_")) continue; // split into smaller files
    if (
      ![
        eweComponentsFilesMap,
        eweCoreMineralsFilesMap,
        eweCoreComponentsFilesMap,
        eweEnhancedFilesMap,
      ].some((v) => v.has(index))
    )
      console.log(index);
  }
}

function loadAllModFiles() {
  const [
    coreMineralsFiles,
    coreComponentsFiles,
    componentsFiles,
    planetsFiles,
    enhancedFiles,
    vanillaFiles,
  ] = [
    "core-minerals",
    "core-components",
    "components",
    "planets",
    "enhanced",
    "vanilla",
  ].map((dir) =>
    readdirSync(dir, {
      recursive: true,
      encoding: "utf8",
      withFileTypes: true,
    }).filter((entry) => entry.isFile())
  );

  return {
    "core-minerals": coreMineralsFiles,
    "core-components": coreComponentsFiles,
    "components": componentsFiles,
    "planets": planetsFiles,
    "enhanced": enhancedFiles,
    vanilla: vanillaFiles,
  };
}

function loadEWELegacyFiles() {
  const [legacyFiles, vanillaFiles] = ["ewe-legacy", "vanilla"].map((dir) =>
    readdirSync(dir, {
      recursive: true,
      encoding: "utf8",
      withFileTypes: true,
    }).filter((entry) => entry.isFile())
  );

  return {
    "ewe-legacy": legacyFiles,
    vanilla: vanillaFiles,
  };
}

// TODO dds checker, check all mods if they have unused dds files
function findUnusedDDSFiles() {
  const files = loadAllModFiles();

  for (const [key, modFiles] of Object.entries(files)) {
    const ddsFiles = modFiles.filter((v) => v.name.endsWith("dds"));
    const sbcFiles = modFiles.filter((v) => v.name.endsWith("sbc"));

    console.log(
      `${key} has ${ddsFiles.length} dds files and ${sbcFiles.length} sbc files`
    );
    if (ddsFiles.length === 0) continue;

    const uniqueReferences = new Set(
      sbcFiles.flatMap((file) =>
        [
          ...readFileSync(resolve(file.parentPath, file.name), {
            encoding: "utf8",
          }).matchAll(/>(.*\.dds)</gi),
        ].map((v) => relative(cwd(), v[1].replaceAll("\\", "/")))
      )
    );
    //
    const modDir = resolve(cwd(), key);
    for (const ddsFile of ddsFiles) {
      const path = resolve(ddsFile.parentPath, ddsFile.name);
      const modPath = relative(modDir, path);
      if (!uniqueReferences.has(modPath)) {
        console.log(`no ref for ${key}/${modPath}`);
      }
    }
  }
}

function countVoxelMaterials() {
  console.log("loading all file paths...");
  const files = loadAllModFiles();
  // const files = loadEWELegacyFiles();

  console.log("processing...");
  const output: Record<string, any> = {
    voxelMaterialCount: {},
    voxelMaterials: {},
    uniqueMaterialCount: 0,
    uniqueMaterials: [],
  };
  const allMaterials = new Set<string>();
  for (const [key, modFiles] of Object.entries(files)) {
    const sbcFiles = modFiles.filter((v) => v.name.endsWith("sbc"));

    console.log(`${key} has  ${sbcFiles.length} sbc files`);

    const voxelMaterials = [];

    //
    for (const sbcFile of sbcFiles) {
      const path = resolve(sbcFile.parentPath, sbcFile.name);
      const converted = convertFile(sbcFile);
      if (converted?.VoxelMaterials) {
        if (Array.isArray(converted.VoxelMaterials))
          voxelMaterials.push(
            ...converted.VoxelMaterials.map((e: any) => e.VoxelMaterial)
          );
        else voxelMaterials.push(converted.VoxelMaterials.VoxelMaterial);
      }
    }
    console.log(`${key} has  ${voxelMaterials.length} voxelMaterials`);
    output.voxelMaterialCount[key] = voxelMaterials.length;
    output.voxelMaterials[key] = voxelMaterials.map(
      (mat) => mat.Id?.SubtypeId ?? mat
    );

    for (const mat of voxelMaterials) {
      allMaterials.add(mat.Id?.SubtypeId ?? mat);
    }
  }
  console.log(`${allMaterials.size} total voxel materials`);
  output.uniqueMaterialCount = allMaterials.size;
  output.uniqueMaterials = [...allMaterials];

  writeFileSync(
    `voxel-material-data.local.json`,
    JSON.stringify(output, undefined, 2),
    { encoding: "utf8" }
  );
}

function scanOres() {
  console.log("loading all file paths...");
  const files = loadAllModFiles();
  // const files = loadEWELegacyFiles();

  console.log("processing...");
  // create excel file
  const wb = new xl.Workbook();
  for (const [key, modFiles] of Object.entries(files)) {
    const sbcFiles = modFiles.filter((v) => v.name.endsWith("sbc"));

    console.log(`${key} has  ${sbcFiles.length} sbc files`);

    const ores = [];
    const blueprints = [];
    //
    for (const sbcFile of sbcFiles) {
      const path = resolve(sbcFile.parentPath, sbcFile.name);
      const converted = convertFile(sbcFile);
      if (converted?.PhysicalItems) {
        const items = Array.isArray(converted.PhysicalItems)
          ? converted.PhysicalItems.map((e: any) => e.PhysicalItem)
          : [converted.PhysicalItems.PhysicalItem];
        ores.push(...items.filter((pi: any) => pi.Id?.TypeId === "Ore"));
      }
      if (converted?.Blueprints) {
        const items = Array.isArray(converted.Blueprints)
          ? converted.Blueprints.map((e: any) => e.Blueprint)
          : [converted.Blueprints.Blueprint];
        blueprints.push(
          ...items.filter((pi: any) => pi.Prerequisites?.Item?.TypeId === "Ore")
        );
      }
    }
    // console.log(`${key} ores`, ores);
    const shortBlueprints = blueprints.map((bp) => ({
      subtypeId: bp.Id.SubtypeId,
      prerequisites: bp.Prerequisites.Item.SubtypeId,
      results: bp.Results?.Item?.SubtypeId ??
        bp.Results?.map((r: any) => r.Item.SubtypeId) ?? [bp.Result?.SubtypeId],
    }));
    // console.log(`${key} blueprints`, shortBlueprints);
    // TODO find unique ores (ores that would remove an ingot if they were removed)

    const ingots = [
      ...new Set(shortBlueprints.flatMap((bp) => bp.results)),
    ].sort();

    const oresToIngot = ingots.map((ingot) => [
      ingot,
      [
        ...new Set(
          shortBlueprints
            .filter((bp) => bp.results.includes(ingot))
            .flatMap((bp) => bp.prerequisites)
        ),
      ],
    ]);

    // const bluePrintNames = shortBlueprints.map(bp=>bp.subtypeId)

    // console.log(blueprints);
    if (oresToIngot.length) {
      const ws = wb.addWorksheet(`${key}-oreToIngot`);
      for (const [ore, index] of ores.map((v, i) => [v, i + 2])) {
        const bp = blueprints.find(
          (bp) => bp.Prerequisites.Item.SubtypeId === ore.Id.SubtypeId
        );
        console.log(ore.Id.SubtypeId, bp);
        if (!bp) continue;
        ws.cell(1, index).string(ore.Id.SubtypeId);
        ws.cell(2, index).number(Number(ore.Mass));
        ws.cell(3, index).number(Number(ore.Volume));
        ws.cell(4, index).number(Number(bp.Prerequisites.Item.Amount));
        const resultList = (
          Array.isArray(bp.Results) ? bp.Results : [bp.Results ?? bp.Result]
        ).map((r: any) => r.Item ?? r);
        // console.log(resultList);
        for (const result of resultList) {
          console.log(ingots, result);
          const ingotIndex =
            ingots.findIndex((n) => n === result.SubtypeId) + 5;

          ws.cell(ingotIndex, 1).string(result.SubtypeId);
          ws.cell(ingotIndex, index).number(Number(result.Amount));
        }
      }
      // ws.cell(1, 2).number(1);
      // ws.cell(1, 3).bool(true);
      // ws.cell(1, 4).date(new Date());
    }
  }
  wb.writeToBuffer().then((buf) => writeFileSync("data.local.xlsx", buf));
}

// createExtractiveFiles();
// createCompositesFiles();
// createCompositesRadioActiveFiles();
// voxelFixPath();
// findBlueprintClassEntryDupes("core-components/Data");

// reading all files will fix BOM issues
// sbcToJSON(`./core-minerals/Data`);
// sbcToJSON(`./core-components/Data`);
// sbcToJSON(`./planets/Data`);
// sbcToJSON(`./components/Data`);
// sbcToJSON(`./enhanced/Data`);
// sbcToJSON(`./ewe-legacy/Data`);

// findEWEBlocks();
// findUnusedFiles();
// findUnusedDDSFiles();
// countVoxelMaterials();
scanOres();
