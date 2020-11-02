import { actionLogic, createPlayer } from "./MainLogic";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let socket = io({ reconnection: false });
let PlayerList = [];

function resizeCanvas() {
  let width = document.documentElement.clientWidth - 25;
  let height = document.documentElement.clientHeight - 22;
  canvas.width = width;
  canvas.height = height;
}

resizeCanvas();

let newPlayer = createPlayer("main");
PlayerList.push(newPlayer);
socket.emit("I wish to exist", PlayerList[0]);

socket.on("New connection", function (data) {
  let otherPlayer = createPlayer("other");
  otherPlayer.id = data.player.id;
  PlayerList.push(otherPlayer);
  socket.emit("me", { me: PlayerList[0], connector: data.connector });
});

socket.on("players updated info", function (playerData) {
  PlayerList.forEach((players) => {
    if (players.id == playerData.id) {
      players.x = playerData.x;
      players.y = playerData.y;
      players.sx = playerData.sx;
      players.sy = playerData.sy;
      for (let i in playerData.bulletList) {
        if (players.bulletList[i] !== playerData.bulletList[i]) {
          players.bulletList[i] = playerData.bulletList[i];
        }
      }
    }
  });
});

socket.on("other player", function (them) {
  let otherPlayer = createPlayer("other");
  otherPlayer.id = them.id;
  PlayerList.push(otherPlayer);
  PlayerList.forEach((players) => {
    if (players.id == them.id) {
      players.x = them.x;
      players.y = them.y;
      players.sx = them.sx;
      players.sy = them.sy;
      for (let i in them.bulletList) {
        if (players.bulletList[i] !== them.bulletList[i]) {
          players.bulletList[i] = them.bulletList[i];
        }
      }
    }
  });
});

socket.on("someone disconnected", function (disconnector) {
  PlayerList.forEach((players) => {
    if (players.id == disconnector) {
      PlayerList.splice(PlayerList.indexOf(disconnector));
    }
  });
});

socket.on("persons sprite", function (spriteAndPlayerId) {
  console.log(spriteAndPlayerId);
  PlayerList.forEach((players) => {
    if (players.id == spriteAndPlayerId.player) {
      console.log("changed sprite");
      players.image = spriteAndPlayerId.image;
    }
  });
});

let drawingLoop = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  actionLogic(PlayerList[0]);
  PlayerList.forEach((players) => {
    players.draw();
  });
};

let Game_loop = function () {
  drawingLoop();
  socket.emit("updated player info", PlayerList[0]);
};

setInterval(() => {
  Game_loop();
}, 10);
