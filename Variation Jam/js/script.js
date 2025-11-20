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
        radius: 200,
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
        history: [],
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

}

/**
 * 
*/
function findDirectionVector(sun, celestial) {

}

/**
 * 
*/
function findMagnitudeOfForce() {

}

/**
 * 
*/
function createForceVector() {

}

/**
 * 
*/
function updateCelestial() {

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