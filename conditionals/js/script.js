const puck = {
    x: 200,
    y: 200,
    size:75,
    fill: "#ff0000"
};

const user = {
    x: undefined,
    y: undefined,
    size: 75,
    fill: "#000000"
};

// setup function
function setup() {
    createCanvas(800,400);
}

function draw() {
    background("#aaaaaa");

    moveUser();
    drawUser();
    drawPuck();
    detectCollision();
}

function moveUser() {
    user.x = mouseX;
    user.y = mouseY;
}

function drawUser() {
  push();
  noStroke();
  fill(user.fill);
  ellipse(user.x, user.y, user.size);
  pop();
}

function drawPuck() {
    push();
    noStroke();
    fill(puck.fill);
    ellipse(puck.x, puck.y, puck.size);
    pop();
}

function drawTarget() {
    push()
    line(20, 300)
    pop()
}

function detectCollision() {

    let distance = dist(user.x, user.y, puck.x, puck.y);
    let dX = puck.x - user.x;
    let dY = puck.y - user.y;

    if (distance < puck.size) {
        if (dX < 0) {
        puck.x += dX/30;
        } else if (dX > 0) {
            puck.x += dX/30;
        }

        if (dY < 0) {
            puck.y += dY/30;
        } else if (dY > 0) {
            puck.y += dY/30;
        }
    }
    console.log(dX);
    console.log(dY);
}

