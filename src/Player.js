import Bullet from "./Bullet";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let playerSpeed = 2;
let playerDamage = 1;
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

Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

let sprites = [Male1, Male2, Female1, Female2];

let Player = function (props) {
  let p = props;
  this.id = Math.floor(Math.random() * 1000000);
  this.sprite = sprites[0]();
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
  this.type = p.type;
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

  this.draw = () => {
    ctx.drawImage(Img.player, this.sx, this.sy, this.width, this.height, this.x, this.y, this.width, this.height);
    for (let i in this.bulletList) {
      this.bulletList[i].move();
      this.bulletList[i].draw();
    }
  };

  this.delete = () => {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  };

  this.resetSx = function () {
    if (this.sx >= 96) {
      this.sx = 0;
    }
  };

  if (this.type == "main") {
    this.resetBulletlist = function () {
      if (this.bulletList.length >= 100) {
        this.bulletList.splice(0, 1);
      }
    };

    this.drawAccesories = function () {
      let healthBar = new HealthBar({
        x: this.x - 15,
        y: this.y + 5,
        width: 15,
        value: this.health,
        thickness: 2,
      });

      let score = new Score({
        x: this.x,
        y: this.y + 35,
        value: this.score,
      });

      let usernameLabel = new UsernameLabel({
        x: this.x + 5,
        y: this.y,
        value: this.username,
      });

      healthBar.draw();
      score.draw();
      usernameLabel.draw();
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
          width: 2,
          height: 2,
          direction: this.lastDirection,
          shooter: this.id,
        });

        this.bulletList.push(newBullet);
        newBullet.draw();
      }
      this.resetSx();
      this.drawAccesories();
      this.resetBulletlist();
      this.update();
    };
  }

  this.update = function () {
    this.collisionBox = {
      x: this.x,
      y: this.y,
      xMax: this.x + this.width,
      yMax: this.y + this.height,
    };
    if (this.health <= 0) {
      this.health = this.healthMax;
      this.x = Math.floor(Math.random() * canvas.width);
      this.y = Math.floor(Math.random() * canvas.height);
    }
  };
};

let HealthBar = function (props) {
  let p = props;
  this.x = p.x;
  this.y = p.y;
  this.width = p.width;
  this.radius = this.width;
  this.value = p.value;
  this.thickness = p.thickness;

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, -Math.PI / 2, Math.radians(this.value * 3.6) - Math.PI / 2, false);
    ctx.arc(this.x, this.y, this.radius - this.thickness, Math.radians(this.value * 3.6) - Math.PI / 2, -Math.PI / 2, true);
    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
    ctx.font = "10px courier";
    ctx.textAlign = "left";
    ctx.fillText(this.value, this.x - 9, this.y + 3);

    if (this.value >= 75) {
      ctx.fillStyle = "green";
    } else if (this.value >= 50) {
      ctx.fillStyle = "gold";
    } else if (this.value >= 25) {
      ctx.fillStyle = "orange";
    } else {
      ctx.fillStyle = "red";
    }
    ctx.closePath();
    ctx.fill();
  };
};

let Score = function (props) {
  let p = props;
  this.x = p.x;
  this.y = p.y;
  this.value = p.value;

  this.draw = function () {
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.font = "15px courier";
    ctx.fillText(this.value, this.x, this.y);
  };
};

let UsernameLabel = function (props) {
  let p = props;
  this.x = p.x;
  this.y = p.y;
  this.value = p.value;

  this.draw = function () {
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.font = "15px courier";
    ctx.fillText(this.value, this.x, this.y);
  };
};

export default Player;
