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
    //this.map = [32, 45, 125, 74, 36, 110, 128, 116, 117, 119, 1, 640, 609, 61, 12, 84, 144, 133, 14];
    this.map = {
        "32": {
          type: "ground",
          hp: 1
        },
        "45": {
          type: "concrete",
          hp: 3
        },
        "125": {
          type: "rock",
          hp: 5
        },
        "144": {
          type: "sand",
          hp: 0
        },
        "74": {
          type: "trees",
          hp: 0
        }
    };
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

Canvas.prototype.textureMap = {
  "ground": "brown",
  "concrete": "slategrey",
  "rock": "DimGray",
  "sand": "wheat",
  "trees": "green"
}

Canvas.prototype.drawMap = function () {
  var ctx = this.context;
  var self = this;
  this.mapItems = {};
  for (var sq in this.map) {
      self.mapItems[sq] = this.map[sq];
      sq = sq * 1;
      var preX = (sq % self.cellCols == 0) ? (self.cellCols -1) : (sq % self.cellCols - 1);
      var preY = (sq % self.cellCols == 0) ? (sq / self.cellCols - 1) :  Math.floor(sq / self.cellCols);
      var x = preX * self.cellSize;
      var y = preY * self.cellSize;
      ctx.beginPath();
      ctx.rect(x,y, self.cellSize, self.cellSize);
      ctx.fillStyle = "brown";
      ctx.fillStyle = this.textureMap[this.map[sq].type];
      ctx.fill();
      if (debug) {
        ctx.font = "10px Arial";
        ctx.fillStyle = 'yellow';
        ctx.fillText(sq, x + 5,y + 15);
        ctx.closePath();
      }
  }
};

/*
 * Defines square region(s) on the map which affects the target item
 */
Canvas.prototype.squareLocation = function(x, y, itemSize){
    var self = this;
    var getSq = function(xx, yy){
      var dep = (xx - xx % self.cellSize) / self.cellSize + 1;
      var sq = (((yy - yy % self.cellSize) / self.cellSize + 1) * self.cellCols) - (self.cellCols - dep);
      return sq;
    }
    // set of squares that item may cover/affect
    var sqArr = [
      getSq(x, y), // left top
      getSq(x + (itemSize - 1), y), // right top
      getSq(x, y + (itemSize - 1)), // left bottom
      getSq(x + (itemSize - 1), y + (itemSize - 1)), // right bottom
      getSq(x + Math.floor((itemSize - 1)/2), y), // top
      getSq(x, y + Math.floor((itemSize - 1)/2)), // left
      getSq(x + (itemSize - 1), y + Math.floor((itemSize - 1)/2)), // right
      getSq(x + Math.floor((itemSize - 1)/2), y + (itemSize - 1)) // bottom
    ];

    sqUniq = [];
    var sqUniq = sqArr.filter(function(value, index, self){
      return self.indexOf(value) === index;
    });
    return sqUniq;
};

Canvas.prototype.collisionDetection = function(x, y, itemSize, byArmor) {
    var sqs = this.squareLocation(x, y, itemSize);
    var collision = false;
    for (var i=0; i < sqs.length; i++) {
      if (typeof this.mapItems[sqs[i]] !== "undefined") {
        if (byArmor) {
          this.map[sqs[i]].hp--;
          console.log("I got shot!: " + sqs[i])
          if (this.map[sqs[i]].hp <= 0) {
            delete this.map[sqs[i]];
          }
          collision = true;
        } else {
          collision = this.map[sqs[i]].type != "trees";
        }
        break;
      }
    }
    return collision;
}
