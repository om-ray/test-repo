import Player from "./Player";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let newPlayer;
let w = window.innerWidth;
let h = window.innerHeight;

export let createPlayer = function (type) {
  type == "main"
    ? (newPlayer = new Player({
        username: "null",
        email: "null",
        x: w / 2,
        y: h / 2,
        type: type,
        health: 100,
        keys: ["w", "a", "s", "d", " "],
      }))
    : type == "other"
    ? (newPlayer = new Player({
        username: "null",
        email: "null",
        x: w / 2,
        y: h / 2,
        health: 100,
        type: type,
        keys: ["w", "a", "s", "d", " "],
      }))
    : null;
  newPlayer.draw();
  return newPlayer;
};

export let actionLogic = function (Player) {
  document.onkeydown = (e) => {
    if (e.key === Player.keys[0]) {
      Player.direction.up = true;
      Player.lastDirection = "up";
    }
    if (e.key === Player.keys[1]) {
      Player.direction.left = true;
      Player.lastDirection = "left";
    }
    if (e.key === Player.keys[2]) {
      Player.direction.down = true;
      Player.lastDirection = "down";
    }
    if (e.key === Player.keys[3]) {
      Player.direction.right = true;
      Player.lastDirection = "right";
    }
    if (e.key === Player.keys[4]) {
      Player.attacking = true;
    }
  };

  document.onkeyup = (e) => {
    if (e.key === Player.keys[0]) {
      Player.direction.up = false;
      Player.sx = 0;
    }
    if (e.key === Player.keys[1]) {
      Player.direction.left = false;
      Player.sx = 0;
    }
    if (e.key === Player.keys[2]) {
      Player.direction.down = false;
      Player.sx = 0;
    }
    if (e.key === Player.keys[3]) {
      Player.direction.right = false;
      Player.sx = 0;
    }
    if (e.key === Player.keys[4]) {
      Player.attacking = false;
    }
  };

  Player.action();
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
  if (object1.shooter && object2.id) {
    if (object1.shooter !== object2.id) {
      if (x1 <= xMax2 && xMax1 >= x2 && y1 <= yMax2 && yMax1 >= y2) {
        return true;
      }
    }
  }
};
