const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");

const xmlDataStr = fs.readFileSync("./Library.xml", "utf-8");

const options = {
  ignoreAttributes: false,
  preserveOrder: true,
};

const parser = new XMLParser(options);
const json = parser.parse(xmlDataStr);

fs.writeFileSync("library.json", JSON.stringify(json));
