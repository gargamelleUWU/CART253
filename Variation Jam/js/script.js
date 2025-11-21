/**
 * Variation Jam | Orbital Space
 * 
 * 
 */
let celestials = [];    //Array Which holds all our celestials
let gravConstant = 10;  //The constant force of Newtonian gravity
let springConstant = 0.000001;  //The spring force of Hooke gravity
const drag = 1;         //The air resistance in Hook gravity
let spawnRange = 200;   //How far away from the current sun Celestials can spawn
const massMultiplier = 10;      //Multipler for the mass when a celestial becomes a sun
const autoSpawnRate = 120;      //The rate at which celestials spawn in frames
const fadeSpeed = 3;    //The speed at which the title fades
const speedReducer = 0.5;   //Rate at which speed is reduced when triggered

let doYouBelieveInGravity = true;   //Toggle between Newton and Hooke gravity
let equalizer = false;

let timeScale = 1;          //The current scale of the time
let targetTimeScale = 1;    //The opposite scale of the time
let timeRate = 0.05;        //The rate at which time speeds up and slows down

let music;      //The soundtrack in the background
let filter;

let state = 'start';
let titleAlpha = 255;
let mode = "Newton";

let sun;
let net;
let dotCelestial;

/**
 * Loads assets for the program (only music)
 */
function preload() {
    soundFormats('wav');
    music = loadSound('assets/sounds/soundtrack.wav');
}

/**
 * Creates the canvas so that P5 can do its thing.
 * Setting up fields we want present from the very start of the program
*/
function setup() {
    createCanvas(windowWidth, windowHeight);
    music.setVolume(0.3);
    filter = new p5.LowPass();
    sun = createSun();
    net = createNet();
    createDotCelestial();
}

/**
 * Draw function which runs all the main functions that allows our code to work.
*/
function draw() {
    background(0);
    console.log(celestials);
/* 
    spawnStars();
    drawStarBabies(starPouponerie);
 */
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
        noCursor();

        updateNet(net);
        updateSun(sun)

        triggerSuperNova(sun, celestials);
        triggerImplosion(sun, celestials);
        greatEqualizer(celestials, triggerGreatEqualizer());

        drawNet(net);

        //Backwards loop for safe deletion
        for (let i = celestials.length - 1; i >= 0; i--) {
            let celestial = celestials[i];

            celestialTrail(celestial);
            drawCelestial(celestial);

            //Physics calculation
            let dirVec = findDirectionVector(sun, celestial);
            let forceMag = findMagnitudeOfForce(dirVec.copy(), sun, celestial);
            let forceVec = createForceVector(dirVec.copy(), forceMag);

            updateCelestial(celestial, forceVec);

            //Delete logic
            let bounds = 1000;
            if (celestial.pos.x < -bounds || celestial.pos.x > width + bounds ||
                celestial.pos.y < -bounds || celestial.pos.y > height + bounds) {
                celestial.offScreenTimer++;
            } else {
                celestial.offScreenTimer = 0;
            }
            if (celestial.offScreenTimer > 100) {
                celestials.splice(i, 1);
            }
        }
        drawHUD(sun, celestials, net);
    }
}

/**
 * Creating title screen dot celestial
 */
function createDotCelestial() {
    let xPos = (windowWidth / 2) + 351;
    let yPos = (windowHeight / 2) - 45;

    dotCelestial = {
        pos: createVector(xPos, yPos),
        vel: createVector(0, 0),
        acc: createVector(0, 0),
        mass: 15,
        radius: 0,
        finalRadius: 30,
        thicc: 3,
        trail: [],
        color: "#FFFFFF",
        offScreenTimer: 0,
    };
}

/**
 * Creates our net object, which is used to capture new suns
 */
function createNet() {
    net = {
        pos: createVector(mouseX, mouseY),
        radius: 50,
    }
    return net;
}

/**
 * Creating our initial sun object
*/
function createSun() {
    let sun = {
        pos: createVector(windowWidth / 2, windowHeight / 2),
        mass: 100,
        radius: 200,
        thicc: 2,
        isCaptured: false,
        color: "#ffd7d7ff",
    }
    return sun;
}

/**
 * Factory that produces our celestials
*/
function createCelestial(sun) {
    let palette = ['#f3c257ff', '#f8cf81ff', "#ffe77eff", '#ffe388ff', '#fffeaeff'];
    //['#ffb7b7ff', '#b0efffff', "#f0c1ffff", '#a7ffaeff', '#fffeaeff']

    let startPos = createVector(    //Spawns the celestial relatively to our current sun
        random((sun.pos.x - sun.radius) - spawnRange, (sun.pos.x + sun.radius) + spawnRange),
        random((sun.pos.y - sun.radius) - spawnRange, (sun.pos.y + sun.radius) + spawnRange));

    let toSun = p5.Vector.sub(sun.pos, startPos);   //Finds the directional vector from the celestial to the sun
    let rotationDirection = random() < 0.5 ? HALF_PI : -HALF_PI;    //Rotating the vector 90 degrees to have our celestials in good orbit by default
    let initialVel = toSun.copy().rotate(rotationDirection);    //Applying the rotation

    let distance = toSun.mag(); //Finds the distance between celestial and sun
    let orbitalSpeed = calculateOrbitalSpeed(distance); //Finds the orbital speed for celestial
    initialVel.setMag(orbitalSpeed);    //Sets the initial velocity using orbital speed

    let celestial = {
        pos: startPos,
        vel: initialVel,
        acc: createVector(0, 0),
        mass: random(1, 30),
        radius: 0,
        finalRadius: random(10, 50),
        thicc: random(1, 5),
        trail: [],
        color: random(palette),
        offScreenTimer: 0,
    }
    return celestial;
}

/**
 * 
 */
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
    celestial.radius = lerp(celestial.radius, celestial.finalRadius, 0.1);

    push();
    fill(0);
    strokeWeight(celestial.thicc);
    stroke(celestial.color);
    circle(celestial.pos.x, celestial.pos.y, celestial.radius);
    pop();
}

/**
 * 
 */
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
function updateCelestial(celestial, force) {
    if (!equalizer) {
    let acceleration = p5.Vector.div(force, celestial.mass);

    acceleration.mult(timeScale);

    celestial.acc.add(acceleration);
    celestial.vel.add(celestial.acc);

    let scaledVelocity = p5.Vector.mult(celestial.vel, timeScale);

    celestial.pos.add(scaledVelocity);
    celestial.acc.mult(0);
    }
}

/**
 * 
 */
function updateSun(sun) {
    if (sun.isCaptured) {
        sun.pos.x = mouseX;
        sun.pos.y = mouseY;
    }
}

/**
 * 
 */
function spawnCelestial(sun, celestials) {
    if (frameCount % autoSpawnRate === 0) {
        celestials.push(createCelestial(sun))
    }
}

/**
 * checks the collision between the net and the celestial.
 */
function canCapture(net, celestial) {
    return dist(net.pos.x, net.pos.y, celestial.pos.x, celestial.pos.y) < (net.radius + celestial.radius) / 2;
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
function triggerSuperNova(sun, celestials) {
    if (keyIsDown(81)) {
        superNova(sun, celestials);
    }
}

/**
 * 
 */
function triggerImplosion(sun, celestials) {
    if (keyIsDown(87)) {
        implosion(sun, celestials);
    }
}

function triggerGreatEqualizer(celestials) {
    if (keyIsDown(84)) {
        equalizer = true;
    } else {
        equalizer = false;
    }

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
    let f;
    let distance = directionVector.mag();
    
    if (doYouBelieveInGravity === true) {
        distance = constrain(distance, 100, 10000) //Trying to prevent the bodies from being too close to the sun.
        f = gravConstant * ((sun.mass * celestial.mass) / (distance * distance));
    } else {
        f = springConstant * (sun.mass * celestial.mass * distance);
        f = constrain(f, 0, 50);
    }
    return f;
}

/**
 * 
*/
function createForceVector(directionVector, magnitude) {
    directionVector.normalize();
    return directionVector.mult(magnitude);
}

/**
 * 
 */
function calculateOrbitalSpeed(distance) {
    if (doYouBelieveInGravity === true) {
        return sqrt((gravConstant * sun.mass) / distance); 
    } else {
        return distance * sqrt((springConstant * sun.mass));
    }
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
    strokeCap(SQUARE);

    let trailColor = color(celestial.color);
    for (let i = 0; i < celestial.trail.length - 1; i++) {
        let posCurrent = celestial.trail[i];
        let posNext = celestial.trail[i + 1];
        let ratio = i / celestial.trail.length;
        let currentThicc = ratio * (celestial.mass / 2);
        let currentAlpha = ratio * 125;

        trailColor.setAlpha(currentAlpha);
        strokeWeight(currentThicc);
        stroke(trailColor);
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
 * 
 */
function keyPressed() {
    if (key === 'e' || key === 'E') {
        if (targetTimeScale === 1) {
            applySoundFilter(music, filter);
            targetTimeScale = 0;
        } else {
            targetTimeScale = 1;
            removeSoundFilter(music, filter);
        }
    }

    if (key === 'r' || key === 'R') {
        if (doYouBelieveInGravity === false) {
            mode = "Newton";
            doYouBelieveInGravity = true;
        } else {
            mode = "Hooke";
            doYouBelieveInGravity = false;
        }
        convertVeolcities(sun, celestials);
    }
}

/**
 * 
 */
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

/**
 * 
 */
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

/**
 * 
 */
function drawHUD(sun, celestials, net) {
    push();
    noStroke();
    fill(255);
    textSize(14);
    textFont('Helvetica');
    textAlign(LEFT, TOP);

    text("CURRENT SUN", 20, 20);

    textSize(12);
    text("Mass:             " + sun.mass.toFixed(2), 20, 40);
    text("Radius:           " + sun.radius.toFixed(2), 20, 55);
    text("Mode:             " + mode, 20, 70);
    text("____________________", 20, 85);
    text("Press 'Q' | Supernova", 20, 100);
    text("Press 'W' | Implode", 20, 115);
    text("Press 'E' | Dilate Time",20, 130);
    text("Press 'R' | Mode Switch", 20, 145);
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
            text("Speed:  " + celestial.vel.mag().toFixed(2), 5, 30);
            pop();

            break;
        }
    }
}

/**
 * 
 */
function startScreen() {
    push();
    fill(255, 255, 255, titleAlpha);
    textSize(150);
    textFont('Montserrat');
    text("RBIT", (windowWidth / 2) + 110, (windowHeight / 2) + 90);
    pop();

    push();
    noFill();
    stroke(255, 255, 255, titleAlpha);
    strokeWeight(2);
    let startY = windowHeight / 2 + 50;
    let bottomY = windowHeight - 50;
    bezier(0, startY, windowWidth * 0.3, bottomY, windowWidth * 0.7, bottomY, windowWidth, startY);
    pop();
    if (state === 'start') {
        drawCelestial(dotCelestial);
        //Add start text
    }
}

function timeDialation() {
    timeScale = lerp(timeScale, targetTimeScale, timeRate)
    if (abs(timeScale - targetTimeScale) < 0.001) {
        timeScale = targetTimeScale;
    }
}

/**
 * 
 */
function applySoundFilter(music, filter) {
    music.disconnect();
    music.connect(filter);
    filter.set(400, 4);
}

/**
 * 
 */
function removeSoundFilter(music, filter) {
    music.disconnect();
    music.connect();
}

/**
 * 
 */
function convertVeolcities(sun, celestials) {
    for (let celestial of celestials) {
        let toSun = p5.Vector.sub(sun.pos, celestial.pos);
        let distance = toSun.mag();
        let currentDir = celestial.vel.copy().normalize();
        
        let newSpeed;

        if (doYouBelieveInGravity === true) {A
            newSpeed = sqrt((gravConstant * sun.mass) / distance);
            
        } else {
            newSpeed = distance * sqrt(springConstant * sun.mass);
        }
        celestial.vel = currentDir.mult(newSpeed);
        celestial.acc.mult(0); 
    }
}

function greatEqualizer(celestials, equalizer) {
    if (equalizer) {
    for (let celestial of celestials) {
        celestial.vel -= speedReducer;
    }
}
}