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
    this.lastShotTS = 0;
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
        if(!this.tanksCollision(this.x + this.step, this.y) && !canvas.collisionDetection(this.x + this.step, this.y, this.z)) {
            this.x += this.step;
        }
    } else if (this.leftPressed && this.x > 0) {
        if(!this.tanksCollision(this.x - this.step, this.y) && !canvas.collisionDetection(this.x - this.step, this.y, this.z)) {
            this.x -= this.step;
        }
    } else if (this.upPressed && this.y > 0) {
        if(!this.tanksCollision(this.x, this.y - this.step) && !canvas.collisionDetection(this.x, this.y - this.step, this.z)) {
            this.y -= this.step;
        }
    } else if (this.downPressed && this.y < canvas.height - this.z) {
        if(!this.tanksCollision(this.x, this.y + this.step) && !canvas.collisionDetection(this.x, this.y + this.step, this.z)) {
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
  if (this.lastShotTS + 500 <= ts) {
    this.armorActivity[ts] = new Armor(this, centerX, centerY, ts);
    this.lastShotTS = ts;
  }

}