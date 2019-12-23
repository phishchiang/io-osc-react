const express = require("express");
// const app = express();
const socketIO = require("socket.io");
const path = require("path");

const cors = require("cors");
const five = require("johnny-five");
const board = new five.Board();

const OSC = require("osc-js");
const config = { udpClient: { port: 9129, secure: true } };
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

osc.open(); // start a WebSocket server on port 8080

// osc.on("/test/x", message => console.log(message.args));
// osc.on("/test/y", message => console.log(message.args));

const INDEX = path.join(__dirname, "./client/build/index.html");
const PORT = process.env.PORT || 3000;

const server = express()
  .use(cors)
  .use(express.static("client/build"))
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

board.on("ready", () => {
  const led = new five.Led(13);

  const io = socketIO(server);

  io.on("connection", socket => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  setInterval(() => io.emit("time", new Date().toTimeString()), 1000);

  io.on("connection", function(socket) {
    console.log(socket.id);
    socket.on("mouse", function(obj) {
      // console.log(obj);
      io.emit("FINAL_bool", obj);
    });
    socket.on("touch_posi", function(obj) {
      // console.log(obj);
      io.emit("FINAL", obj);
    });
  });

  osc.on("/test/x", message => {
    console.log(message.args[0]);
    if (message.args[0] === "true") {
      console.log("BBB");
      led.on();
    }
    if (message.args[0] === "false") {
      console.log("GGG");
      led.off();
    } else {
      console.log("nothing");
    }
  });
  osc.on("/test/y", message => console.log(message.args));
});

// io.on("connection", socket => {
//   console.log("Client connected");
//   socket.on("disconnect", () => console.log("Client disconnected"));
// });

// setInterval(() => io.emit("time", new Date().toTimeString()), 1000);

// io.on("connection", function(socket) {
//   console.log(socket.id);
//   socket.on("mouse", function(obj) {
//     console.log(obj);
//     io.emit("FINAL_bool", obj);
//   });
//   socket.on("touch_posi", function(obj) {
//     console.log(obj);
//     io.emit("FINAL", obj);
//   });
// });
