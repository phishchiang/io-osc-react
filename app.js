const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const OSC = require("osc-js");
const config = { udpClient: { port: 9129, secure: true } };
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

osc.open(); // start a WebSocket server on port 8080

osc.on("/test/random", message => {
  console.log(message.args); // prints the message arguments
  console.log("好想睡覺喔");
});

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
);

// const io = socketIO(server);

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

http.listen(5000, () => {
  console.log("listening on *:5000");
});
