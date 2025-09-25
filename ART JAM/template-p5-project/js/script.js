
    
/*      let celestial;
        let gravitySize = 300;
    
    //Sets up a canvas on which P5 elements can be created
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(20,20,20);

    celestial = {
        x: width / 2,
        y: height / 2,
        size: 10,
        color: color(255,255,255),
        vX: 0,
        vY: 0,
    };
}

//draw function where all the good stuff happens!
function draw() {
    background(20,20,20);

    fill(255,255,255, 10);
    noStroke();
    circle(mouseX, mouseY, gravitySize);

    userGravity();

    updateCelestial();
    fill(celestial.color);
    circle(celestial.x, celestial.y, celestial.size);
}

function userGravity() {
    let dX = celestial.x - mouseX;
    let dY = celestial.y - mouseY;
    let distance = dist(mouseX, mouseY, celestial.x, celestial.y);
    let totalRadius = (celestial.size + gravitySize) / 2;

    if (distance < totalRadius) {
        let resistance = 50;
        if (mouseIsPressed) {
            celestial.vX += dX / resistance;
            celestial.vY += dY / resistance;
        } else {
            celestial.vX -= dX / resistance;
            celestial.vY -= dY / resistance;
        }
    }
}

function updateCelestial() {
    celestial.x += celestial.vX;
    celestial.y += celestial.vY;

    let drag = 0.97;
    celestial.vX *= drag;
    celestial.vY *= drag;

    let radius = celestial.size/2;

    if (celestial.x >= width - radius || celestial.x <= radius)
        celestial.vX *= -1;
    if (celestial.y>= height - radius || celestial.y <= radius)
        celestial.vY *= -1;
}
    */
let celestial;
        let gravitySize = 300;
    
    //Sets up a canvas on which P5 elements can be created
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(20,20,20);

    celestial = {
        x: width / 2,
        y: height / 2,
        size: 10,
        color: color(255,255,255),
        vX: 0,
        vY: 0,
    };
}

//draw function where all the good stuff happens!
function draw() {
    background(20,20,20);

    fill(255,255,255, 10);
    noStroke();
    circle(mouseX, mouseY, gravitySize);

    userGravity();

    updateCelestial();
    fill(celestial.color);
    circle(celestial.x, celestial.y, celestial.size);
}

function userGravity() {
    let dX = celestial.x - mouseX;
    let dY = celestial.y - mouseY;
    let distance = dist(mouseX, mouseY, celestial.x, celestial.y);
    let totalRadius = (celestial.size + gravitySize) / 2;

    if (distance < totalRadius) {
        let resistance = 50;
        if (mouseIsPressed) {
            celestial.vX += dX / resistance;
            celestial.vY += dY / resistance;
        } else {
            celestial.vX -= dX / resistance;
            celestial.vY -= dY / resistance;
        }
    }

        angle = atan2(dY, dX);
    console.log(angle)
}

function updateCelestial() {
    celestial.x += celestial.vX;
    celestial.y += celestial.vY;

    let drag = 0.97;
    celestial.vX *= drag;
    celestial.vY *= drag;

    let radius = celestial.size/2;

    if (celestial.x >= width - radius || celestial.x <= radius)
        celestial.vX *= -1;
    if (celestial.y>= height - radius || celestial.y <= radius)
        celestial.vY *= -1;
}
