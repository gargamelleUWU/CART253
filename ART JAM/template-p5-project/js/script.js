function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
}

let celestial = {
    x: undefined,
    y: undefined,
    color: undefined,
    radius: undefined,
    size: 100,
    vX: 0,
    vY: 0
};

let gravity = {
    x: undefined,
    y: undefined,
    color: undefined,
    size: 200
};

function setupCelestial() {
    celestial.x = width / 2;
    celestial.y = height / 2;
    celestial.color = color(255,255,255);
    celestial.radius = celestial.size/2;
}

function setupGravity() {
    gravity.x = mouseX;
    gravity.y = mouseY;
    gravity.color = color(30,30,30);
}

function drawCelestial() {
    fill(celestial.color);
    circle(celestial.x, celestial.y, celestial.size);
}

function drawGravity() {
    fill(gravity.color);
    circle(gravity.x, gravity.y, gravity.size);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0,0,0);
    setupCelestial();
}


function draw() {
    background(0,0,0);
    setupGravity();
    drawGravity();
    drawCelestial();
    pull();
    updateCelestial();

}

function pull() {
    let distance = dist(mouseX, mouseY, celestial.x, celestial.y);
    let totalRadius = (celestial.size + gravity.size)/2;
    let dX = celestial.x - gravity.x;
    let dY = celestial.y - gravity.y;
    let polarity = keyIsPressed;

    if (distance < totalRadius && !polarity) {
        let resistance = 150;
        celestial.vX -= dX / resistance;
        celestial.vY -= dY / resistance;
    } else if (distance < totalRadius && polarity) {
        let resistance = 150;
        celestial.vX += dX / resistance;
        celestial.vY += dY / resistance;
    }
}

function updateCelestial() {
    celestial.x += celestial.vX;
    celestial.y += celestial.vY;

    let drag = 0.95;
    celestial.vX *= drag;
    celestial.vY *= drag;

    if (celestial.x >= width-(celestial.radius) || celestial.x <= (celestial.radius)) {
        celestial.vX *= -1;
    }
    if (celestial.y >= height-(celestial.radius) || celestial.y <= (celestial.radius)) {
        celestial.vY *= -1;
    }
    console.log(drag, celestial.vX, celestial.vY)
}