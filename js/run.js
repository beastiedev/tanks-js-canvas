/* RUN */
var debug = false;
var tanks = {};
var canvas = new Canvas("myCanvas");
var profiles = new Profiles();
var sharedData = {};
var game = new Game();

function Game() {
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

(function factory() {
  for (var proto in profiles.get) {
    console.log(profiles.get[proto])
    var t = new Tank();
    t.setProfile(proto).events();
    tanks["t" + proto] = t;
  }
})()

game.start();
