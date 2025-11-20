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
    }
}

/**
 * 
*/
function createCelestial() {

}

/**
 * 
*/
function drawSun() {

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