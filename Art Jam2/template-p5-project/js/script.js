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
        color: color(10,10,10,250)
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

    pull();
}

// Function to create a curtain that can block our shy little guy
function pull() {
    let pullBackRate = 0.2;

    hover = mouseX <= curtain.w;
    if (hover) {
        fill(50)
        if (mouseIsPressed) {
            curtain.w += movedX;
            pullBackRate = 0;
        }
    }

    curtain.w -= pullBackRate;
    curtain.w = constrain(curtain.w, width/10, width);
}



