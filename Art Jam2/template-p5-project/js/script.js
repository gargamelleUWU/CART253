let curtain;
let shyGuy;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);

curtain = {
        x: 0,
        y: 0,
        w: width/10,
        h: height,
        color: color(10,10,10,250),
    }

shyGuy = {
    x: width / 2,
    y: height / 2,
    size: 200,
    color: ("#123f52"),
    }

}

function draw() {
    background(255);

    fill(shyGuy.color);
    noStroke();
    circle(shyGuy.x, shyGuy.y, shyGuy.size);

    fill(curtain.color);
    rect(curtain.x, curtain.y, curtain.w, curtain.h);

    // keepPulling();
    pull();
    moveGuy();
   
}

// Function to create a curtain that can block our shy little guy
function pull() {
    let pullBackRate = 0.3;

    let hover = mouseX <= curtain.w;
    if (hover) {
        curtain.color = color(25,25,25,250)
        if (mouseIsPressed) {
            curtain.w += movedX;
            pullBackRate = 0;
        }
    } else {     curtain.color = color(10,10,10,250) }
    curtain.w -= pullBackRate;
    curtain.w = constrain(curtain.w, width/10, width);
}

function moveGuy() {
    let radius = shyGuy.size / 2;
    let distance = dist(mouseX, mouseY, shyGuy.x, shyGuy.y);
    let touching = distance < radius;

    if (touching && mouseIsPressed) {
        shyGuy.x = mouseX;
        shyGuy.y = mouseY;
    }
}

/*
function keepPulling() {
    let radius = shyGuy.size/2;
    let covered = dist(curtain.w, height/2, shyGuy.x, shyGuy.y)
    let isCovered = covered < radius;
    console.log(covered, isCovered);

    if (isCovered && (covered > 90 && covered < 100)) {
        pullBackRate = 0;
        curtain.w ++;
    }
        */


