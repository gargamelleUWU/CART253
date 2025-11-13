/**
 * Lines
 * Pippin Barr
 * 
 * A series of lines across the canvas
 */

"use strict";

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(500, 500);
}

function draw() {
    background("#fab9b9ff");

    let startColor = color("#ff0000ff");
    let endColor = color("#3c3292ff");
    let hoveredX = round(mouseX);
    let hoverColor = lerpColor(endColor, startColor, mouseY / height);


    for (let x = 0; x < width; x++) {

        if (x === hoveredX) {
            stroke(hoverColor)
        } else {
            let grad = lerpColor(startColor, endColor, x / width);
            stroke(grad);
        }

        line(x, 0, x, height);
    }
}
