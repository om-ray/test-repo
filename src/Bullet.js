let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let bulletSpeed = 10;
let width = 2;
let height = 2;

let Bullet = function (props) {
  let p = props;
  this.x = p.x;
  this.y = p.y;
  this.id = Math.floor(Math.random() * 1000);
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

  let label = new UsernameLabel({
    x: this.x + 10,
    y: this.y,
    value: this.id,
  });

  this.draw = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // label.draw();
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

  this.erase = function () {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  };

  this.setValues = function (x, y, substitute, id, direction) {
    this.x = x;
    this.y = y;
    this.substitute = substitute;
    this.id = id;
    this.direction = direction;
    // console.log(`x: ${x}, y: ${y}`);
  };

  this.update = function () {
    this.collisionBox = {
      x: this.x,
      y: this.y,
      xMax: this.x + this.width,
      yMax: this.y + this.height,
    };
    label.x = this.x;
    label.y = this.y;
  };
};

let UsernameLabel = function (props) {
  let p = props;
  this.x = p.x;
  this.y = p.y;
  this.value = p.value;

  this.draw = function () {
    ctx.textAlign = "left";
    ctx.font = "15px courier";
    ctx.fillStyle = "red";
    ctx.fillText(this.value, this.x, this.y);
  };
};

export default Bullet;
