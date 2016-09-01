if ((alienY1 <= ownY3 && alienY1 >= ownY1) && (
        (alienX1 < ownX3 && alienX2 > ownX3) ||
        (alienX1 > ownX3 && alienX2 < ownX4) ||
        (alienX1 < ownX4 && alienX2 > ownX4)
        )) {
  console.log("case 1")
    collision = true;
}

// 2
if ((alienY3 >= ownY1 && alienY3 <= ownY3) && (
        (alienX3 < ownX1 && alienX3 > ownX1) ||
        (alienX3 > ownX1 && alienX4 < ownX2) ||
        (alienX3 < ownX2 && alienX4 > ownX2)
        )) {
  console.log("case 2")
    collision = true;
}

// 3
if ((alienX1 <= ownX2 && alienX1 >= ownX1) && (
        (alienY1 < ownY2 && alienY3 > ownY2) ||
        (alienY1 > ownY2 && alienY3 < ownY4) ||
        (alienY1 < ownY2 && alienY3 > ownY4)
        )) {
  console.log("case 3")
    collision = true;
}

// 4
if ((alienX2 >= ownX1 && alienX2 <= ownX2) && (
        (alienY2 < ownY1 && alienY4 > ownY1) ||
        (alienY2 > ownY1 && alienY4 < ownY3) ||
        (alienY2 < ownY2 && alienY4 > ownY3)
        )) {
  console.log("case 4")
    collision = true;
}


function tanksCollision(x, y) {

    var collision = false;
    var bx1, bx2, bx3, bx4, by1, by2, by3, by4;
    var X1, X2, X3, X4, Y1, Y2, Y3, Y4;
    bx1 = b.x;
    bx2 = b.x + brickWidth;
    bx3 = b.x;
    bx4 = b.x + brickWidth;
    by1 = b.y;
    by2 = b.y;
    by3 = b.y + brickHeight;
    by4 = b.y + brickHeight;
    X1 = x;
    X2 = x + 50;
    X3 = x;
    X4 = x + 50;
    Y1 = y;
    Y2 = y;
    Y3 = y + 50;
    Y4 = y + 50;

    // 1
    if ((by1 <= Y3 && by1 >= Y1) && (
            (bx1 < X3 && bx2 > X3) ||
            (bx1 > X3 && bx2 < X4) ||
            (bx1 < X4 && bx2 > X4)
            )) {
        console.log("colission: top");
        collision = true;
    }

    // 2
    if ((by3 >= Y1 && by3 <= Y3) && (
            (bx3 < X1 && bx3 > X1) ||
            (bx3 > X1 && bx4 < X2) ||
            (bx3 < X2 && bx4 > X2)
            )) {
        console.log("colission: bottom");
        collision = true;
    }

    // 3
    if ((bx1 <= X2 && bx1 >= X1) && (
            (by1 < Y2 && by3 > Y2) ||
            (by1 > Y2 && by3 < Y4) ||
            (by1 < Y2 && by3 > Y4)
            )) {
        console.log("colission: left");
        collision = true;
    }

    // 4
    if ((bx2 >= X1 && bx2 <= X2) && (
            (by2 < Y1 && by4 > Y1) ||
            (by2 > Y1 && by4 < Y3) ||
            (by2 < Y2 && by4 > Y3)
            )) {
        console.log("colission: right");
        collision = true;
    }

    return collision;
}
