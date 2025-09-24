const puck = {
    x: 200,
    y: 200,
    size: 100,
    fill: "#ff0000"
};

const user = {
    x: undefined,
    y: undefined,
    size: 75,
    fill: "#000000"
};

function setup() {
    createCanvas(400,400);
}

function draw() {
    background("#aaaaaa");

moveUser();

drawUser();
drawPuck();
}

function moveUser() {
    user.x = mouseX;
    user.y = mouseY;
}

function drawUser() {
    push();
    noStroke();
    fill(user.fill);
    ellipse(puck.x, puck.y, puck.size);
    pop();
}