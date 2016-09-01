/* RUN */
var debug = false;
var canvas = new Canvas("myCanvas");
var profiles = new Profiles();
var sharedData = {};

var t1 = new Tank();
var t2 = new Tank();
t1.setProfile(1);
t2.setProfile(2);
t1.events();
t2.events();

setInterval(function () {
    canvas.clear();
    if (debug) {
      canvas.drawGrid();
    }
    canvas.drawMap();
    t1.armed();
    t2.armed();
    t1.move();
    t2.move();
}, 50);
