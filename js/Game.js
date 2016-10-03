/* Game */

function Game() {
  this.init = function(){
    this.countdown();
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
          tanks[t].armed().move();
        }
    }, 50);
  };

  this.stop = function(){
    setTimeout(function(){
      clearInterval(game.mainLoop);
      logStat("Game Over! (press F5)")
    }, 500);
  };

  this.countdown = function(){
    var i = 3;
    var fontSize = 50;
    var drawCountdown = function(){
      if (i < 0) {
        clearInterval(countdown);
        game.start();
      } else {
          canvas.clear();
          // @todo need to be refactored
          for (var proto in profile.get) {
            var t = new Tank();
            t.setProfile(proto).events().move();
            tanks["t" + proto] = t;
          }
          canvas.drawMap();
          canvas.context.beginPath();
          canvas.context.font = fontSize / i*0.75 +"px Arial";
          canvas.context.fillStyle = "navy";
          var text = (i == 0) ? "GO! GO! GO!" : "Game will start in " + i + " second" + (i > 1 ? "s" : "");
          canvas.context.fillText(text, (canvas.width - canvas.context.measureText(text).width) / 2, canvas.height/2);
          canvas.context.closePath();
        i--;
      }
    };

    var countdown = setInterval(drawCountdown, 1000);
  };
}
