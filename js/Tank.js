/* Tank */

function Tank() {
    this.ctx = canvas.context;
    this.step = canvas.step;
    this.rightPressed = false;
    this.leftPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.movement = false;
    this.armorActivity = {};
}

Tank.prototype.setProfile = function (profile) {
    var p = profiles.get[profile];
    this.keys = p.keys;
    this.z = p.size;
    this.x = p.startX;
    this.y = p.startY;
    this.moveDir = p.moveDir;
    this.id = profile;
    this.color = p.color;
    shareLocation[this.id] = {x: this.x, y: this.y};
    this.img = document.getElementById(p.skin);
};

Tank.prototype.draw = function () {
  canvas.context.beginPath();
  canvas.context.rect(this.x,this.y, this.z, this.z);
  //canvas.context.strokeStyle = this.color;
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
        } else if (e.keyCode == self.keys.fire) {
          self.fired = true;
          //console.log("Tank " + self.id + " loaded!")
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

Tank.prototype.collisionDetection = function(x, y, byArmor) {
    var sqs = this.squareLocation(x, y);
    var collision = false;
    for (var i=0; i < sqs.length; i++) {
      if (typeof canvas.mapItems[sqs[i]] !== "undefined") {
        if (byArmor) {
          console.log("I got shot!: " + sqs[i])
          canvas.map.splice(canvas.map.indexOf(sqs[i]), 1)
        }
        collision = true;
        break;
      }
    }
    return collision;
}

Tank.prototype.tanksCollision = function(ownX, ownY, mySize, alianSize) {

    var collision = false;
    var mySize = mySize || (this.z);
    var alianSize = alianSize || (this.z);
    var slIndex = this.id == 1 ? 2 : 1;
    var x = shareLocation[slIndex].x;
    var y = shareLocation[slIndex].y;
    if (
        (y <= (ownY + mySize) && (y + alianSize) >= ownY)
          &&
        (x <= (ownX + mySize) && (x + alianSize) >= ownX)
      ) {
        collision = true;
    }
    return collision;
}

Tank.prototype.move = function () {
    if (this.rightPressed && this.x < canvas.width - this.z) {
        if(!this.tanksCollision(this.x + this.step, this.y) && !this.collisionDetection(this.x + this.step, this.y)) {
            this.x += this.step;
        }
    } else if (this.leftPressed && this.x > 0) {
        if(!this.tanksCollision(this.x - this.step, this.y) && !this.collisionDetection(this.x - this.step, this.y)) {
            this.x -= this.step;
        }
    } else if (this.upPressed && this.y > 0) {
        if(!this.tanksCollision(this.x, this.y - this.step) && !this.collisionDetection(this.x, this.y - this.step)) {
            this.y -= this.step;
        }
    } else if (this.downPressed && this.y < canvas.height - this.z) {
        if(!this.tanksCollision(this.x, this.y + this.step) && !this.collisionDetection(this.x, this.y + this.step)) {
            this.y += this.step;
        }
    }
    shareLocation[this.id] = {x: this.x, y: this.y};
    this.draw(this.x, this.y);
    return this;
};
Tank.prototype.armed = function () {
  for (var act in this.armorActivity) {
    this.armorActivity[act].release();
  }
  if (this.fired) {
    this.fired = false;
    this.fire();
  }

  return this;
}

Tank.prototype.fire = function () {

  //console.log("Tank " + this.id + " fired! (from " + this.moveDir + ")")
  var centerX, centerY;
  switch(this.moveDir) {
    case "up":
        centerX = this.x + this.z / 2;
        centerY = this.y;
        break;
    case "down":
      centerX = this.x + this.z / 2;
      centerY = this.y + this.z;
      break;
    case "left":
      centerX = this.x;
      centerY = this.y + this.z / 2;
      break;
    default: // right
      centerX = this.x + this.z;
      centerY = this.y + this.z / 2;
  }
  var ts = new Date * 1;
  this.armorActivity[ts] = new Armor(this, centerX, centerY, ts);

}
