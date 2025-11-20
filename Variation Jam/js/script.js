/**
 * Variation Jam | Orbital Space
 * 
 * 
 */

let celestials = [];
let gravConstant = 10;
let spawnRange = 200;
const massMultiplier = 10;
const autoSpawnRate = 120;
const fadeSpeed = 3;

let timeScale = 1;
let targetTimeScale = 1;
let timeRate = 0.05;

let music;

let state = 'start';
let titleAlpha = 255;

let sun;
let net;
let dotCelestial;

function preload() {
    soundFormats('mp3', 'ogg');
    music = loadSound('assets/sounds/soundtrack.mp3');
}

/**
 * Creates the canvas so that P5 can do its thing.
*/
function setup() {
    createCanvas(windowWidth, windowHeight);

    music.setVolume(0.3);

    sun = createSun();
    net = createNet();

    createDotCelestial();
}

/**
 * Draw function which runs all the main functions that allows our code to work.
*/
function draw() {
    background(0);

    timeDialation();

    drawSun(sun);

    if (titleAlpha > 0) {
        startScreen();
    }

    if (state === 'play') {
        if (titleAlpha > 0) {
            titleAlpha -= fadeSpeed;
        }

        if (targetTimeScale === 1) {
            spawnCelestial(sun, celestials);
        }

        updateNet(net);
        updateSun(sun)

        triggerSuperNova(sun, celestials);
        triggerImplosion(sun, celestials);

        drawNet(net);

        for (let i = celestials.length - 1; i >= 0; i--) {
            let celestial = celestials[i];

            celestialTrail(celestial);
            drawCelestial(celestial);

            let dirVec = findDirectionVector(sun, celestial);
            let forceMag = findMagnitudeOfForce(dirVec.copy(), sun, celestial);
            let forceVec = createForceVector(dirVec.copy(), forceMag);

            updateCelestial(celestial, forceVec);

            //Delete logic
            let bounds = 2000;

            if (celestial.pos.x < -bounds || celestial.pos.x > width + bounds ||
                celestial.pos.y < -bounds || celestial.pos.y > height + bounds) {
                celestial.offScreenTimer++;
            } else {
                celestial.offScreenTimer = 0;
            }

            if (celestial.offScreenTimer > 300) {
                celestials.splice(i, 1);
            }
        }
        drawHUD(sun, celestials, net);
    }
}

function createDotCelestial() {
    let xPos = (windowWidth / 2) + 351;
    let yPos = (windowHeight / 2) - 45;

    dotCelestial = {
        pos: createVector(xPos, yPos),
        vel: createVector(0, 0),
        acc: createVector(0, 0),
        mass: 15,
        radius: 30,
        thicc: 3,
        trail: [],
        color: "#FFFFFF",
        offScreenTimer: 0,
    };
}

/**
 * Creates our net object
 */
function createNet() {
    net = {
        pos: createVector(mouseX, mouseY),
        radius: 50,
    }
    return net;
}

/**
 * 
*/
function createSun() {

    let sun = {
        pos: createVector(windowWidth / 2, windowHeight / 2),
        mass: 100,
        radius: 200,
        thicc: 2,
        isCaptured: false,
        color: "#FFFFFF",
    }
    return sun;
}

/**
 * 
*/
function createCelestial(sun) {
    let startPos = createVector(
        random((sun.pos.x - sun.radius) - spawnRange, (sun.pos.x + sun.radius) + spawnRange),
        random((sun.pos.y - sun.radius) - spawnRange, (sun.pos.y + sun.radius) + spawnRange));

    let toSun = p5.Vector.sub(sun.pos, startPos);
    let rotationDirection = random() < 0.5 ? HALF_PI : -HALF_PI;
    let initialVel = toSun.copy().rotate(rotationDirection);

    let distance = toSun.mag();
    let orbitalSpeed = sqrt((gravConstant * sun.mass) / distance);
    initialVel.setMag(orbitalSpeed);

    let celestial = {
        pos: startPos,
        vel: initialVel,
        acc: createVector(0, 0),
        mass: random(1, 30),
        radius: random(10, 50),
        thicc: random(1, 5),
        trail: [],
        color: "#fffeaeff",
        offScreenTimer: 0,
    }
    return celestial;
}

function drawNet(net) {
    push();
    noFill();
    strokeWeight(2);
    stroke("#FFFFFF");
    setLineDash([2, 10]);
    circle(net.pos.x, net.pos.y, net.radius);
    pop();
}

/**
 * 
*/
function drawSun(sun) {
    if (sun.isCaptured) {
        push();
        fill(0);
        strokeWeight(sun.thicc);
        stroke(sun.color);
        circle(sun.pos.x, sun.pos.y, sun.radius);
        pop();
    } else {
        push();
        noFill();
        strokeWeight(sun.thicc);
        stroke("#FFFFFF");
        circle(sun.pos.x, sun.pos.y, sun.radius);
        pop();
    }
}

/**
 * 
*/
function drawCelestial(celestial) {
    push();
    fill(0);
    strokeWeight(celestial.thicc);
    stroke(celestial.color);
    circle(celestial.pos.x, celestial.pos.y, celestial.radius);
    pop();

    //Debug vector for celestials
    /*  push();
     stroke("#FFFFFF");
     line(celestial.pos.x, celestial.pos.y, celestial.pos.x + celestial.vel.x * 10, celestial.pos.y + celestial.vel.y * 10);
     pop(); */
}

function updateNet(net) {
    if (sun.isCaptured) {
        net.radius = sun.radius + 10;
    } else {
        net.radius = 50;
    }

    net.pos.x = mouseX;
    net.pos.y = mouseY;
    return net;
}

/**
 * 
*/
function isInField(sun, celestial) {
    return dist(sun.pos.x, sun.pos.y, celestial.pos.x, celestial.pos.y) < sun.radius / 2 + celestial.radius / 2;
}

/**
 * 
*/
function setLineDash(list) {
    drawingContext.setLineDash(list);
}

/**
 * Finds the direction vector between the celestial and the sun.
 * Tells us which direction the celestial is relative to the sun.
*/
function findDirectionVector(sun, celestial) {
    let r = p5.Vector.sub(sun.pos, celestial.pos);
    return r;
}

/**
 * Using the direction vector, we find its magnitude to represent the force of attraction between the celestial and the sun.
 * We apply newton's law of universal gravitation, F = G ((mass1 * mass2) / radius^2)
*/
function findMagnitudeOfForce(directionVector, sun, celestial) {
    let distance = directionVector.mag();
    distance = constrain(distance, 100, 10000) //Trying to prevent the bodies from being too close to the sun.
    let f = gravConstant * ((sun.mass * celestial.mass) / (distance * distance));
    return f;
}

/**
 * 
*/
function createForceVector(directionVector, magnitude) {
    directionVector.normalize();
    let force = directionVector.mult(magnitude);
    return force;
}

/**
 * 
*/
function updateCelestial(celestial, force) {
    let acceleration = p5.Vector.div(force, celestial.mass);

    acceleration.mult(timeScale);

    celestial.acc.add(acceleration);
    celestial.vel.add(celestial.acc);

    let scaledVelocity = p5.Vector.mult(celestial.vel, timeScale);

    celestial.pos.add(scaledVelocity);
    celestial.acc.mult(0);
}

/**
 * 
*/
function celestialTrail(celestial) {
    celestial.trail.push(celestial.pos.copy());

    if (celestial.trail.length > 100) {
        celestial.trail.shift();
    }

    push();
    noFill();
    strokeCap(ROUND);
    for (let i = 0; i < celestial.trail.length - 1; i++) {
        let posCurrent = celestial.trail[i];
        let posNext = celestial.trail[i + 1];
        let ratio = i / celestial.trail.length;
        let currentThicc = ratio * (celestial.mass / 2);
        let currentAlpha = ratio * 50;
        strokeWeight(currentThicc);
        stroke(255, 254, 215, currentAlpha);
        line(posCurrent.x, posCurrent.y, posNext.x, posNext.y);
    }
    pop();
}

/**
 * 
*/
function mousePressed() {
    //Start screen logic
    if (state === 'start') {
        state = 'play';

        userStartAudio();
        if (!music.isPlaying()) {
            music.loop();
        }

        let toSun = p5.Vector.sub(sun.pos, dotCelestial.pos);

        let rotationDirection = HALF_PI;
        let initialVel = toSun.copy().rotate(rotationDirection);

        let distance = toSun.mag();
        let orbitalSpeed = sqrt((gravConstant * sun.mass) / distance);

        initialVel.setMag(orbitalSpeed);
        dotCelestial.vel = initialVel;

        celestials.push(dotCelestial);

        return;
    }

    //Release Logic
    if (sun.isCaptured) {
        sun.isCaptured = false;
        return;
    }

    //Capture logic
    let capturedIndex = -1;

    for (let i = 0; i < celestials.length; i++) {
        if (canCapture(net, celestials[i])) {
            capturedIndex = i;
            break;
        }
    }

    if (capturedIndex != -1) {
        let captured = celestials[capturedIndex];

        sun.pos = captured.pos.copy();
        sun.mass = captured.mass * massMultiplier;
        sun.radius = captured.radius;
        sun.thicc = captured.thicc;
        sun.color = captured.color;
        sun.isCaptured = true;

        celestials.splice(capturedIndex, 1);
    }
}

/**
 * checks the collision between the net and the celestial.
 */
function canCapture(net, celestial) {
    return dist(net.pos.x, net.pos.y, celestial.pos.x, celestial.pos.y) < (net.radius + celestial.radius) / 2;
}

function spawnCelestial(sun, celestials) {
    if (frameCount % autoSpawnRate === 0) {
        celestials.push(createCelestial(sun))
    }
}

function updateSun(sun) {
    if (sun.isCaptured) {
        sun.pos.x = mouseX;
        sun.pos.y = mouseY;
    }
}

function superNova(sun, celestials) {
    let blastPower = sun.mass * 0.005;
    for (let celestial of celestials) {
        let blastDirection = p5.Vector.sub(celestial.pos, sun.pos);
        let distance = blastDirection.mag();
        blastDirection.normalize();
        let minBlast = blastPower / 20;
        let currentBlast = map(distance, 0, 600, blastPower, minBlast);
        currentBlast = constrain(currentBlast, minBlast, blastPower);
        blastDirection.mult(currentBlast);
        celestial.vel.add(blastDirection);
    }
}

function implosion(sun, celestials) {
    let blastPower = sun.mass * 0.005;
    for (let celestial of celestials) {
        let blastDirection = p5.Vector.sub(sun.pos, celestial.pos);
        let distance = blastDirection.mag();
        blastDirection.normalize();
        let minBlast = blastPower / 20;
        let currentBlast = map(distance, 0, 600, blastPower, minBlast);
        currentBlast = constrain(currentBlast, minBlast, blastPower);
        blastDirection.mult(currentBlast);
        celestial.vel.add(blastDirection);
    }
}

function triggerSuperNova(sun, celestials) {
    if (keyIsDown(81)) {
        superNova(sun, celestials);
    }
}

function triggerImplosion(sun, celestials) {
    if (keyIsDown(87)) {
        implosion(sun, celestials);
    }
}

function drawHUD(sun, celestials, net) {
    push();
    noStroke();
    fill(255);
    textSize(14);
    textFont('Helvetica');
    textAlign(LEFT, TOP);

    text("CURRENT SUN", 20, 20);

    textSize(12);
    text("Mass:     " + sun.mass.toFixed(2), 20, 40);
    text("Radius:   " + sun.radius.toFixed(2), 20, 55);
    pop();

    for (let celestial of celestials) {
        if (canCapture(net, celestial)) {
            let celestialMass = celestial.mass * 10;
            push();
            translate(mouseX + 15, mouseY);

            fill(0, 0, 0, 200);
            stroke(255);
            strokeWeight(1);
            rect(0, 0, 90, 50);

            noStroke();
            fill(255);
            textSize(12);
            textAlign(LEFT, TOP);
            textFont('Helvetica');

            text("Mass:   " + celestialMass.toFixed(2), 5, 10);
            text("Radius: " + celestial.radius.toFixed(2), 5, 30);
            pop();

            break;
        }
    }
}
/* 
function massMerge(sun, celestial) {
    if (sun.isCaptured && )
} */

function startScreen() {
    push();
    fill(255, 255, 255, titleAlpha);
    textSize(150);
    textFont('Montserrat');
    text("RBIT", (windowWidth / 2) + 110, (windowHeight / 2) + 90);
    pop();

    push();
    stroke(255, 255, 255, titleAlpha);
    strokeWeight(2);
    line(0, 600, windowWidth, 600);
    pop();

    if (state === 'start') {
        drawCelestial(dotCelestial);

        //Add start text
    }
}

function keyPressed() {
    if (key === 'e' || key === 'E') {
        if (targetTimeScale === 1) {
            targetTimeScale = 0;
        } else {
            targetTimeScale = 1;
        }
    }
}
function timeDialation() {
    timeScale = lerp(timeScale, targetTimeScale, timeRate)
    if (abs(timeScale - targetTimeScale) < 0.001) {
        timeScale = targetTimeScale;
    }
}
