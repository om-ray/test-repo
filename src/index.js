import Bullet from "./Bullet";
import { actionLogic, checkCollision, createPlayer } from "./MainLogic";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let socket = io({ reconnection: false });
let PlayerList = [];
let EnemyList = [];

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

let mainPlayer = PlayerList[0];

socket.on("New connection", function (data) {
  let otherPlayer = createPlayer("other");
  otherPlayer.id = data.player.id;
  EnemyList.push(otherPlayer);
  socket.emit("me", { me: PlayerList[0], connector: data.connector });
});

socket.on("players updated info", function (playerData) {
  EnemyList.forEach((enemy) => {
    if (enemy.id == playerData.id) {
      enemy.x = playerData.x;
      enemy.y = playerData.y;
      enemy.health = playerData.health;
      enemy.sx = playerData.sx;
      enemy.sy = playerData.sy;
    }
  });
});

socket.on("bullets updated info", function (bulletInfo) {
  EnemyList.forEach((enemy) => {
    if (enemy.id == bulletInfo.id) {
      while (enemy.bulletList.length <= bulletInfo.bulletList) {
        let bullet = new Bullet({
          x: bulletInfo.bulletX,
          y: bulletInfo.bulletY,
          width: bulletInfo.bulletWidth,
          height: bulletInfo.bulletHeight,
          direction: bulletInfo.bulletDirection,
          shooter: bulletInfo.bulletShooter,
          substitute: true,
        });
        enemy.bulletList.push(bullet);
      }
    }
  });
});

let sendPlayerInfo = function () {
  socket.emit("updated player info", {
    id: mainPlayer.id,
    x: mainPlayer.x,
    y: mainPlayer.y,
    health: mainPlayer.health,
    sx: mainPlayer.sx,
    sy: mainPlayer.sy,
    bulletList: mainPlayer.bulletList.length,
  });
};

let sendBulletInfo = function () {
  socket.emit("updated bullet info", {
    id: mainPlayer.id,
    bulletList: mainPlayer.bulletList.length,
    bulletX: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].x,
    bulletY: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].y,
    bulletWidth: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].width,
    bulletHeight: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].height,
    bulletDirection: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].direction,
    bulletShooter: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].shooter,
    bulletSubstitue: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].substitute,
  });
};

socket.on("updated player health", function (health, id) {
  PlayerList.forEach((player) => {
    if (player.id == id) {
      player.health = health;
    }
  });
});

let pvpChecker = function () {
  for (let i in EnemyList) {
    let enemy = EnemyList[i];
    for (let u in PlayerList[0].bulletList) {
      let currentBullet = PlayerList[0].bulletList[u];
      if (checkCollision(currentBullet, enemy)) {
        if (enemy.id != mainPlayer.id && currentBullet.shooter == mainPlayer.id) {
          enemy.health -= 1;
          socket.emit("player health", enemy.health, enemy.id);
          PlayerList[0].bulletList.splice(u, 1);
        }
      }
    }
    for (let u in enemy.bulletList) {
      let currentBullet = enemy.bulletList[u];
      if (checkCollision(currentBullet, enemy)) {
        if (currentBullet.shooter == enemy.id) {
          enemy.bulletList.splice(u, 1);
        }
      }
    }
  }
};

socket.on("other player", function (them) {
  let otherPlayer = createPlayer("other");
  otherPlayer.id = them.id;
  EnemyList.push(otherPlayer);
  EnemyList.forEach((enemy) => {
    if (enemy.id == them.id) {
      enemy.x = them.x;
      enemy.y = them.y;
      enemy.sx = them.sx;
      enemy.sy = them.sy;
    }
  });
});

socket.on("someone disconnected", function (disconnector) {
  EnemyList.forEach((enemy) => {
    if (enemy.id == disconnector) {
      EnemyList.splice(EnemyList.indexOf(enemy.id));
    }
  });
});

let drawingLoop = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  actionLogic(mainPlayer);
  PlayerList.forEach((player) => {
    player.draw();
  });
  EnemyList.forEach((enemy) => {
    enemy.draw();
  });
};

let Game_loop = function () {
  drawingLoop();
  sendPlayerInfo();
  if (mainPlayer.bulletList.length > 0) {
    sendBulletInfo();
    pvpChecker();
  }
  EnemyList.forEach((enemy) => {
    if (enemy.bulletList.length > 0) {
      pvpChecker();
    }
  });
};

setInterval(() => {
  Game_loop();
}, 10);
