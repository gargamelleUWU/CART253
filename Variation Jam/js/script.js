/**
 * Variation Jam | Orbital Space
 * 
 * 
 */

let celestials = [];
let gravConstant = 10;
let spawnRange = 200;
let blastPower = 0.00001;
const massMultiplier = 10;
const autoSpawnRate = 120;

let sun;
let net;

/**
 * Creates the canvas so that P5 can do its thing.
*/
function setup() {
    createCanvas(windowWidth, windowHeight);

    sun = createSun();
    net = createNet();
}

/**
 * Draw function which runs all the main functions that allows our code to work.
*/
function draw() {
    background(0);

    spawnCelestial(sun, celestials);

    updateNet(net);
    updateSun(sun)

    triggerSuperNova(sun, celestials);

    drawSun(sun);
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
        radius: 100,
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
        mass: random(1, 20),
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
    push();
    stroke("#FFFFFF");
    line(celestial.pos.x, celestial.pos.y, celestial.pos.x + celestial.vel.x * 10, celestial.pos.y + celestial.vel.y * 10);
    pop();
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

    celestial.acc.add(acceleration);
    celestial.vel.add(celestial.acc);
    celestial.pos.add(celestial.vel);
    celestial.acc.mult(0);
}

/**
 * 
*/
function celestialTrail(celestial) {
    celestial.trail.push(celestial.pos.copy());

    if (celestial.trail.length > 60) {
        celestial.trail.shift();
    }

    push();
    noFill();
    stroke(255, 254, 215, 80);
    strokeWeight(2);
    beginShape();
    for (let v of celestial.trail) {
        vertex(v.x, v.y);
    }
    endShape();
    pop();
}

/**
 * 
*/
function mousePressed() {
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
    for (let celestial of celestials) {
        let blastDirection = p5.Vector.sub(celestial.pos, sun.pos);
        let distance = blastDirection.mag();
        blastDirection.normalize();

        let currentBlast = map(distance, 0, 600, 5, 0.5);
        currentBlast = constrain(currentBlast, 1, 20);
        blastDirection.mult(currentBlast);
        celestial.vel.add(blastDirection);
    }
}

function triggerSuperNova(sun, celestials) {
    if (keyIsDown(32)) {
        superNova(sun, celestials);
    }
}
