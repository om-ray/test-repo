import Player from "./Player";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let newPlayer;
let w = window.innerWidth;
let h = window.innerHeight;

export let createPlayer = function (type) {
  type == "main"
    ? (newPlayer = new Player({
        username: "",
        email: "null",
        x: w / 2,
        y: h / 2,
        type: type,
        health: 100,
        keys: ["w", "a", "s", "d", " ", "r"],
      }))
    : type == "other"
    ? (newPlayer = new Player({
        username: "",
        email: "null",
        x: w / 2,
        y: h / 2,
        health: 100,
        type: type,
        keys: ["w", "a", "s", "d", " ", "r"],
      }))
    : null;
  newPlayer.draw();
  return newPlayer;
};

export function roundRect(ctx, x, y, width, height, radius, fill, stroke, fillcolor, strokecolor) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius.tl, tr: radius.tr, br: radius.br, bl: radius.bl };
  } else {
    let defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (let side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.fillStyle = fillcolor;
  ctx.strokeStyle = strokecolor;
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fillStyle = fillcolor;
  ctx.lineWidth = "1px";
  ctx.strokeStyle = strokecolor;
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

export let removeDupes = function (arr) {
  // let uniq = [...new Set(arr)];
  // console.log(uniq);
  return [...new Set(arr)];
};

export let sortArray = async function (arr, fallback) {
  await arr.sort((a, b) => {
    if (fallback) {
      if (a.score !== b.score) {
        return b.score - a.score;
      } else if (a.score == b.score) {
        if (a.username < b.username) {
          return -1;
        }
        if (a.username > b.username) {
          return 1;
        }
        return 0;
      }
    } else if (!fallback) {
      return b.score - a.score;
    }
  });
};

export let sortArrayByDate = async function (arr) {
  await arr.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
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
    if (e.key === Player.keys[4] && !Player.reloading && Player.ammoLeft > 0) {
      Player.attacking = true;
    } else if (e.key === Player.keys[4] && !Player.reloading && Player.ammoLeft == 0) {
      Player.attacking = false;
    }
    if (e.key === Player.keys[5] && Player.ammoLeft <= 0 && !Player.reloading) {
      Player.reloading = true;
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

  if (x1 <= xMax2 && xMax1 >= x2 && y1 <= yMax2 && yMax1 >= y2) {
    return true;
  }
};
