/* profile */

function Profile() {
    this.size = 50;
    this.get = {
        2: {
            size: this.size,
            keys: {up: 38, down: 40, right: 39, left: 37, fire: 96},
            //startX: canvas.width - this.size,
            startX: canvas.width / 2 - this.size / 2,
            startY: canvas.height / 2 - this.size / 2,
            moveDir: "left",
            skin: "tank4_blue",
            color: "blue"
        },
        1: {
            size: this.size,
            keys: {up: 87, down: 83, right: 68, left: 65, fire: 32},
            //startX: 0,
            startX: canvas.width / 2 - this.size / 2,
            //startY: canvas.height / 2 - this.size / 2,
            startY: canvas.height / 2 + this.size,
            moveDir: "right",
            skin: "tank4_red",
            color: "red"
        }
    }
}
