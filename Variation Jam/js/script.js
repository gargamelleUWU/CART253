/**
 * Variation Jam | Orbital Space
 * 
 * 
 */

let celestials = [];
let gravConstant = 100;
let spawnRange = 200;

/**
 * 
*/
function setup() {
    createCanvas(windowWidth, windowHeight);
}

/**
 * 
*/
function draw() {
    let sun = createSun();

    background(0);
    drawSun(sun);

    for (let celestial of celestials) {
        celestialTrail(celestial);
        drawCelestial(celestial);
        let dirVec = findDirectionVector(sun, celestial);
        let forceMag = findMagnitudeOfForce(dirVec.copy(), sun, celestial);
        let forceVec = createForceVector(dirVec.copy(), forceMag);
        updateCelestial(celestial, forceVec);
    }
}

/**
 * 
*/
function createSun() {
    let sun = {
        pos: createVector(mouseX, mouseY),
        mass: 100,
        radius: 100,
        thicc: 2,
    }
    return sun;
}

/**
 * 
*/
function createCelestial(sun) {
    let startPos = createVector(random((mouseX - sun.radius) - spawnRange, (mouseX + sun.radius) + spawnRange), random((mouseY - sun.radius) - spawnRange, (mouseY + sun.radius) + spawnRange));
    let toSun = p5.Vector.sub(sun.pos, startPos);

    let rotationDirection = random() < 0.5 ? HALF_PI : -HALF_PI;
    let initialVel = toSun.copy().rotate(rotationDirection);

    let distance = toSun.mag();
    let orbitalSpeed = sqrt((gravConstant * sun.mass) / distance);

    initialVel.setMag(orbitalSpeed);

    let celestial = {
        pos: startPos,
        vel: initialVel,
        acc: createVector(1, 1),
        mass: random(1, 20),
        radius: random(10, 50),
        thicc: random(1, 5),
        trail: [],
    }
    return celestial;
}

/**
 * 
*/
function drawSun(sun) {
    sun.pos.x = mouseX;
    sun.pos.y = mouseY;

    push();
    noFill();
    strokeWeight(sun.thicc);
    stroke("#FFFFFF");
    setLineDash([2, 11]);
    circle(sun.pos.x, sun.pos.y, sun.radius);
    pop();
}

/**
 * 
*/
function drawCelestial(celestial) {
    push();
    fill(0);
    strokeWeight(celestial.thicc);
    stroke("#fffeaeff");
    circle(celestial.pos.x, celestial.pos.y, celestial.radius);
    pop();

    push();
    stroke("#FFFFFF");
    line(celestial.pos.x, celestial.pos.y, celestial.pos.x + celestial.vel.x * 10, celestial.pos.y + celestial.vel.y * 10);
    pop();
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
    let currentSun = createSun();

    celestials.push(createCelestial(currentSun));
}