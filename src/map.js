const fs = require("fs");
const path = require("path");


function getMap() {
  if (!fs.existsSync("./data/map.json")) {
    return {}; // This is the basic starting strucure for the file
  }

  return JSON.parse(fs.readFileSync("./data/map.json"));
}

function setMap(data) {
  // TODO back up the previous map file maybe?
  try {
    fs.writeFileSync("./data/map.json", JSON.stringify(data, null, 2));
    return false;
  } catch(err) {
    console.log(err);
    return err;
  }
}

module.exports = {
  getMap,
  setMap,
};
