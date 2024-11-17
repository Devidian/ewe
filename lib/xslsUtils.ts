// Methods to generate xlsx worksheets from sbc files
import * as xl from "excel4node";
import { Dirent } from "node:fs";
import { readFileConvertToJSON } from "./sbcUtils";
import { Logger } from "./utils";

const logger = new Logger("xslxUtils");

function addOreToIngotWorksheet(
  wb: xl.Workbook,
  files: [Dirent, any][],
  opt = { showFileNames: true }
) {
  // Add a worksheet with ore-to-ingot blueprints
  const ws = wb.addWorksheet(`oreToIngot`);
  ws.row(2).freeze();
  ws.column(1).setWidth(33).freeze();
  ws.column(2).hide();
  ws.column(3).hide();
  ws.cell(2, 1)
    .string(`Id`)
    .style({ font: { bold: true } });
  ws.cell(2, 2)
    .string(`DisplayName`)
    .style({ font: { bold: true } });
  ws.cell(2, 3)
    .string(`Icon`)
    .style({ font: { bold: true } });
  ws.cell(2, 4)
    .string(`Time`)
    .style({
      font: { bold: true },
    });
  (ws.cell(2, 4) as any).comment(`BaseProductionTimeInSeconds`);
  ws.cell(2, 5)
    .string(`Amount`)
    .style({ font: { bold: true } });
  ws.cell(1, 5)
    .string(`Type:`)
    .style({ font: { bold: true }, alignment: { horizontal: "right" } });
  let currentRow = 2;
  const componentColumnMap = new Map<string, number>();
  for (const [fileEnt, data] of files.filter(
    (ent) => ent[0].name.endsWith(".sbc") && ent[1]?.Definitions?.Blueprints
  )) {
    const srcObject = data.Definitions.Blueprints.Blueprint;

    const blueprints = Array.isArray(srcObject)
      ? srcObject
      : srcObject.Id
      ? [srcObject]
      : Object.values(srcObject);

    const oreToIngotBlueprints = blueprints
      .filter((v: any) => {
        return v.Id.SubtypeId.includes("OreToIngot");
      })
      .sort((a: any, b: any) => a.Id.SubtypeId.localeCompare(b.Id.SubtypeId));
    if (oreToIngotBlueprints.length < 1) continue;
    if (opt.showFileNames)
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

  if (!opt.showFileNames) ws.row(2).filter({ firstRow: 1, firstColumn: 1 });
}

function addComponentWorksheet(
  wb: xl.Workbook,
  files: [Dirent, any][],
  opt = { showFileNames: true }
) {
  // Add a worksheet with component blueprints
  const ws = wb.addWorksheet(`component-blueprints`);
  ws.row(2).freeze();
  ws.column(1).setWidth(20).freeze();
  ws.column(2).hide();
  ws.column(3).hide();
  ws.cell(2, 1)
    .string(`Id`)
    .style({ font: { bold: true } });
  ws.cell(2, 2)
    .string(`DisplayName`)
    .style({ font: { bold: true } });
  ws.cell(2, 3)
    .string(`Icon`)
    .style({ font: { bold: true } });
  ws.cell(2, 4)
    .string(`Time`)
    .style({
      font: { bold: true },
    });
  (ws.cell(2, 4) as any).comment(`BaseProductionTimeInSeconds`);
  ws.cell(2, 5)
    .string(`Amount`)
    .style({ font: { bold: true } });
  ws.cell(1, 5)
    .string(`Type:`)
    .style({ font: { bold: true }, alignment: { horizontal: "right" } });
  let currentRow = 2;
  const componentColumnMap = new Map<string, number>();
  for (const [fileEnt, data] of files.filter(
    (ent) => ent[0].name.endsWith(".sbc") && ent[1]?.Definitions?.Blueprints
  )) {
    const rootNode = data.Definitions.Blueprints.Blueprint;
    const blueprints = Array.isArray(rootNode)
      ? rootNode
      : rootNode.Id
      ? [rootNode]
      : Object.values(rootNode);

    const componentBlueprints = blueprints.filter((v: any) => {
      const a = v.Result && v?.Result["@_TypeId"] === "Component";
      const b = v.Results && v.Results.Item["@_TypeId"] === "Component";
      return a || b;
    });
    if (componentBlueprints.length < 1) continue;
    if (opt.showFileNames)
      ws.cell(++currentRow, 1)
        .string(fileEnt.name)
        .style({ font: { bold: true } });
    for (const blueprint of componentBlueprints) {
      const row = ++currentRow;
      const resultItem = blueprint.Result ?? blueprint.Results.Item;
      ws.cell(row, 1).string(`${blueprint.Id.SubtypeId}`);
      ws.cell(row, 2).string(`${blueprint.DisplayName}`);
      ws.cell(row, 3).string(`${blueprint.Icon}`);
      ws.cell(row, 4).number(parseFloat(blueprint.BaseProductionTimeInSeconds));
      ws.cell(row, 5).number(parseFloat(resultItem["@_Amount"]));
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

  if (!opt.showFileNames) ws.row(2).filter({ firstRow: 3, firstColumn: 1 });
}

function addBlockWorksheet(
  wb: xl.Workbook,
  files: [Dirent, any][],
  opt = { showFileNames: true }
) {
  // Add a worksheet with all blocks (and their components)
  const ws = wb.addWorksheet(`block-definitions`);
  ws.row(1).freeze();
  ws.column(1).setWidth(53).freeze();
  ws.column(2).hide();
  ws.column(3).hide();
  let currentRow = 1;
  const componentColumnMap = new Map<string, number>();

  for (const [fileEnt, data] of files.filter(
    (ent) => ent[0].name.endsWith(".sbc") && ent[1]?.Definitions?.CubeBlocks
  )) {
    const rootNode = data.Definitions?.CubeBlocks?.Definition ?? [];
    const dataList = Array.isArray(rootNode) ? rootNode : [rootNode];

    if (dataList.length < 1) continue;
    if (opt.showFileNames)
      ws.cell(++currentRow, 1)
        .string(fileEnt.name)
        .style({ font: { bold: true } });
    for (const block of dataList) {
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

  if (!opt.showFileNames) ws.row(1).filter({ firstRow: 1, firstColumn: 1 });
}

function addMaterialWorksheet(
  wb: xl.Workbook,
  files: [Dirent, any][],
  opt = { showFileNames: true }
) {
  // Add a worksheet with all materials
  const ws = wb.addWorksheet(`material-definitions`);
  // define styles
  const styleError = wb.createStyle({
    fill: {
      bgColor: "#FFCCCC",
      fgColor: "#FFCCCC",
      type: "pattern",
      patternType: "solid",
    },
  });
  const styleWarn = wb.createStyle({
    fill: {
      bgColor: "#FFFFCC",
      fgColor: "#FFFFCC",
      type: "pattern",
      patternType: "solid",
    },
  });
  const styleOkey = wb.createStyle({
    fill: {
      bgColor: "#CCFFCC",
      fgColor: "#CCFFCC",
      type: "pattern",
      patternType: "solid",
    },
  });
  ws.row(1).freeze();
  ws.column(1).setWidth(26).freeze();

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
  const orePlanetMap = new Map<string, Set<string>>();

  // scan planet definitions
  for (const [fileEnt, data] of files.filter(
    ([f, d]) =>
      f.name.endsWith(".sbc") &&
      (d.Definitions.PlanetGeneratorDefinitions ||
        (d?.Definitions?.Definition &&
          d.Definitions.Definition["@_xsi:type"] ===
            "PlanetGeneratorDefinition") ||
        (Array.isArray(d.Definitions.Definition) &&
          d.Definitions.Definition.some(
            (d: any) => d["@_xsi:type"] === "PlanetGeneratorDefinition"
          )))
  )) {
    const rootNode =
      data.Definitions.Definition ??
      data.Definitions.PlanetGeneratorDefinitions?.PlanetGeneratorDefinition;
    const dataList = Array.isArray(rootNode) ? rootNode : [rootNode];
    // logger.log(fileEnt.name, dataList);
    for (const planet of dataList) {
      // logger.verbose(planet);
      //  Materials used in ores
      const ores = [
        ...new Set(planet.OreMappings.Ore.map((ore: any) => ore["@_Type"])),
      ];
      //  Materials used in CustomMaterialTable
      const customMaterialTable = [
        ...new Set(
          (planet.CustomMaterialTable
            ? planet.CustomMaterialTable.Material
            : []
          ).flatMap((v: any) => [
            v["@_Material"],
            ...(Array.isArray(v.Layers?.Layer)
              ? v.Layers.Layer.map((l: any) => l["@_Material"])
              : [v.Layers?.Layer?.["@_Material"]]),
          ])
        ),
      ];
      // Materials used in DefaultSubSurfaceMaterial
      const defaultSubSurfaceMaterial = [
        ...new Set(
          Array.isArray(planet.DefaultSubSurfaceMaterial)
            ? planet.DefaultSubSurfaceMaterial
            : planet.DefaultSubSurfaceMaterial
            ? [planet.DefaultSubSurfaceMaterial]
            : []
        ),
      ].map((v: any) => v["@_Material"]);
      // Materials used in DefaultSurfaceMaterial
      const defaultSurfaceMaterial = [
        ...new Set(
          Array.isArray(planet.DefaultSurfaceMaterial)
            ? planet.DefaultSurfaceMaterial
            : planet.DefaultSurfaceMaterial
            ? [planet.DefaultSurfaceMaterial]
            : []
        ),
      ].map((v: any) => v["@_Material"]);
      // Materials used in EnvironmentItems
      const environmentItems = [
        ...new Set(
          Array.isArray(planet.EnvironmentItems.Item)
            ? planet.EnvironmentItems.Item
            : planet.EnvironmentItems.Item
            ? [planet.EnvironmentItems.Item]
            : []
        ),
      ].flatMap((v: any) =>
        Array.isArray(v.Materials)
          ? v.Materials.map((v: any) => v.Material)
          : v.Materials.Material
      );
      // Materials used in ComplexMaterials
      const complexMaterials = [
        ...new Set(
          (Array.isArray(planet.ComplexMaterials?.MaterialGroup)
            ? planet.ComplexMaterials.MaterialGroup
            : planet.ComplexMaterials?.MaterialGroup
            ? [planet.ComplexMaterials.MaterialGroup]
            : []
          )
            .flatMap((v: any) => v.Rule ?? v)
            .flatMap((v: any) => v.Layers?.Layer ?? v.Layers ?? v)
            .map((v: any) => v["@_Material"])
        ),
      ];
      const allUsedMaterials = [
        ...new Set([
          ...ores,
          ...customMaterialTable,
          ...defaultSubSurfaceMaterial,
          ...defaultSurfaceMaterial,
          ...environmentItems,
          ...complexMaterials,
        ]),
      ].filter((v) => v);

      orePlanetMap.set(planet.Id.SubtypeId, new Set(allUsedMaterials));

      // console.log({
      // ores,
      // customMaterialTable,
      // complexMaterials,
      // environmentItems,
      // defaultSurfaceMaterial,
      // defaultSubSurfaceMaterial,
      // name: planet.Id.SubtypeId,
      // allUsedMaterials,
      // });
    }
  }
  const lastColumnAlpha = xl.getExcelAlpha(orePlanetMap.size + 7);

  // create planet headers
  for (const [planet, ores, column] of [...orePlanetMap.entries()].map(
    (v, i) => [...v, i + 8] as [string, Set<string>, number]
  )) {
    // logger.log(`line 1 column ${column}: ${planet}`);
    ws.cell(1, column)
      .string(planet)
      .style({ font: { bold: true } });
  }

  // scan VoxelMaterials
  for (const [fileEnt, data] of files.filter(
    (ent) => ent[0].name.endsWith(".sbc") && ent[1]?.Definitions?.VoxelMaterials
  )) {
    const rootNode = data.Definitions?.VoxelMaterials?.VoxelMaterial ?? [];
    const dataList = Array.isArray(rootNode) ? rootNode : [rootNode];

    if (dataList.length < 1) continue;
    if (opt.showFileNames)
      ws.cell(++currentRow, 1)
        .string(fileEnt.name)
        .style({ font: { bold: true } });
    for (const definition of dataList) {
      const row = ++currentRow;
      ws.cell(row, 1).string(`${definition.Id.SubtypeId}`);
      ws.cell(row, 2).string(`${definition.MinedOre}`);
      ws.cell(row, 3).number(parseFloat(definition.MinedOreRatio));
      ws.cell(row, 4).bool(definition.CanBeHarvested);
      ws.cell(row, 5).bool(definition.IsRare);
      if (definition.SpawnsInAsteroids !== undefined)
        ws.cell(row, 6).bool(definition.SpawnsInAsteroids);
      if (definition.SpawnsFromMeteorites !== undefined)
        ws.cell(row, 7).bool(definition.SpawnsFromMeteorites);

      for (const [planet, ores, column] of [...orePlanetMap.entries()].map(
        (v, i) => [...v, i + 8] as [string, Set<string>, number]
      )) {
        const isUsed = ores.has(definition.Id.SubtypeId);
        const style = isUsed ? styleOkey : styleError;
        ws.cell(row, column).bool(isUsed).style(style);
      }
      ws.addConditionalFormattingRule(`$A$${row}:$${lastColumnAlpha}$${row}`, {
        type: "expression",
        priority: 2,
        formula: `=NOT(OR($H$${row}:$${lastColumnAlpha}$${row}=TRUE))`,
        style: styleError,
      });
    }
  }

  ws.addConditionalFormattingRule(`$A:$A`, {
    type: "expression",
    priority: 1,
    formula: `=NOT(ISERROR(SEARCH("bare", $A1)))`,
    style: styleWarn,
  });

  if (!opt.showFileNames) ws.row(1).filter({ firstRow: 1, firstColumn: 1 });
}

function add____Worksheet(
  wb: xl.Workbook,
  files: [Dirent, any][],
  opt = { showFileNames: true }
) {}

export function generateXSLX(files: Dirent[], opt = { showFileNames: true }) {
  const wb = new xl.Workbook();

  const sbcFiles = files.filter((ent) => ent.name.endsWith(".sbc"));
  const sbcConverted: [Dirent, any][] = sbcFiles.map((ent) => [
    ent,
    readFileConvertToJSON(ent),
  ]);

  addOreToIngotWorksheet(wb, sbcConverted, opt);
  addComponentWorksheet(wb, sbcConverted, opt);
  addBlockWorksheet(wb, sbcConverted, opt);
  addMaterialWorksheet(wb, sbcConverted, opt);
  // add____Worksheet(wb, files);

  return wb.writeToBuffer();
}
