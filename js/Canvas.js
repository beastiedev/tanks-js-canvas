/* Canvas */
function Canvas(id) {
    var body = document.body,
            html = document.documentElement;
    this.canvasEl = document.getElementById(id);
    this.context = this.canvasEl.getContext("2d");
    //var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - 100;
    //var width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth) - 100;
    var height = 500;
    var width = 800;
    this.step = 5;
    this.cellSize = 25;

    this.height = height - height % this.cellSize;
    this.width = width - width % this.cellSize;
    this.context.canvas.height = this.height;
    this.context.canvas.width = this.width;

    this.cellCols = this.width / this.cellSize;
    this.cellRows = this.height / this.cellSize;
    this.map = [32, 33, 45, 125, 74, 36, 110, 116, 117, 119, 1, 61, 12, 84, 144, 133, 14];
}

Canvas.prototype.drawGrid = function () {
    var self = this;
    this.bricks = [];
    var index = 1;
    for (var r = 0; r < this.cellRows; r++) {
        for (var c = 0; c < this.cellCols; c++) {
            var brickX = (c * (self.cellSize));
            var brickY = (r * (self.cellSize));
            self.bricks["" + index] = {x: brickX, y: brickY, status: 1};
            self.context.beginPath();
            self.context.rect(brickX, brickY, self.cellSize, self.cellSize);
            self.context.strokeStyle = "white";
            self.context.stroke();
            self.context.font = "10px Arial";
            self.context.fillStyle = "grey";
            self.context.fillText("" + index,brickX + 5,brickY + 15);
            self.context.closePath();
            index++;
        }
    }
};

Canvas.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

Canvas.prototype.drawMap = function () {
  var ctx = this.context;
  var self = this;
  this.mapItems = {};
  this.map.forEach(function(sq){
      self.mapItems[sq] = {};
      sq = sq * 1;
      var preX = (sq % self.cellCols == 0) ? (self.cellCols -1) : (sq % self.cellCols - 1);
      var preY = (sq % self.cellRows == 0) ? (sq / self.cellRows - 1) :  Math.floor(sq / self.cellCols);
      var x = preX * self.cellSize;
      var y = preY * self.cellSize;
      ctx.beginPath();
      ctx.rect(x,y, self.cellSize, self.cellSize);
      ctx.fillStyle = "brown";
      ctx.fill();
      //ctx.strokeStyle = "red";
      //ctx.stroke();
      //ctx.font = "10px Arial";
      //ctx.fillStyle = 'yellow';
      //ctx.fillText(sq, x + 5,y + 15);
      ctx.closePath();
  });
};
