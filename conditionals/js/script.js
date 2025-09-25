const puck = {
    x: 200,
    y: 200,
    size:100,
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

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background("#aaaaaa");
    drawTarget();
    moveUser();
    drawUser();
    drawPuck();
    pushGuy();
    targetHit();
    walls();

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

function pushGuy() {
    let distance = dist(user.x, user.y, puck.x, puck.y)-10;
    let dX = puck.x - user.x;
    let dY = puck.y - user.y;
    let mouseMovement = movedX; 
    let maxPush = 2;
    let midPush = 10;
    let minPush = 20;

    console.log(distance, puck.size, user.size);

    if (distance < user.size-(puck.size*0.5)) {
             if (dX < 0) {
        puck.x += dX/maxPush;
        } else if (dX > 0) {
            puck.x += dX/maxPush;
        }

        if (dY < 0) {
            puck.y += dY/maxPush;
        } else if (dY > 0) {
            puck.y += dY/maxPush;
        }
    } else if (distance < user.size-(puck.size*0.25)) {
             if (dX < 0) {
        puck.x += dX/midPush;
        } else if (dX > 0) {
            puck.x += dX/midPush;
        }

        if (dY < 0) {
            puck.y += dY/midPush;
        } else if (dY > 0) {
            puck.y += dY/midPush;
        }
        
    } else if (distance < user.size) {
        if (dX < 0) {
        puck.x += dX/minPush;
        } else if (dX > 0) {
            puck.x += dX/minPush;
        }

        if (dY < 0) {
            puck.y += dY/minPush;
        } else if (dY > 0) {
            puck.y += dY/minPush;
        }
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
}

function walls() {
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
