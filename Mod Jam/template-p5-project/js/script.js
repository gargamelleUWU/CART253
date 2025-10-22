/**
 * Mod Jam
 * Felix Dionne
 * 
 * Mod Jam Assignment
 */

"use strict";

let score = 0;
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
        x: 0,
        y: screen.height,
        speed: 30,
        state: 'idle',
    }

}

let fly = {
    radius: 100,
    x: 0,
    y: 0,
    size: 20,
    color: ("#3e3434ff"),
    color2: ("#230b0bff"),
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
drawFly();
showScore();
}

function endScreen() {
background("#0000FF");
}

function keyPressed() {
    gameState = 1;
}

function drawFrog() {
    frog.tongue.x = mouseX;
    push();
    fill(frog.color);
    circle(frog.x, frog.y, frog.size);
    noStroke();
    pop();
    console.log(frog.tongue.state);
}

function moveFrog() {
frog.x = mouseX;
}

function drawFly() {
    fly.x = screen.width/2 + fly.radius * sin(frameCount/100),
    fly.y = screen.height/2 + fly.radius * cos(frameCount/100),
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
    line(frog.x, (frog.y), frog.x, frog.tongue.y);
    pop();

    if (frog.tongue.state === "shoot") {
        frog.tongue.y -= frog.tongue.speed;
    }

    if (frog.tongue.y < 0) {
        frog.tongue.state = "retract";
    }

    if (frog.tongue.state === "retract") {
        frog.tongue.y += frog.tongue.speed;
    }

    if (frog.tongue.y > windowHeight) {
        frog.tongue.state = "idle";
    }

    let eatFly = dist(fly.x, fly.y, frog.tongue.x, frog.tongue.y)
    if (eatFly <= fly.size) {
        frog.tongue.state = "retract";
        score ++;
    }
}

function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "shoot";
    }
}

function showScore() {
    text(score, 650, 50);
}

