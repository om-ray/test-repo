import Bullet from "./Bullet";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let playerSpeed = 2;
let playerDamage = 5;
let Img = {};

let Male1 = function () {
  Img.player = new Image();
  Img.player.src = "../images/Male1.png";
  Img.player.onload = () => {
    return Img.player;
  };
};

let Male2 = function () {
  Img.player = new Image();
  Img.player.src = "../images/Male2.png";
  Img.player.onload = () => {
    return Img.player;
  };
};

let Female1 = function () {
  Img.player = new Image();
  Img.player.src = "../images/Female1.png";
  Img.player.onload = () => {
    return Img.player;
  };
};

let Female2 = function () {
  Img.player = new Image();
  Img.player.src = "../images/Female2.png";
  Img.player.onload = () => {
    return Img.player;
  };
};

let sprites = [Male1, Male2, Female1, Female2];

let Player = function (props) {
  let p = props;
  this.id = Math.floor(Math.random() * 1000000);
  this.sprite = sprites[Math.floor(Math.random() * sprites.length)]();
  this.username = p.username;
  this.email = p.email;
  this.x = p.x;
  this.y = p.y;
  this.width = 32;
  this.height = 48;
  this.speed = playerSpeed;
  this.health = p.health;
  this.damage = playerDamage;
  this.keys = p.keys;
  this.healthMax = 100;
  this.score = 0;
  this.sx = 0;
  this.sy = 0;
  this.bulletList = [];
  this.collisionBox = {
    x: this.x,
    y: this.y,
    xMax: this.x + this.width,
    yMax: this.y + this.height,
  };
  this.direction = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  this.lastDirection = "down";
  this.attacking = false;

  this.resetSx = function () {
    if (this.sx >= 96) {
      this.sx = 0;
    }
  };

  this.resetBulletlist = function () {
    if (this.bulletList.length >= 100) {
      this.bulletList.shift();
    }
  };

  this.draw = () => {
    ctx.drawImage(Img.player, this.sx, this.sy, this.width, this.height, this.x, this.y, this.width, this.height);
    for (let i in this.bulletList) {
      this.bulletList[i].move();
      this.bulletList[i].draw();
    }
  };

  this.action = () => {
    if (this.direction.up) {
      this.sy = 144;
      this.sx += this.width;
      this.y -= this.speed;
    }
    if (this.direction.left) {
      this.sy = 48;
      this.sx += this.width;
      this.x -= this.speed;
    }
    if (this.direction.down) {
      this.sy = 0;
      this.sx += this.width;
      this.y += this.speed;
    }
    if (this.direction.right) {
      this.sy = 96;
      this.sx += this.width;
      this.x += this.speed;
    }
    if (this.attacking) {
      let newBullet = new Bullet({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        width: 5,
        height: 5,
        direction: this.lastDirection,
      });

      this.bulletList.push(newBullet);
      newBullet.draw();
    }
    this.resetSx();
  };
};

export default Player;
