let shutdownCB, serve;

async function exterminate(callee) {
  console.log(`${callee} signal received`);
  if (typeof shutdownCB === "function") {
    await shutdownCB();
  }
  console.log("Exiting...");
  if (typeof serve !== "undefined") {
    serve.close(() => {
      console.log("HTTP Server Closed");
    });
  }
}

function registerCB(func) {
  shutdownCB = func;
}

function registerServer(serv) {
  serve = serv;
}

process.on("SIGTERM", async() => { await exterminate("SIGTERM"); });

process.on("SIGINT", async() => { await exterminate("SIGINT"); });


module.exports = {
  exterminate,
  registerCB,
  registerServer,
};
