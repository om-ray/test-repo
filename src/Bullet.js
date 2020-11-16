let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let bulletSpeed = 10;
let width = 1;
let height = 1;

let Bullet = function (props) {
  let p = props;
  this.x = p.x;
  this.y = p.y;
  this.width = width;
  this.height = height;
  this.speed = bulletSpeed;
  this.direction = p.direction;
  this.shooter = p.shooter;
  this.substitute = p.substitute;
  this.color = "red";
  this.collisionBox = {
    x: this.x,
    y: this.y,
    xMax: this.x + this.width,
    yMax: this.y + this.height,
  };

  this.draw = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  this.move = function () {
    if (this.direction === "up") {
      this.y -= this.speed;
    }
    if (this.direction === "left") {
      this.x -= this.speed;
    }
    if (this.direction === "down") {
      this.y += this.speed;
    }
    if (this.direction === "right") {
      this.x += this.speed;
    }
    this.update();
  };

  this.setValues = function (x, y, substitute) {
    this.x = x;
    this.y = y;
    this.substitute = substitute;
    // console.log(`x: ${x}, y: ${y}`);
  };

  this.update = function () {
    this.collisionBox = {
      x: this.x,
      y: this.y,
      xMax: this.x + this.width,
      yMax: this.y + this.height,
    };
  };
};

export default Bullet;
