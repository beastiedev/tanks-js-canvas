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
Armor.prototype.checkCollision = function () {
  if (this.parent.tanksCollision(this.x, this.y, this.radius)) {
    sharedData[this.parent.alienId].damage++;
    if (sharedData[this.parent.alienId].damage >= 3) {

      tanks["t" + this.parent.alienId] = null;
      delete sharedData[this.parent.alienId];
      delete tanks["t" + this.parent.alienId];
      game.stop();
    }
    delete this.parent.armorActivity[this.id];
    return true;
  }
  if (canvas.collisionDetection(this.x, this.y, this.radius, true)) {
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
