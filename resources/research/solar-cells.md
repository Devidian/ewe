# Solar Panels

NOTE: experimental brainstorming ahead

## Large Grid

According to research solar power in space is 1362W/m² for our sun as 1AU.

A Large Block in SE is 2.5m in length
A SolarPanel has a size of 2*4 blocks or 5*10m = 50m²

An efficiency of 100% would generate 68.050W
A default day in SE is 2 hours, so time is 12 times faster than real time
Maximum power generated would be 816.600W then.

Current best Si Solar cells have an efficiency of up to 30%
We assume that in the SE universe the base efficiency is a bit better.

So, if we take 40% for basic 60% for advanced and 80% for elite and we smoothen the numbers a bit, we would get:

BasicSolarPanel: 0.32
AdvancedSolarPanel: 0.48
EliteSolarPanel: 0.64

### Components [WIP]

Components for Large Block Solarmodules.

• Solar Cells ~ 50m² dual sided => 100m² => 400 solar cells
• reduce solar cells for border? 10x40 reduced to 9x39 => 351 => 350 solar cells
• aluminum plates and pipes for casing, maybe other materials for advanced/elite?
• copper wire
• glass panels
• solder
• screws
• diodes
• transistors
• resistors?
• PCBs?
• leds (for the power lights)

For the colorable variants we need more pipes and they have more solar cells, the power lights are smaller.

For Advanced we could just use more cells as `double layer` with slightly more electronics
For Elite we could just use more cells as `quad layer` with slightly more electronics maybe heatsinks?

## Cell Material

Current material for 1 solar cell is

| Material   | Vanilla | Mod | in g  |
| ---------- | ------- | --- | ----- |
| Nickel     | 3       |     |       |
| Silicon    | 6       | 7   | 7000g |
| CopperWire |         | 1   | 70g   |
| Glass      |         | 0.5 | 500g  |
| Arsenic    |         | 1.5 | 1500g |
| GESAMT     | 9kg     |     | 9070g |

### Silicon based

From what i red, Si based Solarcells consist of Silicon, Silver, Aluminum, Glass, EVA.
This might differ from source to source but we do not do a 100% science here, just approximations.
(Phosphor and Boron were also noted as materials)

I Asked AI to give an example for a 1m² Solarcell.

This is the response:

| Material | g / m²     | used for            |
| -------- | ---------- | ------------------- |
| Silicon  | 800-1000g  | waver               |
| Silver   | 10-20g     | electrical contacts |
| Aluminum | 30-50g     | casing/back wall    |
| Glass    | 2000-3000g | protection          |
| EVA      | 100-200g   | glue                |

We just take maximum values for now.

Considering a Solarcell in Space Engineers is 0.5x0.5m (small block size) we would have:

| Material | g / 0.25m² |
| -------- | ---------- |
| Silicon  | 250g       |
| Silver   | 5g         |
| Aluminum | ~13g       |
| Glass    | 750g       |
| EVA      | 50g        |
| TOTAL    | 1068g      |

If we do not implement EVA as chemical component we would have to add its materials.
I asked AI what 100g EVA is made of. here the results:

| Material | 100g   | 50g (ceiled) |
| -------- | ------ | ------------ |
| Carbon   | 78.06g | ~39g         |
| Hydrogen | 13.15g | ~7g          |
| Oxygen   | 7.43g  | ~4g          |

### GaAs based

They have a higher efficiency but take rare minerals, could be an alternative as elite-solarcells.

## Sources

<https://onlinelibrary.wiley.com/doi/full/10.1002/pip.3831>
<https://www.jpl.nasa.gov/edu/resources/lesson-plan/calculating-solar-power-in-space/>
<https://www.nrel.gov/docs/fy09osti/44532.pdf>
