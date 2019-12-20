// const app = express();

const express = require("express");
// const app = express();
const socketIO = require("socket.io");
const path = require("path");

const OSC = require("osc-js");
const config = { udpClient: { port: 9129, secure: true } };
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

osc.open(); // start a WebSocket server on port 8080

osc.on("/test/random", message => {
  console.log(message.args); // prints the message arguments
  console.log("好想睡覺喔");
});

// app.use(express.static("client/build"));

const INDEX = path.join(__dirname, "./client/build/index.html");
const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static("client/build"))
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// app.get("*", (req, res) =>
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
// );

const io = socketIO(server);

io.on("connection", socket => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

io.on("connection", function(socket) {
  console.log(socket.id);
  socket.on("mouse", function(obj) {
    console.log(obj);
    io.emit("FINAL", obj);
  });
  socket.on("gogogo", function(obj) {
    console.log(obj);
    io.emit("FINAL", obj);
  });
});

// const PORT = process.env.PORT || 5500;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// const IO_PORT = 5500;
// http.listen(IO_PORT, () =>
//   console.log(`Socket.IO is listening on *: ${IO_PORT}`)
// );
