# README

## things to do for release

- reduce VoxelMaterials
  - currently we hit the limit of 127 VoxelMaterial definitions and we have to somehow lower them
  - to support atleast 3 extra Materials from other mods loke stargate, we should lower the amount of VoxelMaterial to 124 in total

## things to do after release

- adjust block blueprints
  - there are a lot of blueprints in vanilla se that were added after the last changes and therefor there are a lot blocks using only vanilla components

## other refactoring / rebalance

### real ore with traces of other elements

Currently mass and volume are taken from real world, but the outcome is not. First of all the default yield is low, because an elite-refinery with max Efficiency Modules would have close to 400% yield which currently creates outcomes out of the void. Then the impure elements have not the correct % and there are some more possible impurities.
To change this we could change the default `MaterialEfficiency` of the refineries:

| refinery                        | current | new    | Best modded |
| ------------------------------- | ------- | ------ | ----------- |
| Blast Furnace                   | 0.7     | 0.2100 | 0.2100      |
| LargeRefinery                   | 0.8     | 0.2325 | 0.9051      |
| LargeRefineryIndustrial         | 0.88    | 0.2450 | 0.9538      |
| LargeBlockLargeAdvancedRefinery | 0.88    | 0.2450 | 0.9538      |
| LargeBlockLargeEliteRefinery    | 1.0     | 0.2565 | 0.9986      |

For the SurvivalKit we have to adjust blueprints to yield ~19% (because SurvivalKit acts as assembler it always has efficiency of 1)

The next step is to adjust ore blueprints For example `Cassiterite`

| Ingot     | Current Basic | Real world % of total weight | new SurvivalOreToIngot | new BasicOreToIngot | new AdvancedOreToIngot | new EliteOreToIngot |
| --------- | ------------- | ---------------------------- | ---------------------- | ------------------- | ---------------------- | ------------------- |
| Input     | 750           | 100%                         | 750 (basic x 0.19)     | 750                 | 3750                   | 18800               |
| Tin       | 161           | 78.6% (pure)                 | 90.9481                | 478.674             | 2393.370               | 11998.762           |
| Oxygen    | 43.4          | 21.4% (pure)                 | 24.7619                | 130.326             | 651.630                | 3266.838            |
| Iron      | 0             | 5-10+%                       | 10.6875                | 56.250              | 281.250                | 1410.000            |
| Titanium  | 0             | 2-5%                         | 0                      | 30.000              | 150.000                | 752.000             |
| Silicon   | 0             | 1-3%                         | 0                      | 15.000              | 75.000                 | 376.000             |
| Tantalum  | 0             | <1%                          | 0                      | 0                   | 37.500                 | 188.000             |
| Niobium   | 0             | <1%                          | 0                      | 0                   | 37.500                 | 188.000             |
| Zinc      | 0             | <1%                          | 0                      | 0                   | 37.500                 | 188.000             |
| Tungston  | 0.585         | <1%                          | 0                      | 0                   | 37.500                 | 188.000             |
| Manganese | 0             | <0.5%                        | 0                      | 0                   | 0                      | 94.000              |
| Scandium  | 0             | <0.5%                        | 0                      | 0                   | 0                      | 94.000              |
| Germanium | 0             | <0.1%                        | 0                      | 0                   | 0                      | 18.800              |
| Indium    | 1.81          | <0.1%                        | 0                      | 0                   | 0                      | 18.800              |
| Gallium   | 0             | <0.1%                        | 0                      | 0                   | 0                      | 18.800              |
