import { actionLogic, createPlayer } from "./MainLogic";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function resizeCanvas() {
  let width = document.documentElement.clientWidth - 25;
  let height = document.documentElement.clientHeight - 22;
  canvas.width = width;
  canvas.height = height;
}

resizeCanvas();
createPlayer();
let newPlayer = createPlayer();

let drawingLoop = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  actionLogic();
  newPlayer.draw();
};

setInterval(() => {
  drawingLoop();
}, 10);
