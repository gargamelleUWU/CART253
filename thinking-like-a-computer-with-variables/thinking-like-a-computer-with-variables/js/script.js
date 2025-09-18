let currentColor, targetColor;
let amt = 0;
//let shapeType = 'traingle';

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(30);

    currentColor = color(random(255), random(255), random(255));
    targetColor = color(random(255), random(255), random(255));
}

function draw() {
    Z = random(1,1.1);
    W = random(1, 1.1);
    let blended = lerpColor(currentColor, targetColor, amt);

    fill(blended);
    noStroke();
    let X = map(sin(frameCount*0.05 + PI/2), 1, -1, 0, width)
    let Y = map(cos(frameCount*0.003 + PI/2), 1, -1, 0, height)
    ellipse(X, Y, 75, 75);

    amt += 0.02;

    if (amt >= 1) {
        currentColor = targetColor;
        targetColor = color(random(255), random(255), random(255));
        amt = 0;
    }
}

function mousePressed() {
    background(30);

    currentColor = color(random(255), random(255), random(255));
    targetColor = color(random(255), random(255), random(255));
    amt = 0;
}

/*
function keyPressed() {
    if (key === 'Q' || key === 'q') {
        shapeType = 'ellipse';
    } else if (key === 'W' || key === 'w') {
        shapeType = 'rect';
    } else if (key === 'E' || key === 'e') {
        shapeType = 'triangle';
    }
} 
    */