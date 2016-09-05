/* Game */

function Game() {
  this.init = function(){
    for (var proto in profile.get) {
      var t = new Tank();
      t.setProfile(proto).events();
      tanks["t" + proto] = t;
    }
    return this;
  };
  this.start = function(){
    this.mainLoop = setInterval(function () {
        canvas.clear();
        if (debug) {
          canvas.drawGrid();
        }
        canvas.drawMap();
        for (var t in tanks) {
          tanks[t].armed();
          tanks[t].move();
        }
    }, 50);
  };
  this.stop = function(){
    console.log("Game Over!");
    setTimeout(function(){
      clearInterval(game.mainLoop);
    }, 500);
  }
}
