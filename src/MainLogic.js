import Player from "./Player";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let newPlayer;

export let createPlayer = function () {
  newPlayer = new Player({
    username: "null",
    email: "null",
    x: 0,
    y: 0,
    health: 100,
    keys: ["w", "a", "s", "d", " "],
  });

  newPlayer.draw();

  return newPlayer;
};

export let actionLogic = function () {
  document.onkeydown = (e) => {
    if (e.key === newPlayer.keys[0]) {
      newPlayer.direction.up = true;
      newPlayer.lastDirection = "up";
    }
    if (e.key === newPlayer.keys[1]) {
      newPlayer.direction.left = true;
      newPlayer.lastDirection = "left";
    }
    if (e.key === newPlayer.keys[2]) {
      newPlayer.direction.down = true;
      newPlayer.lastDirection = "down";
    }
    if (e.key === newPlayer.keys[3]) {
      newPlayer.direction.right = true;
      newPlayer.lastDirection = "right";
    }
    if (e.key === newPlayer.keys[4]) {
      newPlayer.attacking = true;
    }
  };

  document.onkeyup = (e) => {
    if (e.key === newPlayer.keys[0]) {
      newPlayer.direction.up = false;
    }
    if (e.key === newPlayer.keys[1]) {
      newPlayer.direction.left = false;
    }
    if (e.key === newPlayer.keys[2]) {
      newPlayer.direction.down = false;
    }
    if (e.key === newPlayer.keys[3]) {
      newPlayer.direction.right = false;
    }
    if (e.key === newPlayer.keys[4]) {
      newPlayer.attacking = false;
    }
  };

  newPlayer.action();
};
