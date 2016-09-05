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
    logStat("Game Started!")
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
    setTimeout(function(){
      clearInterval(game.mainLoop);
      logStat("Game Over! (press F5)")
    }, 500);
  }
}
