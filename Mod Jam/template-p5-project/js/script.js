/**
 * Fly Frog
 * Felix Dionne
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

// Sound variables.
// These variables are used through out the program to play certain sound effects.
let tongueLaunch;
let eatFly;
let soundtrack;
let mistake;
let splash;
let waterFilter;
let rise;

// Cisual variables.
// These variables are assigned visual elements that I uploaded to the assets folder
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

// Some miscellaneous global variables that are used in multiple functions within the program
"use strict";
const missLimit = 5;
let gameState = "start";
let score = 0;
let eaten = null;
let missedFlies = 0;
let combo = 0;
let blueSize = 100;
let redSize = 100;
let greenSize = 100;
let yellowSize = 100;
let tong1Size = 50;
let tong2Size = 50;
let tong3Size = 50;

// An array which holds mark objects that signify how many 'mistakes' the player has made.
let marks = [];

// The mark object settings which are used to draw the elements on the Game Interface.
let markSettings = {
    startX: 400,
    y: 27,
    width: 10,
    distance: 20,
    color: ("#f03737ff"),
}

// The relevent values of the hunger mechanic.
// The initial value, the min, the max, the rate at which hunger depletes over time, 
// the hunger Hanez gets back when he eats a fly, a boolean that dictates if Hanez is hungry
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
        state: "idle", // State can be: idle, outbound, inbound
        color: ("#f03737ff"),
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

const selectButton = {
    width: 290,
    height: 20,
    color: ("#1487a3ff"),
    color2: ("#0b4553ff"),
    state: "null",
}

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(700, 650);
    // Give the fly its first random position
    resetFly();
    waterFilter = new p5.LowPass();
    Hanez = frogBlue;
}

// Loading in all the assets I used, such as sounds, music and images
function preload() {
    // All the sound effects and music and setting the volumes
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

    // The two frames of animation for the fly
    flyFlap = loadImage("assets/images/Fly1.png");
    flyNoFlap = loadImage("assets/images/Fly2.png");

    // Our main man Hanez and his trusty lilypad
    lilypad = loadImage("assets/images/Lilypad.png");
    frogBlue = loadImage("assets/images/HanezB.png");
    frogGreen = loadImage("assets/images/HanezG.png");
    frogRed = loadImage("assets/images/HanezR.png");
    frogYellow = loadImage("assets/images/HanezY.png");

    // The frames of animation for the water
    water1 = loadImage("assets/images/water1.png");
    water2 = loadImage("assets/images/water2.png");
    water3 = loadImage("assets/images/water3.png");

    // The frames of animation for the thorns
    thorns1 = loadImage("assets/images/thorns1.png");
    thorns2 = loadImage("assets/images/thorns2.png");
    thorns3 = loadImage("assets/images/thorns3.png");
}

// Our main draw function. There are alot of nested functions hence why draw only has a single on.
// Feels pretty good to have the entire project run with only a single function in the draw function!
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

    // Checking that two animation frames are loaded, if so uses those images to animate the fly.
    if (flyFlap && flyNoFlap) {
        image(currentFly, fly.x, fly.move.y, fly.size, fly.size2)
        // A backup fly in case the frames are not loaded
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
    background("#87ceeb");

    push();
    fill(selectButton.color);
    noStroke();
    rect(50, 0, selectButton.width, selectButton.height);
    rect(360, 0, selectButton.width, selectButton.height);

    textFont('impact');
    textSize(45);
    text("PLAY", 160, 60);
    text("SELECT", 440, 60);
    pop();

    push();
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
    text("Oh No! Hanez has fallen in the water!!!", width / 2, 150);
    textSize(15);
    text("Be careful not to hit the thorns", width / 2, 280);
    text("Hanez's tongue is perfect for eating flies", width / 2, 300);
    text("But it doesn't do great against thorny vines", width / 2, 320);
    text("There's nothing wrong with letting a fly or two get away", width / 2, 340);
    text("Be patient, and strike the flies with precision", width / 2, 360);
    text("Hanez is still hungry", width / 2, 380);
    textSize(45);
    text("Press SPACE BAR to play again!", width / 2, 550);
    pop();

    back();
}

/**
 * Resets the fly to the left or the right with a random y
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

// Resets the tongue in between game states
function resetTongue() {
    frog.tongue.x = frog.body.x;
    frog.tongue.y = 560;
}

// This adds the wave motion to the flies path
function flyWave() {
    fly.move.y = fly.y + fly.move.range * sin(frameCount / fly.move.speed);
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

function detectTongue() {
    if (frog.tongue.y === 0) {
        frog.tongue.state = "inbound";
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill(frog.tongue.color);
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke(frog.tongue.color);
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    imageMode(CENTER);
    // Checks that the image for Hanez is loaded, if so it uses it
    if (Hanez) {
        image(Hanez, frog.body.x, frog.body.y, frog.body.size, frog.body.size);
        // Alternate form for Hanez if the png is not found
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
    // Increases the score and also Hanez's size just a little bit when a fly is eaten
    // Additionally, plays the 'eatFly' sound effect and increased Hanez's combo
    if (eaten) {
        score++;
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
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
        // Plays the tongue sound effect
        tongueLaunch.play();
    }

    if (gameState === "select") {
        if ((mouseX > (350 - blueSize / 2) && mouseX < (350 + blueSize / 2)) && (mouseY > (200 - blueSize / 2) && mouseY < (200 + blueSize / 2)))
            Hanez = frogBlue;
        if ((mouseX > (550 - redSize / 2) && mouseX < (550 + redSize / 2)) && (mouseY > (200 - redSize / 2) && mouseY < (200 + redSize / 2))) {
            Hanez = frogRed;
        }
        if ((mouseX > (350 - greenSize / 2) && mouseX < (350 + greenSize / 2)) && (mouseY > (400 - greenSize / 2) && mouseY < (400 + greenSize / 2))) {
            Hanez = frogGreen;
        }
        if ((mouseX > (550 - yellowSize / 2) && mouseX < (550 + yellowSize / 2)) && (mouseY > (400 - yellowSize / 2) && mouseY < (400 + yellowSize / 2))) {
            Hanez = frogYellow;
        }


        if (mouseX > (350 - tong1Size / 2) && mouseX < (350 + tong1Size / 2) && mouseY > (60 - tong1Size / 2) && mouseY < (60 + tong1Size / 2)) {
            frog.tongue.color = ("#f03737ff");
        }
        if (mouseX > (450 - tong2Size / 2) && mouseX < (450 + tong2Size / 2) && mouseY > (60 - tong2Size / 2) && mouseY < (60 + tong2Size / 2)) {
            frog.tongue.color = ("#f153c7ff");
        }
        if (mouseX > (550 - tong3Size / 2) && mouseX < (550 + tong3Size / 2) && mouseY > (60 - tong3Size / 2) && mouseY < (60 + tong3Size / 2)) {
            frog.tongue.color = ("#ff7a0eff");
        }
    }

    if (gameState === "select" || gameState === "end") {
        if (mouseX > 15 && mouseX < 70 && mouseY > 20 && mouseY < 60) {
            gameState = "start";
        }
    }

}

// This function could be skipped, but it makes my brain happy to have all three 'Screen' functions
function startScreen() {
    selectButton.color = ("#1487a3ff");
    selectButton.color2 = ("#0b4553ff");
    drawTutorial();

    moveFrog();
    moveTongue();
    detectTongue();
    tongueButtonOverlay();

    drawLilypad();
    drawFrog();

    debug();
}

function selectScreen() {
    frog.tongue.x = frog.body.x;
    frog.tongue.y = 200;
    detectTongue();
    tongueButtonOverlay();

    drawFrogScreen();
    tongueColors();
    drawLilypad();
    back();
    drawFrog();


    debug();
}

// This is where the magic happens
// Just about every other function within the program is used here to make the game
function gameScreen() {
    // Movement functions that move Hanez, the tongue and the fly
    moveFrog();
    moveTongue();
    missedFlyCounter();
    moveFly();

    // Checking for colision between Hanez's tongue and the current fly
    checkTongueFlyOverlap();
    // Moving fly with sin wave
    flyWave();

    // Upadating values such as hunger and combo
    updateHunger();
    checkHunger();
    comboTracker();
    // animating the water and the throns
    animateWater();

    // Drawing the gameplay elements
    drawBackground();
    drawFly();
    drawLilypad();
    drawFrog();

    // Drawing the Heads up Display elements
    displayScore();
    drawMarks();

    // function used to console.log variables during development
    debug();
}

// Function which draws the resets many of Hanez's variables so that he's ready for the next game.
// Calls other functions which reset of aspects of the game
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

// The main function which controls the state the game is in
// The game can be in the 'start, play, or end' state.
function controlState() {
    if (gameState === "start") {
        startScreen();
        if (selectButton.state === "play") {
            if (!soundtrack.isPlaying()) {
                soundtrack.loop();
            }
            gameState = "play";
            resetTongue();
        } else if (selectButton.state === "select") {
            gameState = "select";
            resetTongue();
        }

    } else if (gameState === "select") {
        selectScreen();
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

// Function displays the HUD elements for the game, such as score, combo, hunger, mistakes
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

// Debug function used during development to check certain variables with console.log
function debug() {
    console.log(mouseX, mouseY);
}

// Function that controls Hanez's hunger during the play state
// delpletes the hunger over time, refills the hunger when Hanez eats a fly, and prevents the hunger from going outside the designated range
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

// Checks the hunger and slows down the tongue speed if hunger is depleted
function checkHunger() {
    if (hunger.isHungry === true) {
        frog.tongue.speed = 5;
    } else {
        frog.tongue.speed = 20;
    }
}

// Function to reset the hunger on a new game
function resetHunger() {
    hunger.current = 50;
    hunger.isHungry = false;
    frog.tongue.speed = 20;
}

// Function that draws the hunger bar in the HUD
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

// Function that draws the mistake marks in the HUD
function drawMarks() {
    for (let i = 0; i < marks.length; i++) {
        let currentMark = marks[i];
        push();
        fill(markSettings.color);
        circle(currentMark.x, currentMark.y, markSettings.width);
        pop();
    }
}

// Function that tracks the value of 'combo' and give Hanez a nice buff when the combo is high enough
function comboTracker() {
    if (combo >= 20 && combo <= 49) {
        frog.tongue.size = 35;
    } else if (combo > 49) {
        frog.tongue.size = 50;
    } else if (combo === 0) {
        frog.tongue.size = 20;
    }
}

// Function that animates the flies
function changeFly() {
    let cycle = (frameCount % 60)
    if (cycle <= 30) {
        currentFly = flyFlap;
    } else if (cycle >= 30) {
        currentFly = flyNoFlap;
    }
}

// Function that draws the Lilypad which protects little Hanez from the water below
function drawLilypad() {
    push();
    imageMode(CENTER);
    image(lilypad, frog.body.x, frog.body.y, 125, 125);
    pop();
}

// Function that allows flies to spawn from either side of the screen
function switchFly() {
    fly.spawn = random(0, 2);
    fly.move.range = random(20, 100);
    fly.move.speed = random(5, 25);
}

// Function that draws the underlying bar for the HUD
function drawHUD() {
    push();
    fill("#308f48ff");
    rect(0, 0, width, 50);
    pop();
}

// Function that animates the water and thorns
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

// Function which sets the loaded assets as the background and thorns
function drawBackground() {
    imageMode(CENTER)
    image(currentBackground, width / 2, height / 2, width, height);
    image(currentThorns, width / 2, 62, width, 40);
}

// Function that applies the underwater filter to the music
function applyWaterFilter() {
    soundtrack.disconnect();
    soundtrack.connect(waterFilter);
    waterFilter.set(400, 4);
}

// Function that removes the underwater filter from the music
function removeWaterFilter() {
    soundtrack.disconnect();
    soundtrack.connect();
}

function missedFlyCounter() {
    // The tongue bounces back if it hits the top considering the Heads up Display
    // Also increased the value of missed flies and plays the 'mistake' and 'splash' sound effects
    if (frog.tongue.y <= 75) {
        missedFlies++;
        if (missedFlies != 5) {
            mistake.play();
        } else {
            splash.play();
        }
        // Resets Hanez's combo if he misses a fly and hits the thorns instead
        combo = 0;

        // Drawing the indicators reflecting how many times Hanez has missed a fly
        let newMarkX = markSettings.startX + (missedFlies - 1) * markSettings.distance;
        let newMark = {
            x: newMarkX,
            y: markSettings.y,
        }
        marks.push(newMark);
        frog.tongue.state = "inbound";
    }
}

function tongueButtonOverlay() {
    selectButton.state = "null";
    if (frog.tongue.y === 0) {
        if (frog.tongue.x > 50 && frog.tongue.x < 340) {
            selectButton.state = "play";
        } else if (frog.tongue.x > 360 && frog.tongue.x < 650) {
            selectButton.state = "select";
        }
    }
}



function drawFrogScreen() {
    background("#87ceeb");
    frog.body.x = 100;
    frog.body.y = 550;

    push();
    imageMode(CENTER);
    // Checks that the image for Hanez is loaded, if so it uses it
    if (frogBlue) {
        image(frogBlue, 350, 200, blueSize, blueSize);
        // Alternate form for Hanez if the png is not found
    } else {
        push();
        fill("#20c392ff");
        stroke("#044628ff");
        ellipse(frog.body.x, frog.body.y, frog.body.size);
        pop();
    }

    if (frogRed) {
        image(frogRed, 550, 200, redSize, redSize);
        // Alternate form for Hanez if the png is not found
    } else {
        push();
        fill("#20c392ff");
        stroke("#044628ff");
        ellipse(frog.body.x, frog.body.y, frog.body.size);
        pop();
    }

    if (frogGreen) {
        image(frogGreen, 350, 400, greenSize, greenSize);
        // Alternate form for Hanez if the png is not found
    } else {
        push();
        fill("#20c392ff");
        stroke("#044628ff");
        ellipse(frog.body.x, frog.body.y, frog.body.size);
        pop();
    }

    if (frogYellow) {
        image(frogYellow, 550, 400, yellowSize, yellowSize);
        // Alternate form for Hanez if the png is not found
    } else {
        push();
        fill("#20c392ff");
        stroke("#044628ff");
        ellipse(frog.body.x, frog.body.y, frog.body.size);
        pop();
    }
    pop();
    // Hover effect for blue frog
    if ((mouseX > (350 - blueSize / 2) && mouseX < (350 + blueSize / 2)) && (mouseY > (200 - blueSize / 2) && mouseY < (200 + blueSize / 2))) {
        blueSize = 125;
    } else {
        blueSize = 100;
    }
    // Hover effect for red frog
    if ((mouseX > (550 - redSize / 2) && mouseX < (550 + redSize / 2)) && (mouseY > (200 - redSize / 2) && mouseY < (200 + redSize / 2))) {
        redSize = 125;
    } else {
        redSize = 100;
    }
    // Hover effect for green frog
    if ((mouseX > (350 - greenSize / 2) && mouseX < (350 + greenSize / 2)) && (mouseY > (400 - greenSize / 2) && mouseY < (400 + greenSize / 2))) {
        greenSize = 125;
    } else {
        greenSize = 100;
    }
    // Hover effect for yellow frog
    if ((mouseX > (550 - yellowSize / 2) && mouseX < (550 + yellowSize / 2)) && (mouseY > (400 - yellowSize / 2) && mouseY < (400 + yellowSize / 2))) {
        yellowSize = 125;
    } else {
        yellowSize = 100;
    }
}

function tongueColors() {
    push();

    rectMode(CENTER)
    noStroke();
    fill("#f03737ff");
    rect(350, 60, tong1Size, tong1Size);

    noStroke();
    fill("#f153c7ff");
    rect(450, 60, tong2Size, tong2Size);

    noStroke();
    fill("#ff7a0eff");
    rect(550, 60, tong3Size, tong3Size);

    pop();

    if (mouseX > (350 - tong1Size / 2) && mouseX < (350 + tong1Size / 2) && mouseY > (60 - tong1Size / 2) && mouseY < (60 + tong1Size / 2)) {
        tong1Size = 75;
    } else {
        tong1Size = 50;
    }

    if (mouseX > (450 - tong2Size / 2) && mouseX < (450 + tong2Size / 2) && mouseY > (60 - tong2Size / 2) && mouseY < (60 + tong2Size / 2)) {
        tong2Size = 75;
    } else {
        tong2Size = 50;
    }

    if (mouseX > (550 - tong3Size / 2) && mouseX < (550 + tong3Size / 2) && mouseY > (60 - tong3Size / 2) && mouseY < (60 + tong3Size / 2)) {
        tong3Size = 75;
    } else {
        tong3Size = 50;
    }
}

function back() {
    push();
    noStroke();
    fill(selectButton.color);
    rect(30, 30, 40, 20);
    triangle(15, 40, 30, 20, 30, 60);
    pop();

    push();
    fill(selectButton.color2);
    textFont('impact');
    textSize(14);
    text("BACK", 35, 45);
    pop();

    if (mouseX > 15 && mouseX < 70 && mouseY > 20 && mouseY < 60) {
        selectButton.color = ("#43c0dfff");
        selectButton.color2 = ("#338296ff");
    } else {
        selectButton.color = ("#1487a3ff");
        selectButton.color2 = ("#0b4553ff");
    }
}
