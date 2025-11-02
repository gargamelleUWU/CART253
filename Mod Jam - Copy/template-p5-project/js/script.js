
"use strict";

let frog = {
    x: 0,
    y: 0,
    size: 70,
    color: ("#9fee6bff"),
    tongue: {
        x: 0,
        y: 0,
        speed: 0,
        color: ("#ff3b3bff"),
        state: "idle",
    }
}

let flies = [];
let emptyFly = {
    x: 0,
    y: 0,
    size: 0,
    speed: 0,
}

function setup() {
    createCanvas(700, 700);
}

function draw() {
    background("#5eada3ff");

    drawFrog();
    drawTongue();

    moveFrog();
    moveTongue();

    flyMachine();
    console.log(flies);
}

function createFly() {
    let spawn = random(0, 100);

    if (spawn <= 1) {
        let newFly = {
            x: 0,
            y: height / 2,
            size: 20,
            speed: 5,
        }
        return newFly;
    } else {
        return null;
    }
}

function drawFly(fly) {
    push()
    fill("#b90000ff");
    circle(fly.x, fly.y, fly.size);
    pop()
}

function moveFly(fly) {
    fly.x += fly.speed;
}

function flyMachine() {
    let newFly = createFly();
    if (newFly) {
        flies.push(newFly);
    }

    for (let i = flies.length - 1; i >= 0; i--) {
        let fly = flies[i];

        drawFly(fly);
        moveFly(fly);

        if (fly.x > width + fly.size / 2) {
            flies.splice(i, 1);
        }
    }
}

function drawFrog() {
    push();
    fill(frog.color);
    circle(frog.x, frog.y, frog.size);
    pop();
}

function moveFrog() {
    frog.x = mouseX;
    frog.y = height;
}

function drawTongue() {
    push()
    fill(frog.tongue.color);
    circle(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop()

    push()
    stroke(frog.tongue.color);
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.x, frog.y);
    pop()
}

function moveTongue() {
    if (frog.tongue.state === "shooting") {
        frog.x 
    }
}

function mousePressed() {
    frog.tongue.state = "shooting";
}