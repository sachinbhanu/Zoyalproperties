/**
 * Image library. All photos are free-to-use from Unsplash (https://unsplash.com/license).
 * To rebrand: swap the IDs below (the part after "photo-" in an Unsplash URL),
 * or replace entries with full URLs from Pexels / Pixabay (hosts are allow-listed
 * in next.config.mjs).
 */
export const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  // Towers / skylines
  towerGlass: "1486406146926-c627a92ad1ab",
  towerMirror: "1431576901776-e539bd916ba2",
  towerModern: "1448630360428-65456885c650",
  towerBalcony: "1460317442991-0ec209397118",
  towerWhite: "1479839672679-a46483c0e7c8",
  towerArch: "1487958449943-2429e8be8625",
  towerMinimal: "1496307653780-42ee777d4833",
  towerMono: "1511818966892-d7d671e672a2",
  towerDark: "1545324418-cc1a3fa10c00",
  skylineNight: "1486325212027-8081e485255e",
  seaPromenade: "1567157577867-05ccb1388e66",
  skyline: "1444084316824-dc26d6657664",
  skylineAerial: "1477959858617-67f85cf4f1df",
  // Villas / houses
  villaPool1: "1512917774080-9991f1c4c750",
  villaPalm: "1564013799919-ab600027ffc6",
  villaPool2: "1580587771525-78b9dba3b914",
  villaPool3: "1582268611958-ebfd161ef9cf",
  villaOrange: "1600047509807-ba8f99d2cdde",
  villaWood: "1600566753190-17f0baa2a6c3",
  villaCube: "1600573472592-401b489a3cdc",
  villaNight: "1600585153490-76fb20a32601",
  villaDusk: "1600585154340-be6161a56a0c",
  villaWhite: "1600596542815-ffad4c1539a9",
  villaPool4: "1602343168117-bb8ffe3e2e9f",
  villaPool5: "1613490493576-7fde63acd811",
  villaPool6: "1613977257363-707ba9348227",
  villaGarden: "1600607688969-a5bfcd646154",
  villaGlass: "1600573472550-8090b5e0745e",
  // Interiors
  livingBright: "1600607687939-ce8a6c25118c",
  livingWarm: "1502672260266-1c1ef2d93688",
  livingSofa: "1554995207-c18c203602cb",
  livingModern: "1560448204-e02f11c3d0e2",
  livingDark: "1600121848594-d8644e57abab",
  livingLight: "1600210492486-724fe5c67fb0",
  livingLounge: "1600585152915-d208bec867a1",
  livingWood: "1600607688066-890987f18a86",
  livingSuite: "1628592102751-ba83b0314276",
  livingBlue: "1505691938895-1758d7feb511",
  livingLoft: "1493809842364-78817add7ffb",
  livingMinimal: "1516455590571-18256e5bb9ff",
  livingGrey: "1522708323590-d24dbb6b0267",
  stairs: "1600607687920-4e2a09cf159d",
  kitchenWhite: "1601760562234-9814eea6663a",
  kitchenIsland: "1484154218962-a197022b5858",
  kitchenDark: "1600607686527-6fb886090705",
  kitchenWarm: "1556911220-bff31c812dba",
  bedroomOrange: "1540518614846-7eded433c457",
  bedroomBlue: "1522771739844-6a9f6d5f14af",
  bedroomLight: "1521783988139-89397d761dce",
  bedroomSoft: "1512918728675-ed5a9ecdebfd",
  // Commercial
  officeBoardroom: "1431540015161-0bf868a2d407",
  officeKitchen: "1497366216548-37526070297c",
  officeGlass: "1497366811353-6870744d04b2",
  mall: "1519567241046-7f570eee3ce6",
  // Land / plots
  plotAerial: "1512699355324-f07e3106dae5",
  plotLayout: "1565402170291-8491f14678db",
  plotField: "1500382017468-9049fed747ef",
  plotHome: "1558036117-15d82a90b9b1",
  // Editorial
  gateway: "1570168007204-dfb528c6958f",
  indiaGate: "1587474260584-136574528ed5",
  construction: "1558618666-fcd25c85cd64",
  blueprint: "1503387762-592deb58ef4e",
  team1: "1507089947368-19c1da9775ae",
} as const;

export type ImgKey = keyof typeof IMG;

export const img = (key: ImgKey, w = 1600) => unsplash(IMG[key], w);
export const imgs = (keys: ImgKey[], w = 1600) => keys.map((k) => img(k, w));
