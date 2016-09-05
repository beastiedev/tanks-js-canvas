/* RUN */
var debug = false;

var tanks = {};
var sharedData = {};

var canvas = new Canvas("myCanvas");
var profile = new Profile();

var game = new Game();

game.init().start();
