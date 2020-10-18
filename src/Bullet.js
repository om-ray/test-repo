let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let bulletSpeed = 5;

let Bullet = function (props) {
  let p = props;
  this.x = p.x;
  this.y = p.y;
  this.width = p.width;
  this.height = p.height;
  this.speed = bulletSpeed;
  this.direction = p.direction;
  this.collisionBox = {
    x: this.x,
    y: this.y,
    xMax: this.x + this.width,
    yMax: this.y + this.height,
  };

  this.draw = function () {
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
  };
};

export default Bullet;
