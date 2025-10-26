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
let mistake;
let splash;
let waterFilter;
let rise;

//visual variables
let flyFlap;
let flyNoFlap;
let currentFly;
let Hanez;
let lilypad;
let water1;
let water2;
let water3;
let currentBackground;
let thorns1;
let thorns2;
let thorns3;
let currentThorns

"use strict";
const missLimit = 5;
let gameState = "start";
let score = 0;
let eaten = null;
let missedFlies = 0;
let combo = 0;

let marks = [];

let markSettings = {
    startX: 400,
    y: 27,
    width: 10,
    distance: 20,
    color: ("#f03737ff"),
}

const hunger = {
    current: 50,
    max: 100,
    min: 0,
    replenishAmount: 20,
    depleteRate: 2,
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
    waterFilter = new p5.LowPass();
}

function preload() {
    tongueLaunch = loadSound("assets/sounds/TongueOut1.wav");
    tongueLaunch.setVolume(1.5);
    eatFly = loadSound("assets/sounds/FlyEat1.wav");
    eatFly.setVolume(1.5);
    soundtrack = loadSound("assets/sounds/FrogVibes.mp3");
    soundtrack.setVolume(0.2);
    mistake = loadSound("assets/sounds/Mistake.wav");
    mistake.setVolume(1.5);
    splash = loadSound("assets/sounds/Splash.wav");
    splash.setVolume(1.5);
    rise = loadSound("assets/sounds/Rise.wav");
    rise.setVolume(1.5);

    flyFlap = loadImage("assets/images/Fly1.png");
    flyNoFlap = loadImage("assets/images/Fly2.png");

    Hanez = loadImage("assets/images/Hanez.png");
    lilypad = loadImage("assets/images/Lilypad.png");

    water1 = loadImage("assets/images/water1.png");
    water2 = loadImage("assets/images/water2.png");
    water3 = loadImage("assets/images/water3.png");

    thorns1 = loadImage("assets/images/thorns1.png");
    thorns2 = loadImage("assets/images/thorns2.png");
    thorns3 = loadImage("assets/images/thorns3.png");
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
    background("#87ceeb");
    fill("#605a7cff");
    textAlign(CENTER);
    textFont('impact');
    textSize(45);
    text("Weclome to Fly Frog", width / 2, 150);
    textSize(15);
    text("Hanez is a hungry little frog", width / 2, 250);
    text("He needs to eat as many flies as he can", width / 2, 270);
    text("Move Hanez left and right with the Mouse", width / 2, 290);
    text("Launch his tongue by left clicking", width / 2, 310);
    text("Make sure not to hit the thorns", width / 2, 330);
    text("Hanez gets very hungry very quickly", width / 2, 350);
    text("Keep him well fed or he'll become sluggish", width / 2, 370);
    text("Eating enough flies without touching the thorns is", width / 2, 390);
    text("sure to get Hanez fired up to eat even more flies", width / 2, 410);
    textSize(45);
    text("Press SPACE BAR to play!", width / 2, 550);
    pop();
}

/**
 * Draws the endscreen
 */
function drawEndScreen() {
    push();
    background("#87ceeb");
    fill("#605a7cff");
    textAlign(CENTER);
    textFont('impact');
    textSize(40);
    text("Oh No! Hanez has hallen in the water!!!", width / 2, 150);
    textSize(15);
    text("Be careful not to hit the thorns", width / 2, 280);
    text("Hanez's tongue is perfect for eating flies", width / 2, 300);
    text("But it doesn't do great against thorny vines", width / 2, 320);
    text("There's nothing wrong with letting a fly or two get away", width / 2, 340);
    text("Be patient, and strike the flies with precision", width / 2, 360);
    text("Hanez is still hungry", width / 2, 380)
    textSize(45);
    text("Press SPACE BAR to play again!", width / 2, 550);
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
        fly.speed = random(2, 5);
    } else {
        fly.speed = random(-2, -5);
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
            if (missedFlies != 5) {
                mistake.play();
            } else {
                splash.play();
            }
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
    fill("#f03737ff");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#f03737ff");
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
    drawTutorial();
}

function gameScreen() {
    animateWater();
    setBackground();
    displayScore();
    moveFly();
    drawFly();
    moveFrog();
    Lilypad();
    flyWave();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
    checkHunger();
    updateHunger();
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
            applyWaterFilter();
            gameState = "end";
        }
    } else if (gameState === "end") {
        endScreen();
        if (keyIsDown(32)) {
            rise.play();
            removeWaterFilter();
            gameState = "play";
        }
    }
}

function displayScore() {
    drawHUD();
    drawHunger();
    push();
    textFont('Impact');
    textSize(20);
    text("Score: " + score, 600, 35);
    text("Combo: " + combo, 500, 35);
    pop();
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

    if (eaten) {
        hunger.current += hunger.replenishAmount;
    }

    if (hunger.current >= hunger.max) {
        hunger.current = hunger.max;
        frog.tongue.speed = 20;
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

    fill("#e8f347ff");
    rect(20, 20, barWidth, 20);

    fill(255);
    textFont('Impact');
    textAlign(LEFT, CENTER);
    textSize(20);
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
    fly.move.range = random(20, 100);
    fly.move.speed = random(5, 25);
}

function drawHUD() {
    push();
    fill("#308f48ff")
    rect(0, 0, width, 50);
    pop();
}

function animateWater() {
    let cycle = (frameCount % 120);
    if (cycle >= 0 && cycle < 30) {
        currentBackground = water1;
        currentThorns = thorns1;
    } else if (cycle >= 30 && cycle < 60) {
        currentBackground = water2;
        currentThorns = thorns2;
    } else if (cycle >= 60 && cycle < 90) {
        currentBackground = water3;
        currentThorns = thorns3;
    } else if (cycle >= 90 && cycle <= 120) {
        currentBackground = water2;
        currentThorns = thorns2;
    }
}

function setBackground() {
    imageMode(CENTER)
    image(currentBackground, width / 2, height / 2, width, height);
    image(currentThorns, width / 2, 62, width, 40);
}

function applyWaterFilter() {
    soundtrack.disconnect();
    soundtrack.connect(waterFilter);
    waterFilter.set(400, 4);
}

function removeWaterFilter() {
    soundtrack.disconnect();
    soundtrack.connect();
}