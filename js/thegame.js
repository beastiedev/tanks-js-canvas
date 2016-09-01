
/* Canvas */
function Canvas(id) {
    var body = document.body,
            html = document.documentElement;
    this.canvasEl = document.getElementById(id);
    this.context = this.canvasEl.getContext("2d");
    //var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - 100;
    //var width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth) - 100;
    var height = 500;
    var width = 800;
    this.step = 5;
    this.cellSize = 25;

    this.height = height - height % this.cellSize;
    this.width = width - width % this.cellSize;
    this.context.canvas.height = this.height;
    this.context.canvas.width = this.width;

    this.cellCols = this.width / this.cellSize;
    this.cellRows = this.height / this.cellSize;
}

Canvas.prototype.drawGrid = function () {
    var self = this;
    this.bricks = [];
    var index = 1;
    for (var r = 0; r < this.cellRows; r++) {
        for (var c = 0; c < this.cellCols; c++) {
            var brickX = (c * (self.cellSize));
            var brickY = (r * (self.cellSize));
            self.bricks["" + index] = {x: brickX, y: brickY, status: 1};
            self.context.beginPath();
            self.context.rect(brickX, brickY, self.cellSize, self.cellSize);
            self.context.strokeStyle = "white";
            self.context.stroke();
            self.context.font = "10px Arial";
            self.context.fillStyle = "grey";
            self.context.fillText("" + index,brickX + 5,brickY + 15);
            self.context.closePath();
            index++;
        }
    }
};

Canvas.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

Canvas.prototype.map = function () {
  var ctx = this.context;
  var self = this;
  var preDefBricks = [32, 33, 45, 125, 74, 36, 110, 116, 117, 119, 1, 61, 12, 84, 144, 133, 14];
  this.mapItems = {};
  preDefBricks.forEach(function(sq){
      self.mapItems[sq] = {};
      sq = sq * 1;
      var preX = (sq % self.cellCols == 0) ? (self.cellCols -1) : (sq % self.cellCols - 1);
      var preY = (sq % self.cellRows == 0) ? (sq / self.cellRows - 1) :  Math.floor(sq / self.cellCols);
      var x = preX * self.cellSize;
      var y = preY * self.cellSize;
      ctx.beginPath();
      ctx.rect(x,y, self.cellSize, self.cellSize);
      ctx.fillStyle = "brown";
      ctx.fill();
      //ctx.strokeStyle = "red";
      //ctx.stroke();
      //ctx.font = "10px Arial";
      //ctx.fillStyle = 'yellow';
      //ctx.fillText(sq, x + 5,y + 15);
      ctx.closePath();
  });
};


/* profiles */

function Profiles() {
    this.get = {
        2: {
            size: 50,
            keys: {up: 38, down: 40, right: 39, left: 37},
            startX: canvas.width - 50,
            startY: canvas.height / 2 - 50 / 2,
            moveDir: "left",
            skin: "tank4_blue"
        },
        1: {
            size: 50,
            keys: {up: 87, down: 83, right: 68, left: 65},
            startX: 0,
            startY: canvas.height / 2 - 50 / 2,
            moveDir: "right",
            skin: "tank4_red"
        }
    }
}

/* Tank */

function Tank() {
    this.ctx = canvas.context;
    this.step = canvas.step;
    this.rightPressed = false;
    this.leftPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    self.movement = false;
}

Tank.prototype.setProfile = function (profile) {
    var p = profiles.get[profile];
    this.keys = p.keys;
    this.z = p.size;
    this.x = p.startX;
    this.y = p.startY;
    this.moveDir = p.moveDir;
    this.id = profile;
    shareLocation[this.id] = {x: this.x, y: this.y};
    this.img = document.getElementById(p.skin);
};

Tank.prototype.draw = function () {
  canvas.context.beginPath();
  canvas.context.rect(this.x,this.y, this.z, this.z);
  //canvas.context.strokeStyle = 'blue'
  //canvas.context.stroke();
  this.turn(this.x, this.y);
  canvas.context.closePath();
};

Tank.prototype.events = function () {

    var self = this;

    function keyDownHandler(e) {
        if (e.keyCode == self.keys.right) { // right
            self.moveDir = "right";
            self.rightPressed = true;
            self.movement = true;

        } else if (e.keyCode == self.keys.left) { // left
            self.moveDir = "left";
            self.leftPressed = true;
            self.movement = true;

        } else if (e.keyCode == self.keys.up) { // up
            self.moveDir = "up";
            self.upPressed = true;
            self.movement = true;

        } else if (e.keyCode == self.keys.down) { // down
            self.moveDir = "down";
            self.downPressed = true;
            self.movement = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == self.keys.right) { // right
            self.movement = false;
            self.rightPressed = false;
        } else if (e.keyCode == self.keys.left) { // left
          self.movement = false;
            self.leftPressed = false;
        } else if (e.keyCode == self.keys.up) { // up
          self.movement = false;
            self.upPressed = false;
        } else if (e.keyCode == self.keys.down) { // down
          self.movement = false;
            self.downPressed = false;
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
};

Tank.prototype.turn = function (x, y) {
    var z = this.z;
    switch (this.moveDir) {
        case "up":
            return this.ctx.drawImage(this.img, 0, 0, z, z, x, y, z, z);
        case "down":
            return this.ctx.drawImage(this.img, z, 0, z, z, x, y, z, z);
        case "left":
            return this.ctx.drawImage(this.img, 0, z, z, z, x, y, z, z);
        default: // right
            return this.ctx.drawImage(this.img, z, z, z, z, x, y, z, z);
    }
};

Tank.prototype.squareLocation = function(x, y){
    var getSq = function(xx, yy){
      var dep = (xx - xx % canvas.cellSize) / canvas.cellSize + 1;
      var sq = (((yy - yy % canvas.cellSize) / canvas.cellSize + 1) * canvas.cellCols) - (canvas.cellCols - dep);
      return sq;
    }
    var sqArr = [
      getSq(x, y), // left top
      getSq(x + (this.z - 1), y), // right top
      getSq(x, y + (this.z - 1)), // left bottom
      getSq(x + (this.z - 1), y + (this.z - 1)), // right bottom
      getSq(x + Math.floor((this.z - 1)/2), y), // top
      getSq(x, y + Math.floor((this.z - 1)/2)), // left
      getSq(x + (this.z - 1), y + Math.floor((this.z - 1)/2)), // right
      getSq(x + Math.floor((this.z - 1)/2), y + (this.z - 1)) // bottom
    ];

    sqUniq = [];
    var sqUniq = sqArr.filter(function(value, index, self){
      return self.indexOf(value) === index;
    });
    return sqUniq;
};

Tank.prototype.collisionDetection = function(x, y) {
    var sqs = this.squareLocation(x, y);
    var collision = false;
    for (var i=0; i < sqs.length; i++) {
      if (typeof canvas.mapItems[sqs[i]] !== "undefined") {
        collision = true;
        break;
      }
    }
    return collision;
}

Tank.prototype.tanksCollision = function(ownX, ownY) {

    var collision = false;
    var alienX1, alienX2, alienX3, alienX4, alienY1, alienY2, alienY3, alienY4;
    var ownX1, ownX2, ownX3, ownX4, ownY1, ownY2, ownY3, ownY4;

    var slIndex = this.id == 1 ? 2 : 1;
    var x = shareLocation[slIndex].x;
    var y = shareLocation[slIndex].y;

    alienX1 = alienX3 = x;
    alienX2 = alienX4 = x + (this.z - 1);
    alienY1 = alienY2 = y;
    alienY3 = alienY4 = y + (this.z - 1);

    ownX1 = ownX3 = ownX;
    ownX2 = ownX4 = ownX + (this.z - 1);
    ownY1 = ownY2 = ownY;
    ownY3 = ownY4 = ownY + (this.z - 1);

    // 1
    if ((alienY1 <= ownY3 && alienY1 >= ownY1) && (
            (alienX1 < ownX3 && alienX2 > ownX3) ||
            (alienX1 > ownX3 && alienX2 < ownX4) ||
            (alienX1 < ownX4 && alienX2 > ownX4)
            )) {
        collision = true;
    }

    // 2
    if ((alienY3 >= ownY1 && alienY3 <= ownY3) && (
            (alienX3 < ownX1 && alienX3 > ownX1) ||
            (alienX3 > ownX1 && alienX4 < ownX2) ||
            (alienX3 < ownX2 && alienX4 > ownX2)
            )) {
        collision = true;
    }

    // 3
    if ((alienX1 <= ownX2 && alienX1 >= ownX1) && (
            (alienY1 < ownY2 && alienY3 > ownY2) ||
            (alienY1 > ownY2 && alienY3 < ownY4) ||
            (alienY1 < ownY2 && alienY3 > ownY4)
            )) {
        collision = true;
    }

    // 4
    if ((alienX2 >= ownX1 && alienX2 <= ownX2) && (
            (alienY2 < ownY1 && alienY4 > ownY1) ||
            (alienY2 > ownY1 && alienY4 < ownY3) ||
            (alienY2 < ownY2 && alienY4 > ownY3)
            )) {
        collision = true;
    }

    return collision;
}

Tank.prototype.move = function () {
    if (this.rightPressed && this.x < canvas.width - this.z) {
        if(!this.collisionDetection(this.x + this.step, this.y) && !this.tanksCollision(this.x + this.step, this.y)) {
            this.x += this.step;
        } else {
          //this.x -= this.step;
        }
    } else if (this.leftPressed && this.x > 0) {
        if(!this.collisionDetection(this.x - this.step, this.y) && !this.tanksCollision(this.x - this.step, this.y)) {
            this.x -= this.step;
        } else {
          //this.x += this.step;
        }
    } else if (this.upPressed && this.y > 0) {
        if(!this.collisionDetection(this.x, this.y - this.step) && !this.tanksCollision(this.x, this.y - this.step)) {
            this.y -= this.step;
        } else {
          //this.y += this.step;
        }
    } else if (this.downPressed && this.y < canvas.height - this.z) {
        if(!this.collisionDetection(this.x, this.y + this.step) && !this.tanksCollision(this.x, this.y + this.step)) {
            this.y += this.step;
        } else {
          //this.y -= this.step;
        }
    }
    shareLocation[this.id] = {x: this.x, y: this.y};
    this.draw(this.x, this.y);
};


/* RUN */

var canvas = new Canvas("myCanvas");
var profiles = new Profiles();
var shareLocation = {};

var t1 = new Tank();
t1.setProfile(2);
t1.events();

var t2 = new Tank();
t2.setProfile(1);
t2.events();

setInterval(function () {
    canvas.clear();
    //canvas.drawGrid();
    canvas.map();
    t1.move();
    t2.move();
}, 50);
