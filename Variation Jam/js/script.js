/**
 * Variation Jam | Orbital Space
 * 
 * 
 */

let celestials = [];
let gravConstant = 1;
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
function createCelestial() {
    let celestial = {
        pos: createVector(random(mouseX - spawnRange, mouseX + spawnRange), random(mouseY - spawnRange, mouseY + spawnRange)),
        vel: createVector(mouseX, mouseY),
        acc: createVectore(1, 1),
        mass: random(1, 20),
        radius: random(10, 20),
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
    setLineDash([2, 12]);
    circle(sun.pos.x, sun.pos.y, sun.radius);
    pop();
}

/**
 * 
*/
function drawCelestial() {
    push();
    fill(0);
    strokeWeight(celestial.thicc);
    stroke("#fffeaeff");
    circle(celestial.pos.x, celestial.pos.y, celestial.radius);
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
 * 
*/
function mousePressed() {
    celestials.push(createCelestial());
}

/**
 * Finds the direction vector between the celestial and the sun.
 * Tells us which direction the celestial is relative to the sun.
*/
function findDirectionVector(sun, celestial) {
    let r = p5.vector.sub(sun.pos, celestial.pos);
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
function createForceVector(directionVector, force) {
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
function celestialTrail() {

}

/**
 * 
*/
function mousePressed() {
    celestials.push(createCelestial());
}