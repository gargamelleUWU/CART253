/**
 * Frogfrogfrog
 * Pippin Barr
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */


//Sounds Variables
let tongueLaunch;
let eatFly;
let soundtrack;

//visual variables
let flyFlap;
let flyNoFlap;
let currentFly;
let Hanez;
let lilypad;

"use strict";
const missLimit = 5;
let gameState = "start";
let score = 0;
let eaten = null;
let missedFlies = 0;
let combo = 0;

let marks = [];

let markSettings = {
    startX: 300,
    y: 30,
    width: 10,
    distance: 20,
    color: ("#FF0000"),

}

const hunger = {
    current: 50,
    max: 100,
    min: 0,
    replenishAmount: 20,
    depleteRate: 1,
    depleteInterval: 10,
    isHungry: false,
}

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 600,
        size: 75,
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 560,
        size: 20,
        speed: 20,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 30,
    size2: 20,
    speed: 3,
    spawn: 1,
    move: {
        y: 250,
        range: 100,
        speed: 10,
    }
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(700, 650);
    // Give the fly its first random position
    resetFly();
}

function preload() {
    tongueLaunch = loadSound("assets/sounds/TongueOut1.wav");
    tongueLaunch.setVolume(1.5);
    eatFly = loadSound("assets/sounds/FlyEat1.wav");
    eatFly.setVolume(1.5);
    soundtrack = loadSound("assets/sounds/FrogVibes.mp3");
    soundtrack.setVolume(0.2);

    flyFlap = loadImage("assets/images/Fly1.png");
    flyNoFlap = loadImage("assets/images/Fly2.png");

    Hanez = loadImage("assets/images/Hanez.png");
    lilypad = loadImage("assets/images/Lilypad.png");
}

function draw() {
    controlState();
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width || fly.x < 0) {
        resetFly();
    }
}

/**
 * Draws the fly as a black circle
 */

function drawFly() {
    changeFly();
    push();
    imageMode(CENTER);

    if (flyFlap && flyNoFlap) {
        image(currentFly, fly.x, fly.move.y, fly.size, fly.size2)
    } else {
        noStroke();
        fill("#000000");
        ellipse(fly.x, fly.move.y, fly.size);
    }
    pop();
}

/**
 * Draws the tutorial screen
 */
function drawTutorial() {
    push();
    fill("#FF00FF");
    circle(100, 100, 100);
    pop();
}

/**
 * Draws the endscreen
 */
function drawEndScreen() {
    background("#000000");
    push();
    fill("#00FFFE");
    circle(100, 100, 100);
    pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    switchFly();
    fly.y = random(150, 500);
    if (fly.spawn < 1) {
        fly.x = 0;
        fly.speed = 3;
    } else {
        fly.speed = -3;
        fly.x = width - 1;

    }

}

function resetTongue() {
    frog.tongue.x = frog.body.x;
    frog.tongue.y = 560;
}

function flyWave() {
    fly.move.y = fly.y + fly.move.range * sin(frameCount / fly.move.speed);
}

function flyRandomWave() {

}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 75) {
            missedFlies++;
            combo = 0;

            let newMarkX = markSettings.startX + (missedFlies - 1) * markSettings.distance;
            let newMark = {
                x: newMarkX,
                y: markSettings.y,
            }
            marks.push(newMark);
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height - 100) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    imageMode(CENTER);
    if (Hanez) {
        image(Hanez, frog.body.x, frog.body.y, frog.body.size, frog.body.size);
    } else {
        push();
        fill("#20c392ff");
        stroke("#044628ff");
        ellipse(frog.body.x, frog.body.y, frog.body.size);
        pop();
    }
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.move.y);
    // Check if it's an overlap
    eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        score++;
        frog.body.size++;
        eatFly.play();
        combo++;
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (gameState === "play" && frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
        tongueLaunch.play();
    }
}

function startScreen() {
    background(0, 0, 0);
    drawTutorial();
}

function gameScreen() {
    background("#87ceeb");
    displayScore();
    moveFly();
    drawFly();
    moveFrog();
    Lilypad();
    flyWave();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
    updateHunger();
    checkHunger();
    comboTracker();
    drawMarks();
    debug();
}

function endScreen() {
    missedFlies = 0;
    score = 0;
    marks = [];
    frog.body.size = 75;
    resetFly();
    resetTongue();
    resetHunger();
    drawEndScreen();
}

function controlState() {
    if (gameState === "start") {
        startScreen();
        if (keyIsDown(32)) {
            soundtrack.loop();
            gameState = "play";
        }
    } else if (gameState === "play") {
        gameScreen();
        if (missedFlies === missLimit) {
            gameState = "end";
        }
    } else if (gameState === "end") {
        endScreen();
        if (keyIsDown(32)) {
            gameState = "play";
        }
    }
}

function displayScore() {
    drawHUD();
    drawHunger();
    text("Score: " + score, 580, 40);
    text("Combo: " + combo, 500, 40);
}

function debug() {
    console.log(fly.spawn, width, windowWidth);
}

function updateHunger() {
    if (frameCount % hunger.depleteInterval === 0) {
        hunger.current -= hunger.depleteRate;
    }

    if (hunger.current <= hunger.min) {
        hunger.current = hunger.min;
        hunger.isHungry = true;
    } else {
        hunger.isHungry = false;
    }

    if (hunger.current >= hunger.max) {
        hunger.current = hunger.max;
        frog.tongue.speed = 20;
    }

    if (eaten) {
        hunger.current += hunger.replenishAmount;
    }
}

function checkHunger() {
    if (hunger.isHungry === true) {
        frog.tongue.speed = 10;
    } else if (hunger.isHungry === false) {
        frog.tongue.speed = 20;
    }
}

function resetHunger() {
    hunger.current = 50;
    hunger.isHungry = false;
    frog.tongue.speed = 20;
}

function drawHunger() {
    push()

    fill(100);
    noStroke();
    rect(20, 20, 200, 20);

    let barWidth = map(hunger.current, hunger.min, hunger.max, 0, 200);

    fill(80, 200, 80);
    rect(20, 20, barWidth, 20);

    fill(255);
    textAlign(LEFT, CENTER);
    textSize(14);
    text("Hunger", 230, 30);

    pop()
}

function drawMarks() {
    for (let i = 0; i < marks.length; i++) {
        let currentMark = marks[i];
        push();
        fill(markSettings.color);
        circle(currentMark.x, currentMark.y, markSettings.width);
        pop();
    }
}

function comboTracker() {
    if (combo >= 10 && combo <= 20) {
        frog.tongue.size = 35;
    } else if (combo >= 21 && combo <= 50) {
        frog.tongue.size = 50;
    } else if (combo === 0) {
        frog.tongue.size = 20;
    }
}

function changeFly() {
    let cycle = (frameCount % 60)
    if (cycle <= 30) {
        currentFly = flyFlap;
    } else if (cycle >= 30) {
        currentFly = flyNoFlap;
    }
}

function Lilypad() {
    push();
    imageMode(CENTER);
    image(lilypad, frog.body.x, frog.body.y, 125, 125);
    pop();
}

function switchFly() {
    fly.spawn = random(0, 2);
}

function drawHUD() {
    push();
    fill("#308f48ff")
    rect(0, 0, width, 50);
    pop();
}