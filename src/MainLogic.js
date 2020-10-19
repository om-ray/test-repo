import Player from "./Player";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let PlayerList = [];
let newPlayer;

export let createPlayer = function (type) {
  if (type == 1) {
    newPlayer = new Player({
      username: "null",
      email: "null",
      x: 0,
      y: 0,
      health: 100,
      keys: ["w", "a", "s", "d", " "],
    });
  }

  if (type == 2) {
    newPlayer = new Player({
      username: "null",
      email: "null",
      x: 0,
      y: 0,
      health: 100,
      keys: ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "Shift"],
    });
  }

  return newPlayer;
};

createPlayer(1);
createPlayer(2);
let newPlayer1 = createPlayer(1);
let newPlayer2 = createPlayer(2);
PlayerList.push(newPlayer1);
PlayerList.push(newPlayer2);

export let actionLogic = function () {
  document.onkeydown = (e) => {
    if (e.key === newPlayer1.keys[0]) {
      newPlayer1.direction.up = true;
      newPlayer1.lastDirection = "up";
    }
    if (e.key === newPlayer1.keys[1]) {
      newPlayer1.direction.left = true;
      newPlayer1.lastDirection = "left";
    }
    if (e.key === newPlayer1.keys[2]) {
      newPlayer1.direction.down = true;
      newPlayer1.lastDirection = "down";
    }
    if (e.key === newPlayer1.keys[3]) {
      newPlayer1.direction.right = true;
      newPlayer1.lastDirection = "right";
    }
    if (e.key === newPlayer1.keys[4]) {
      newPlayer1.attacking = true;
    }
    if (e.key === newPlayer2.keys[0]) {
      newPlayer2.direction.up = true;
      newPlayer2.lastDirection = "up";
    }
    if (e.key === newPlayer2.keys[1]) {
      newPlayer2.direction.left = true;
      newPlayer2.lastDirection = "left";
    }
    if (e.key === newPlayer2.keys[2]) {
      newPlayer2.direction.down = true;
      newPlayer2.lastDirection = "down";
    }
    if (e.key === newPlayer2.keys[3]) {
      newPlayer2.direction.right = true;
      newPlayer2.lastDirection = "right";
    }
    if (e.key === newPlayer2.keys[4]) {
      newPlayer2.attacking = true;
    }
  };

  document.onkeyup = (e) => {
    if (e.key === newPlayer1.keys[0]) {
      newPlayer1.direction.up = false;
      newPlayer1.sx = 0;
    }
    if (e.key === newPlayer1.keys[1]) {
      newPlayer1.direction.left = false;
      newPlayer1.sx = 0;
    }
    if (e.key === newPlayer1.keys[2]) {
      newPlayer1.direction.down = false;
      newPlayer1.sx = 0;
    }
    if (e.key === newPlayer1.keys[3]) {
      newPlayer1.direction.right = false;
      newPlayer1.sx = 0;
    }
    if (e.key === newPlayer1.keys[4]) {
      newPlayer1.attacking = false;
    }
    if (e.key === newPlayer2.keys[0]) {
      newPlayer2.direction.up = false;
      newPlayer2.sx = 0;
    }
    if (e.key === newPlayer2.keys[1]) {
      newPlayer2.direction.left = false;
      newPlayer2.sx = 0;
    }
    if (e.key === newPlayer2.keys[2]) {
      newPlayer2.direction.down = false;
      newPlayer2.sx = 0;
    }
    if (e.key === newPlayer2.keys[3]) {
      newPlayer2.direction.right = false;
      newPlayer2.sx = 0;
    }
    if (e.key === newPlayer2.keys[4]) {
      newPlayer2.attacking = false;
    }
  };

  newPlayer1.action();
  newPlayer2.action();
};

export let checkCollision = function (object1, object2) {
  let x1 = object1.collisionBox.x;
  let y1 = object1.collisionBox.y;
  let xMax1 = object1.collisionBox.xMax;
  let yMax1 = object1.collisionBox.yMax;
  let x2 = object2.collisionBox.x;
  let y2 = object2.collisionBox.y;
  let xMax2 = object2.collisionBox.xMax;
  let yMax2 = object2.collisionBox.yMax;

  // ctx.strokeStyle = "red";
  // ctx.strokeRect(x1, y1, xMax1 - x1, yMax1 - y1);
  // ctx.strokeRect(x2, y2, xMax2 - x2, yMax2 - y2);

  if (x1 <= xMax2 && xMax1 >= x2 && y1 <= yMax2 && yMax1 >= y2) {
    return true;
  }
};

let drawingLoop = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  actionLogic(newPlayer1);
  actionLogic(newPlayer2);
  PlayerList.forEach((players) => {
    players.draw();
  });
  for (var i in PlayerList) {
    PlayerList[i].draw();
    for (var u in PlayerList[i].bulletList) {
      PlayerList[i].bulletList[u].move();
      PlayerList[i].bulletList[u].draw();
      if (newPlayer2.bulletList.length > 0) {
        if (newPlayer2.bulletList[u]) {
          if (newPlayer2.bulletList[u].collisionBox) {
            checkCollision(newPlayer2.bulletList[u], newPlayer1);
            if (checkCollision(newPlayer2.bulletList[u], newPlayer1)) {
              newPlayer2.bulletList.splice(u, 1);
              console.log("collided");
              newPlayer1.health -= newPlayer1.damage;
              if (newPlayer1.health <= 0) {
                newPlayer2.score += 1;
              }
            }
          }
        }
      }
      if (newPlayer1.bulletList.length > 0) {
        if (newPlayer1.bulletList[u]) {
          if (newPlayer1.bulletList[u].collisionBox) {
            checkCollision(newPlayer1.bulletList[u], newPlayer2);
            if (checkCollision(newPlayer1.bulletList[u], newPlayer2)) {
              newPlayer1.bulletList.splice(u, 1);
              console.log("collided");
              newPlayer2.health -= newPlayer2.damage;
              if (newPlayer2.health <= 0) {
                newPlayer1.score += 1;
              }
            }
          }
        }
      }
    }
  }
};

let Game_loop = function () {
  drawingLoop();
};

setInterval(() => {
  Game_loop();
}, 20);
