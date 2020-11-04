const { Socket } = require("dgram");
let express = require("express");
let app = express();
let server = require("http").createServer(app);
let io = require("socket.io")(server);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use("/dist", express.static(__dirname + "/dist"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/style.css", express.static(__dirname + "/style.css"));

server.listen(3000);
console.log("Server listening on port 3000");

let socketList = [];
let playerList = [];

let Player = function () {
  this.id = Math.floor(10000 + Math.random() * 90000);
  this.hp = 100;
  this.maxHp = 100;
  this.speed = 0.07;
  this.maxSpeed = 0.09;
  this.bulletList = [];
  this.ammoList = [];
  this.movement = {
    forward: false,
    left: false,
    backwards: false,
    right: false,
  };

  this.attack = {
    shoot: false,
  };

  this.shoot = function () {
    socket.emit("shoot");
  };
};

io.on("connection", function (socket) {
  console.log(socket.id + " joined the server on " + new Date().toLocaleString());

  socket.on("I wish to exist", function (player) {
    let newPlayer = new Player();
    playerList.push({
      player: newPlayer,
      id: socket.id,
      username: null,
      score: 0,
    });
    socketList.push({
      socketId: socket.id,
      id: player.id,
    });
    socket.broadcast.emit("New connection", { player: player, connector: socket.id });
  });

  socket.on("updated player info", function (playerInfo) {
    socket.broadcast.emit("players updated info", playerInfo);
  });

  socket.on("updated bullet info", function (bulletInfo) {
    socket.broadcast.emit("bullets updated info", bulletInfo);
  });

  socket.on("me", function (data) {
    io.to(data.connector).emit("other player", data.me);
  });

  socket.on("player health", function (health, id) {
    socket.broadcast.emit("updated player health", health, id);
  });

  socket.on("disconnect", function () {
    console.log(socket.id + " left the server on " + new Date().toLocaleString());
    let id;
    for (let i in socketList) {
      if (socketList[i].socketId == socket.id) {
        id = socketList[i].id;
        socket.broadcast.emit("someone disconnected", id);
        socketList.splice(i, 1);
      }
    }
  });
});
