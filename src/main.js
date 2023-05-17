const supportedDevices = require("./supported_devices.js");
const path = require("path");
const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const map = require("./map.js");
const config = require("./config.js")();
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.json());

app.use("/", express.static("./static"));

app.use((req, res, next) => {
  req.start = Date.now();
  next();
});

app.get("/", (req, res) => {

  res.render("home", {
    page: {
      title: config.title
    }
  });

});

app.get("/supported_devices", (req, res) => {
  res.status(200).json(supportedDevices);
});

app.get("/default_map", (req, res) => {
  // todo: this can rely on config values to be set
  res.status(200).sendFile(path.resolve(`./data/${config.map}`));
});

app.get("/collection", (req, res) => {
  // This is used to send the internal map structure
  res.status(200).json(map.getMap());
});

app.post("/collection", (req, res) => {
  let data = req.body;
  // now we have our data, that we want to save
  let writeOp = map.setMap(data);

  if (!writeOp) {
    res.status(201).send();
  } else {
    res.status(500).send(writeOp);
  }

});

app.get("/toast-generator", (req, res) => {
  let params = {
    title: req.query?.title ?? "",
    text: req.query?.text ?? "",
    id: req.query?.id ?? ""
  };

  let obj = ejs.render(fs.readFileSync("./views/toast.ejs", {encoding:"utf8"}), {...params});

  res.status(200).json({ content: obj });
});

app.use(async (req, res) => {
  // 404 here
  res.status(404).json({ message: "Resource Not Found" });
});

module.exports = app;
