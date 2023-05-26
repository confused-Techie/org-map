const supportedDeviceClasses = require("./supported_device_classes.js");
const supportedIcons = require("./supported_icons.js");
const config = require("./config.js")();
const fs = require("fs");

function getDevices() {
  return mixData(config.customDevices, supportedDeviceClasses);
}

function getIcons() {
  return mixData(config.customIcons, supportedIcons);
}

function mixData(conf, orig) {
  let customArray = [];

  if (conf) {
    if (typeof conf === "string") {
      customArray = JSON.parse(fs.readFileSync(`./data/${conf}`));
    } else if (Array.isArray(conf)) {
      customArray = conf;
    }
  }

  if (Array.isArray(customArray) && customArray.length > 0) {
    return orig.concat(customArray);
  } else {
    return orig;
  }
}

module.exports = {
  getDevices,
  getIcons,
};
