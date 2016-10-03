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
    this.skinOriginSize = 50;
}

Tank.prototype.setProfile = function (profileId) {
    var p = profile.get[profileId];
    this.keys = p.keys;
    this.z = p.size;
    this.x = p.startX;
    this.y = p.startY;
    this.moveDir = p.moveDir;
    this.id = profileId;
    this.alienId = (this.id == 1) ? 2 : 1;
    this.color = p.color;
    sharedData[this.id] = {
      location:{x: this.x, y: this.y},
      damage: 0
    };
    this.img = document.getElementById(p.skin);
    return this;
};

Tank.prototype.draw = function () {
  /*if (sharedData[this.id].damage >= 3) {
    return;
  }*/
  canvas.context.beginPath();
  canvas.context.rect(this.x,this.y, this.z, this.z);
  if (debug) {
    canvas.context.strokeStyle = this.color;
    canvas.context.stroke();
  } else {
    this.turn(this.x, this.y);
  }
  canvas.context.closePath();
};

Tank.prototype.events = function () {

    var self = this;

    function clearMovementKeys() {
      self.rightPressed = false;
      self.leftPressed = false;
      self.upPressed = false;
      self.downPressed = false;
    }

    function keyDownHandler(e) {
        if (e.keyCode == self.keys.right) { // right
            clearMovementKeys();
            self.moveDir = "right";
            self.rightPressed = true;
            self.movement = true;

        } else if (e.keyCode == self.keys.left) { // left
            clearMovementKeys();
            self.moveDir = "left";
            self.leftPressed = true;
            self.movement = true;

        } else if (e.keyCode == self.keys.up) { // up
            clearMovementKeys();
            self.moveDir = "up";
            self.upPressed = true;
            self.movement = true;

        } else if (e.keyCode == self.keys.down) { // down
            clearMovementKeys();
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
    return this;
};

Tank.prototype.turn = function (x, y) {
    var z = this.z;
    var s = this.skinOriginSize;
    switch (this.moveDir) {
        case "up":
            return this.ctx.drawImage(this.img, 0, 0, s, s, x, y, z, z);
        case "down":
            return this.ctx.drawImage(this.img, s, 0, s, s, x, y, z, z);
        case "left":
            return this.ctx.drawImage(this.img, 0, s, s, s, x, y, z, z);
        default: // right
            return this.ctx.drawImage(this.img, s, s, s, s, x, y, z, z);
    }
};

Tank.prototype.tanksCollision = function(ownX, ownY, mySize, alianSize) {

    var collision = false;
    if (!sharedData[this.alienId]) {
      return collision;
    }
    var mySize = mySize || (this.z);
    var alianSize = alianSize || (this.z);
    var x = sharedData[this.alienId].location.x;
    var y = sharedData[this.alienId].location.y;
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
    sharedData[this.id].location = {x: this.x, y: this.y};
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

Tank.prototype.destroy = function(){

}
