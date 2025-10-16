/**
 * Mod Jam
 * Felix Dionne
 * 
 * Mod Jam Assignment
 */

"use strict";

let gameState;

let screen = {
    width: 750,
    height: 700,
}


function setup() {
    createCanvas(screen.width, screen.height);
}

let frog = {
    x: 0,
    y: screen.height,
    size: 100,
    color: ("#1dae6fff"),
    tongue: {
        X: 0,
        Y: screen.height,
        Speed: 1,
        state: 'idle',
    }

}

function draw() {
changeState();
}

function startScreen() {
background("#FF0033");
}

function gameScreen() {
background("#94bce1ff");
drawFrog();
moveFrog();
shootTongue();
fly();
}

function endScreen() {
background("#0000FF");
}

function keyPressed() {
    gameState = 1;
}

function drawFrog() {
    push();
    fill(frog.color);
    circle(frog.x, frog.y, frog.size);
    noStroke();
    pop();
}

function moveFrog() {
frog.x = mouseX;
}

function fly() {
    let radius = 100;

    let fly = {
        x: screen.width/2 + radius * sin(frameCount/100),
        y: screen.height/2 + radius * cos(frameCount/100),
        size: 20,
        color: ("#3e3434ff"),
        color2: ("#230b0bff"),
    }

    push();
    fill(fly.color);
    stroke(fly.color2);
    circle(fly.x, fly.y, fly.size);
    pop();
}

function changeState() {
startScreen();
    if (gameState === 1) {
    gameScreen();
    }

    if (gameState === 2) {
    endScreen();
    }   
}

function shootTongue() {
    push(); 
    stroke("#FF00FF");
    strokeWeight(10);
    line(frog.x, (frog.y+50), frog.x, frog.tongue.Y-50);
    pop();

    if (frog.tongue.state === "shoot") {
        frog.tongue.y -= 5
    if (frog.tongue.y <=0) {
        frog.tongue.y += 5;
    }
    if (frog.tongue.y >= screen.height-50) {
        frog.tongue.state = idle;
    }
    }
}

function mousePressed() {
    if (frog.tongue.state === "idle");
        frog.tongue.state = "shoot";
}