const yaml = require("js-yaml");
const fs = require("fs");

function readConfig() {
  try {
    const doc = yaml.load(fs.readFileSync("./data/app.yaml", "utf8"));
    return doc;
  } catch(err) {
    console.log(err);
    process.exit(1);
  }
}

function getConfig() {
  let data = readConfig();

  return {
    port: data.PORT ?? 8080,
    title: data.TITLE ?? "Org Map",
    map: data.MAP ?? ""
  };
}

module.exports = getConfig;
