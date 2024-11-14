// Methods to generate xlsx worksheets from sbc files
import * as xl from "excel4node";
import { Logger } from "./utils";
import { Dirent } from "node:fs";
import { readFileConvertToJSON } from "./sbcUtils";
import { stringify } from "node:querystring";

const logger = new Logger("xslxUtils");

function addOreToIngotWorksheet(wb: xl.Workbook, files: Dirent[]) {
  // Add a worksheet with ore-to-ingot blueprints
  const ws = wb.addWorksheet(`oreToIngot`);
  ws.row(1).freeze();
  ws.column(1).setWidth(20).freeze();
  ws.column(2).hide();
  ws.column(3).hide();
  ws.cell(1, 1)
    .string(`Id`)
    .style({ font: { bold: true } });
  ws.cell(1, 2)
    .string(`DisplayName`)
    .style({ font: { bold: true } });
  ws.cell(1, 3)
    .string(`Icon`)
    .style({ font: { bold: true } });
  ws.cell(1, 4)
    .string(`BaseProductionTimeInSeconds`)
    .style({
      font: { bold: true },
    });
  ws.cell(1, 5)
    .string(`Amount`)
    .style({ font: { bold: true } });
  let currentRow = 2;
  const componentColumnMap = new Map<string, number>();
  for (const fileEnt of files.filter((ent) => ent.name.endsWith(".sbc"))) {
    const data = readFileConvertToJSON(fileEnt);
    if (!data.Definitions) {
      logger.warn(`problem with ${fileEnt.name}`, data);
      continue;
    }
    if (!Object.keys(data.Definitions).includes("Blueprints")) continue;

    const srcObject = data.Definitions.Blueprints.Blueprint;

    const blueprints = Array.isArray(srcObject)
      ? srcObject
      : srcObject.Id
      ? [srcObject]
      : Object.values(srcObject);

    const oreToIngotBlueprints = blueprints.filter((v: any) => {
      return v.Id.SubtypeId.includes("OreToIngot");
    });
    if (oreToIngotBlueprints.length < 1) continue;
    ws.cell(++currentRow, 1)
      .string(fileEnt.name)
      .style({ font: { bold: true } });
    for (const blueprint of oreToIngotBlueprints) {
      const row = ++currentRow;
      ws.cell(row, 1).string(`${blueprint.Id.SubtypeId}`);
      ws.cell(row, 2).string(`${blueprint.DisplayName}`);
      ws.cell(row, 3).string(`${blueprint.Icon}`);
      ws.cell(row, 4).number(parseFloat(blueprint.BaseProductionTimeInSeconds));
      const comp: Record<string, number> = {};
      //   blocks with only one component only have an object not a list
      const inputList = Array.isArray(blueprint.Prerequisites.Item)
        ? blueprint.Prerequisites.Item
        : [blueprint.Prerequisites.Item];
      let outputList = [];
      if (blueprint.Results) {
        if (Array.isArray(blueprint.Results.Item)) {
          outputList = blueprint.Results.Item;
        } else {
          outputList = [blueprint.Results.Item];
        }
      } else if (blueprint.Result) {
        outputList = [blueprint.Result];
      }
      ws.cell(row, 5).number(parseFloat(inputList[0]["@_Amount"]));
      //   sometimes components have multiple indices
      for (const item of outputList) {
        const itemIndex = `${item["@_TypeId"]}/${item["@_SubtypeId"]}`;
        if (comp[itemIndex]) comp[itemIndex] += parseFloat(item["@_Amount"]);
        else comp[itemIndex] = parseFloat(item["@_Amount"]);
      }
      for (const [component, count] of Object.entries(comp)) {
        if (!componentColumnMap.has(component)) {
          const [type, subtype] = component.split("/");
          ws.cell(1, 6 + componentColumnMap.size).string(type);
          ws.cell(2, 6 + componentColumnMap.size).string(subtype);
          componentColumnMap.set(component, 6 + componentColumnMap.size);
        }
        const column = componentColumnMap.get(component)!;
        ws.cell(row, column).number(count);
      }
    }
  }
}

function addComponentWorksheet(wb: xl.Workbook, files: Dirent[]) {
  // Add a worksheet with component blueprints
  const ws = wb.addWorksheet(`component-blueprints`);
  ws.row(2).freeze();
  ws.column(1).setWidth(20).freeze();
  ws.column(2).hide();
  ws.column(3).hide();
  ws.cell(1, 1)
    .string(`Id`)
    .style({ font: { bold: true } });
  ws.cell(1, 2)
    .string(`DisplayName`)
    .style({ font: { bold: true } });
  ws.cell(1, 3)
    .string(`Icon`)
    .style({ font: { bold: true } });
  ws.cell(1, 4)
    .string(`BaseProductionTimeInSeconds`)
    .style({
      font: { bold: true },
    });
  ws.cell(1, 5)
    .string(`Amount`)
    .style({ font: { bold: true } });
  let currentRow = 2;
  const componentColumnMap = new Map<string, number>();
  for (const fileEnt of files.filter((ent) => ent.name.endsWith(".sbc"))) {
    const data = readFileConvertToJSON(fileEnt);
    if (!data.Definitions) {
      logger.warn(`problem with ${fileEnt.name}`, data);
      continue;
    }
    if (!Object.keys(data.Definitions).includes("Blueprints")) continue;

    const srcObject = data.Definitions.Blueprints.Blueprint;

    const blueprints = Array.isArray(srcObject)
      ? srcObject
      : srcObject.Id
      ? [srcObject]
      : Object.values(srcObject);

    const componentBlueprints = blueprints.filter((v: any) => {
      return v.Result && v?.Result["@_TypeId"] === "Component";
    });
    if (componentBlueprints.length < 1) continue;
    ws.cell(++currentRow, 1)
      .string(fileEnt.name)
      .style({ font: { bold: true } });
    for (const blueprint of componentBlueprints) {
      const row = ++currentRow;
      ws.cell(row, 1).string(`${blueprint.Id.SubtypeId}`);
      ws.cell(row, 2).string(`${blueprint.DisplayName}`);
      ws.cell(row, 3).string(`${blueprint.Icon}`);
      ws.cell(row, 4).number(parseFloat(blueprint.BaseProductionTimeInSeconds));
      ws.cell(row, 5).number(parseFloat(blueprint.Result["@_Amount"]));
      const comp: Record<string, number> = {};
      // blueprints with only one component only have an object not a list
      const inputList = Array.isArray(blueprint.Prerequisites.Item)
        ? blueprint.Prerequisites.Item
        : [blueprint.Prerequisites.Item];
      let outputList = [];
      if (blueprint.Results) {
        if (Array.isArray(blueprint.Results.Item)) {
          outputList = blueprint.Results.Item;
        } else {
          outputList = [blueprint.Results.Item];
        }
      } else if (blueprint.Result) {
        outputList = [blueprint.Result];
      }
      // sometimes components have multiple indices
      for (const component of inputList) {
        const itemIndex = `${component["@_TypeId"]}/${component["@_SubtypeId"]}`;
        if (comp[itemIndex])
          comp[itemIndex] += parseFloat(component["@_Amount"]);
        else comp[itemIndex] = parseFloat(component["@_Amount"]);
      }
      for (const [component, count] of Object.entries(comp)) {
        if (!componentColumnMap.has(component)) {
          const [type, subtype] = component.split("/");
          ws.cell(1, 6 + componentColumnMap.size).string(type);
          ws.cell(2, 6 + componentColumnMap.size).string(subtype);
          componentColumnMap.set(component, 6 + componentColumnMap.size);
        }
        const column = componentColumnMap.get(component)!;
        ws.cell(row, column).number(count);
      }
    }
  }
}

function addBlockWorksheet(wb: xl.Workbook, files: Dirent[]) {
  // Add a worksheet with all blocks (and their components)
  const ws = wb.addWorksheet(`block-definitions`);
  ws.row(1).freeze();
  ws.column(1).setWidth(53).freeze();
  ws.column(2).hide();
  ws.column(3).hide();
  let currentRow = 1;
  const componentColumnMap = new Map<string, number>();

  for (const fileEnt of files.filter((ent) => ent.name.endsWith(".sbc"))) {
    const data = readFileConvertToJSON(fileEnt);
    if (!data.Definitions) {
      logger.warn(`problem with ${fileEnt.name}`, data);
      continue;
    }
    if (!Object.keys(data.Definitions).includes("CubeBlocks")) continue;

    const blockList = data.Definitions?.CubeBlocks?.Definition ?? [];
    if (blockList.length < 1) continue;
    ws.cell(++currentRow, 1)
      .string(fileEnt.name)
      .style({ font: { bold: true } });
    for (const block of blockList) {
      const row = ++currentRow;
      ws.cell(row, 1).string(`${block.Id.TypeId}/${block.Id.SubtypeId}`);
      ws.cell(row, 2).string(`${block.DisplayName}`);
      ws.cell(row, 3).string(`${block.Icon}`);
      const comp: Record<string, number> = {};
      //   blocks with only one component only have an object not a list
      const componentList = Array.isArray(block.Components.Component)
        ? block.Components.Component
        : [block.Components.Component];
      //   sometimes components have multiple indices
      for (const component of componentList) {
        if (comp[component["@_Subtype"]])
          comp[component["@_Subtype"]] += parseFloat(component["@_Count"]);
        else comp[component["@_Subtype"]] = parseFloat(component["@_Count"]);
      }
      for (const [component, count] of Object.entries(comp)) {
        if (!componentColumnMap.has(component)) {
          ws.cell(1, 4 + componentColumnMap.size).string(component);
          componentColumnMap.set(component, 4 + componentColumnMap.size);
        }
        const column = componentColumnMap.get(component)!;
        ws.cell(row, column).number(count);
      }
    }
  }
}

function addMaterialWorksheet(wb: xl.Workbook, files: Dirent[]) {
  // Add a worksheet with all materials
  const ws = wb.addWorksheet(`material-definitions`);
  ws.row(1).freeze();
  ws.column(1).setWidth(53).freeze();

  ws.cell(1, 1)
    .string(`SubtypeId`)
    .style({ font: { bold: true } });
  ws.cell(1, 2)
    .string(`MinedOre`)
    .style({ font: { bold: true } });
  ws.cell(1, 3)
    .string(`MinedOreRatio`)
    .style({ font: { bold: true } });
  ws.cell(1, 4)
    .string(`CanBeHarvested`)
    .style({ font: { bold: true } });
  ws.cell(1, 5)
    .string(`IsRare`)
    .style({ font: { bold: true } });
  ws.cell(1, 6)
    .string(`SpawnsInAsteroids`)
    .style({ font: { bold: true } });
  ws.cell(1, 7)
    .string(`SpawnsFromMeteorites`)
    .style({ font: { bold: true } });
  let currentRow = 1;
  const componentColumnMap = new Map<string, number>();

  for (const fileEnt of files.filter((ent) => ent.name.endsWith(".sbc"))) {
    const data = readFileConvertToJSON(fileEnt);
    if (!data.Definitions) {
      logger.warn(`problem with ${fileEnt.name}`, data);
      continue;
    }
    if (!Object.keys(data.Definitions).includes("VoxelMaterials")) continue;

    const definitionList =
      data.Definitions?.VoxelMaterials?.VoxelMaterial ?? [];
    if (definitionList.length < 1) continue;
    ws.cell(++currentRow, 1)
      .string(fileEnt.name)
      .style({ font: { bold: true } });
    for (const definition of definitionList) {
      const row = ++currentRow;
      ws.cell(row, 1).string(`${definition.Id.SubtypeId}`);
      ws.cell(row, 2).string(`${definition.MinedOre}`);
      ws.cell(row, 3).string(`${definition.MinedOreRatio}`);
      ws.cell(row, 4).string(`${definition.CanBeHarvested}`);
      ws.cell(row, 5).string(`${definition.IsRare}`);
      ws.cell(row, 6).string(`${definition.SpawnsInAsteroids}`);
      ws.cell(row, 7).string(`${definition.SpawnsFromMeteorites}`);
    }
  }
}

function add____Worksheet(wb: xl.Workbook, files: Dirent[]) {}

export function generateXSLX(files: Dirent[]) {
  const wb = new xl.Workbook();

  addOreToIngotWorksheet(wb, files);
  addComponentWorksheet(wb, files);
  addBlockWorksheet(wb, files);
  addMaterialWorksheet(wb, files);
  // add____Worksheet(wb, files);

  return wb.writeToBuffer();
}
