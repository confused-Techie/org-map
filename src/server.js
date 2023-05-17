const app = require("./main.js");
const { port } = require("./config.js")();
const exterminate = require("./exterminate.js");

const serve = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

exterminate.registerServer(serve);
