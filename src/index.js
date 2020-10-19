import { actionLogic, checkCollision, createPlayer } from "./MainLogic";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let PlayerList = [];

function resizeCanvas() {
  let width = document.documentElement.clientWidth - 25;
  let height = document.documentElement.clientHeight - 22;
  canvas.width = width;
  canvas.height = height;
}

resizeCanvas();
