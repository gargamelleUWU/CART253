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

const target = {
    x: 50,
    y: 300,
    size: 50,
    fill: "#a9e201",
    fills: {
        color1: "#a9e201",
        color2: "#ff00aeff"
    }
};

// setup function
function setup() {
    createCanvas(400,400);
}

function draw() {
    background("#aaaaaa");
    drawTarget();
    moveUser();
    drawUser();
    drawPuck();
    detectCollision();
    targetHit();

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
    push();
    fill(target.fill);
    circle(target.x, target.y, target.size);
    pop();
}

function detectCollision() {
    let distance = dist(user.x, user.y, puck.x, puck.y);
    let dX = puck.x - user.x;
    let dY = puck.y - user.y;

    if (distance < puck.size) {
        if (dX < 0) {
        puck.x += dX/20;
        } else if (dX > 0) {
            puck.x += dX/20;
        }

        if (dY < 0) {
            puck.y += dY/20;
        } else if (dY > 0) {
            puck.y += dY/20;
        }
    }

    if (puck.x <= puck.size/2) {
        puck.x = puck.size/2;
    } else if (puck.x >= width-(puck.size/2)) {
        puck.x = width-(puck.size/2);
    }

     if (puck.y <= puck.size/2) {
        puck.y = puck.size/2;
    } else if (puck.y >= width-(puck.size/2)) {
        puck.y = width-(puck.size/2);
    }
}

function targetHit() {
    let distanceTarget = dist(puck.x, puck.y, target.x, target.y)
        if (distanceTarget < target.size) {
            target.fill = target.fills.color2;
            circle(200,200,50);
        } else {
            target.fill = target.fills.color1;
        }
    console.log(distanceTarget);
    console.log(target.size);
}
