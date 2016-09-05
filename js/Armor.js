/* Armor */

function Armor(parent, x, y, id) {
  this.radius = 5;
  this.counter = 0;
  this.x = x;
  this.y = y;
  this.parent = parent;
  this.dir = parent.moveDir;
  this.color = parent.color;
  this.id = id;

  this.set();
}

Armor.prototype.set = function () {
  switch(this.dir) {
    case "up": this.y += 5; break;
    case "down": this.y -= 5; break;
    case "left": this.x += 5; break;
    default: this.x -= 5; // right
  }
}

Armor.prototype.release = function () {
  if (this.checkCollision()) {
    return;
  }
  switch(this.dir) {
    case "up": this.y -= 10; break;
    case "down": this.y += 10; break;
    case "left": this.x -= 10; break;
    default: this.x += 10; // right
  }
  this.draw();
}

Armor.prototype.armorCollision = function(ownX, ownY) {

    var collision = false;
    if (!tanks["t" + this.parent.alienId]) {
      return collision;
    }

    for (var armId in tanks["t" + this.parent.alienId].armorActivity) {
      var x = tanks["t" + this.parent.alienId].armorActivity[armId].x;
      var y = tanks["t" + this.parent.alienId].armorActivity[armId].y;
      if (
          (y <= (ownY + this.radius) && (y + this.radius) >= ownY)
            &&
          (x <= (ownX + this.radius) && (x + this.radius) >= ownX)
        ) {
          delete tanks["t" + this.parent.alienId].armorActivity[armId];
          collision = true;
          this.drawFlash(x, y, "orange");
      }
    }

    return collision;
}

Armor.prototype.checkCollision = function () {
  if (this.armorCollision(this.x, this.y)) {
    delete this.parent.armorActivity[this.id];
    return true;
  }
  if (this.parent.tanksCollision(this.x, this.y, this.radius)) {
    this.drawFlash(this.x, this.y, "black");
    sharedData[this.parent.alienId].damage++;
    logStat("Tank '" + tanks["t" + this.parent.alienId].color + "' got damage " + sharedData[this.parent.alienId].damage + " of 3")
    if (sharedData[this.parent.alienId].damage >= 3) {

      tanks["t" + this.parent.alienId] = null;
      delete sharedData[this.parent.alienId];
      delete tanks["t" + this.parent.alienId];
      game.stop();
    }
    delete this.parent.armorActivity[this.id];
    return true;
  }
  if (canvas.collisionDetection(this.x, this.y, 0, true)) {
    delete this.parent.armorActivity[this.id];
    return true;
  }
  if (
      (this.dir == "right" && this.x > canvas.width - this.radius)
      || (this.dir == "left" &&  this.x < this.radius)
      || (this.dir == "up" && this.y < this.radius)
      || (this.dir == "down" && this.y > canvas.height - this.radius)
    ) {
      console.log("END OF MAP");
      delete this.parent.armorActivity[this.id];
      return true;
  }
  return false;
}

Armor.prototype.draw = function () {
  canvas.context.beginPath();
  canvas.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  canvas.context.fillStyle = this.color;
  canvas.context.fill();
  canvas.context.closePath();
}

Armor.prototype.drawFlash = function (x, y, color) {
  canvas.context.beginPath();
  canvas.context.arc(x, y, 15, 0, 2 * Math.PI, false);
  canvas.context.fillStyle = color;
  canvas.context.fill();
  canvas.context.closePath();
}
