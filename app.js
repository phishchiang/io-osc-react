const express = require("express");
// const app = express();
const socketIO = require("socket.io");
const path = require("path");

// const OSC = require("osc-js");
// const config = { udpClient: { port: 9129, secure: true } };
// const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

// osc.open(); // start a WebSocket server on port 8080

// osc.on("/touch/x", message => console.log(message.args));
// osc.on("/touch/y", message => console.log(message.args));

const INDEX = path.join(__dirname, "./client/build/index.html");
const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static("client/build"))
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on("connection", socket => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// setInterval(() => io.emit("time", new Date().toTimeString()), 1000);

io.on("connection", function(socket) {
  console.log(socket.id);
  socket.on("touch_fire", function(obj) {
    // console.log(obj);
    io.emit("bcat_fire", obj);
  });
  socket.on("touch_posi", function(obj) {
    // console.log(obj);
    io.emit("bcat_posi", obj);
  });
});
