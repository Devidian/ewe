# INFO

The data files in this directory are created by AI with ALL potential AVERAGE impurities.

Mineral sources

| Mineral      | URL                                  |
| ------------ | ------------------------------------ |
| Chamosite    | https://www.mindat.org/min-967.html  |
| Cassiterite  | https://www.mindat.org/min-917.html  |
| Chalcopyrite | https://www.mindat.org/min-955.html  |
| Chromite     | https://www.mindat.org/min-1036.html |
|Calaverite|https://www.mindat.org/min-852.html|
|||
|||
|||

## AI promt

Research the Mineral `Calaverite`.
Calculate volume in liters for 1kg of the mineral.
Research all maximum presence of possible impurities listed on `https://www.mindat.org/min-852.html`
Research in other sources too for the maximum impurities.
Create a table with following columns: element, symbol, known presence minimum, presence maximum.
Total mass of mineral is 1kg
Total mass of elements must not exceed 1kg
Calculate mass of all chemical elements in the mineral using maximum presence of all possible impurities.
Dont forget Oxygen if it is present as main element.
Remember to substract impurity mass from total before calculating mass of main elements.
Cap total impurity mass to 30% of total mass.
Create a JSON file using the following format:

```ts
interface Element {
  name: string; // english element name; example: tin
  short: string; // chemical short name; example: Sn
  mass: number; // % of total mass in the Mineral; example: 0.7792
}
interface Mineral {
  name: string; // english mineral name; example: cassiterite
  short: string; // chemical short name; example: SnO2
  mass: number; // always 1, all parts of elements must sum up to 1
  volume: number; // calculate volume in liters per kg of the mineral
  elements: Element[]; // all possible elements with all possible common impurities according to https://www.mindat.org
}
```

### Things to look for AI output

- sometimes AI does not calculate elemental mass correctly and exceeds 1.0
  - ask AI to verify mass
  - tell AI to substract impurities from total mass before calculating the main elements
- sometimes AI misses elements (forgot Oxygen in SnO2)
- everytime you ask AI you get other values for impurities due to different sources the AI uses.
