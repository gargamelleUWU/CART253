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

function draw() {
startScreen();
if (gameState === 1) {
    gameScreen();
}

if (gameState === 2) {
    endScreen();
}
}

function startScreen() {
background("#FF0033");
}

function gameScreen() {
background("#00FF33");
frog();
}

function endScreen() {
background("#0000FF");
}

function mousePressed() {
    gameState = 1;
}

function frog() {
    let frog = {
    x: mouseX,
    y: mouseY,
    size: 100,
    color: ("#111111"),
}
    push();
    circle(mouseX, screen.height, frog.size);
    fill(frog.color);
    noStroke();
    pop();
}