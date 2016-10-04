/* Sound */

function Sound(type) {
    this.type = type;
    this.el = document.createElement("audio");
    this.create();
}
Sound.prototype.create = function() {
    var self = this;
    this.el.src = "sounds/" + this.type + ".ogg";
    this.el.id = this.type + "_" + (new Date()).getTime();
    this.el.addEventListener("ended", function(data) {
        //console.log(self.el.id + " is played")
    }, false);
    return this;
}

Sound.prototype.play = function() {
    this.el.play();
}

Sound.prototype.stop = function() {
    this.el.pause();
}
