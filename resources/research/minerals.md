# Mineral research & updated blueprints

## Blueprints & Ideas

Currently each mineral has 3 blueprints (Basic, Advanced, Elite)
Currently all blueprints have a BuildTime of 30 seconds.
Advanced BP have 5 times more input than basic.
Elite BP have 25 times more input than basic (or 5 times more than advanced).

To have more streamlined values i suggest to adjust BuildTime instead of output and input values.

To reduce the amount of blueprints we could also adjust the base speed of refineries.

To have a bit more variance we could use a bluprint with impurities, elite would return all, advanced -1, basic -2 and SurvivalKit only outputs pure components.
For this every mineral needs at least 3 impurities.

## Work with real mass % values

To work with real values for outputs we have to reduce the basic efficiency of refineries, so that they wont ever create stuff out of the void when adding the best efficiency modules.
I suggest to change the default `MaterialEfficiency` of the refineries:

| refinery                        | current | new    | Best modded |
| ------------------------------- | ------- | ------ | ----------- |
| Blast Furnace                   | 0.7     | 0.2100 | 0.2100      |
| LargeRefinery                   | 0.8     | 0.2325 | 0.9051      |
| LargeRefineryIndustrial         | 0.88    | 0.2450 | 0.9538      |
| LargeBlockLargeAdvancedRefinery | 0.88    | 0.2450 | 0.9538      |
| LargeBlockLargeEliteRefinery    | 1.0     | 0.2565 | 0.9986      |

The `SurvivalKit` always has a `MaterialEfficiency` of 1 (because it does not act as refinery), so we need adjusted blueprints for it.
I suggest reducing the output amount to ~30% (+-3%) to achive this.

## Minerals

### Tungsten [W]

Current sources are `Wulfenite` and `Cassiterite`
A Better Mineral could be `Feberite`

#### Feberite [Fe²+WO4]

@See <https://www.mineralienatlas.de/lexikon/index.php/MineralData?mineral=Ferberit>
@See <https://www.mindat.org/min-1476.html>

| Mineral   | Mass% | BP SK | BP Basic | BP Advanced | BP Elite |
| --------- | ----- | ----- | -------- | ----------- | -------- |
| BuildTime |       | 30    | 30       | 60          | 12       |
| Input     | 100   | 1000  | 1000     | 10000       | 10000    |
| --------- | ----- | ----- | -------- | ----------- | -------- |
| Tungsten  | 60.54 | 200   | 605.4    | 6054        | 6054     |
| Oxygen    | 21.07 | 70    | 210.7    | 2107        | 2107     |
| Iron      | 18.39 | 6     | 183.9    | 1839        | 1839     |

Possible impurities Nb,Ta,Sc,Sn
**NOTE** there are no reals fact values for impurities because they vary from source to source. For this reason we consider an impurity of 5%.

| Mineral   | Mass% | BP SK | BP Basic | BP Advanced | BP Elite |
| --------- | ----- | ----- | -------- | ----------- | -------- |
| BuildTime |       | 30    | 30       | 60          | 12       |
| Input     | 100   | 1000  | 1000     | 10000       | 10000    |
| --------- | ----- | ----- | -------- | ----------- | -------- |
| Tungsten  | 57.52 | 172   | 5752     | 5752        | 5752     |
| Oxygen    | 20.01 | 60    | 2001     | 2001        | 2001     |
| Iron      | 17.47 | 52    | 1747     | 1747        | 1747     |
| Scandium  | 1.00  |       | 100      | 100         | 100      |
| Tantalum  | 1.75  |       | 175      | 175         | 175      |
| Niobium   | 1.75  |       |          | 175         | 175      |
| Zinc      | 0.50  |       |          |             | 50       |

#### Wulfenite

@see <https://www.mineralienatlas.de/lexikon/index.php/MineralData?mineral=Wulfenite>
@see <https://www.mindat.org/min-4322.html>

Wulfenite has no Tungsten

| Mineral    | Mass% | BP SK | BP Basic | BP Advanced | BP Elite |
| ---------- | ----- | ----- | -------- | ----------- | -------- |
| BuildTime  |       | 30    | 30       | 60          | 12       |
| Input      | 100   | 1000  | 1000     | 10000       | 10000    |
| ---------- | ----- | ----- | -------- | ----------- | -------- |
| Lead       | 56.44 | 170   | 564.4    | 5644        | 5644     |
| Molybdenum | 26.13 | 90    | 261.3    | 2613        | 2613     |
| Oxygen     | 17.43 | 60    | 174.3    | 1743        | 1743     |

Possible impurities Ca,V,As,Cr,Ti

#### Cassiterite

@see <https://www.mineralienatlas.de/lexikon/index.php/MineralData?mineral=Cassiterite>
@see <https://www.mindat.org/min-917.html>

Cassiterite only has Tungsten as impurity

| Mineral    | Mass% | BP SK | BP Basic | BP Advanced | BP Elite |
| ---------- | ----- | ----- | -------- | ----------- | -------- |
| BuildTime  |       | 30    | 30       | 60          | 12       |
| Input      | 100   | 1000  | 1000     | 10000       | 10000    |
| ---------- | ----- | ----- | -------- | ----------- | -------- |
| Tin        | 78.77 | 260   | 787.7    | 7877        | 7877     |
| Oxygen     | 21.23 | 70    | 212.3    | 2123        | 2123     |

Possible impurities Fe,Ta,Nb,Zn,W,Mn,Sc,Ge,In,Ga
