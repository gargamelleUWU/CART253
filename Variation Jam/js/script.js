/**
 * Variation Jam | Orbital Space
 * adadadaddaddad
 */
let celestials = [];    //Array Which holds all our celestials
let starArray = [];
let gravConstant = 10;  //The constant force of Newtonian gravity
let springConstant = 0.000001;  //The spring force of Hooke gravity
let drag = 1;           //The air resistance in Hook gravity
let spawnRange = 200;   //How far away from the current sun Celestials can spawn
const massMultiplier = 10;      //Multipler for the mass when a celestial becomes a sun
const autoSpawnRate = 120;      //The rate at which celestials spawn in frames
const fadeSpeed = 3;    //The speed at which the title fades
let bumpPower = 2;
let resistance = 1;
let numberStars = 70;
let dissolveRate = 2;
let heatMultiplier = 0.1;

let isNova = false;
let isImplode = false;
let doYouBelieveInGravity = true;   //Toggle between Newton and Hooke gravity
let canSpawn = true;
let canCollide = false;
let interGravity = false;
let isDissolving = false;
let timeScale = 1;          //The current scale of the time
let targetTimeScale = 1;    //The opposite scale of the time
let timeRate = 0.05;        //The rate at which time speeds up and slows down

let music;      //The soundtrack in the background
let filter;

let state = 'start';
let titleAlpha = 255;
let mode = "Newton";

let sun;
let net;
let dotCelestial;
let ghostSun = null;
let planetData;

/**
 * Loads assets for the program (only music)
 */
function preload() {
    soundFormats('wav');
    music = loadSound('assets/sounds/soundtrack.wav');
    planetData = loadJSON('data/planets.json');
}

/**
 * Creates the canvas so that P5 can do its thing.
 * Setting up fields we want present from the very start of the program
*/
function setup() {
    createCanvas(windowWidth, windowHeight);
    document.oncontextmenu = function () {
        return false;
    }

    music.setVolume(0.3);
    filter = new p5.LowPass();

    music.disconnect();
    music.connect(filter);

    filter.freq(22050);
    filter.res(0);

    starArray = createStarBabies(numberStars);
    sun = createSun();
    net = createNet();
    createDotCelestial();
}

/**
 * Draw function which runs all the main functions that allows our code to work.
*/
function draw() {
    background(0);
    drawStarBabies(starArray);
    //updateStarBabies(starArray);

    drawGhostSun(ghostSun);

    timeDialation();
    drawSun(sun);

    if (titleAlpha > 0) {
        startScreen();
    }
    if (state === 'play') {
        if (titleAlpha > 0) {
            titleAlpha -= fadeSpeed;
        }
        if (targetTimeScale === 1 && canSpawn) {
            spawnCelestial(sun, celestials);
        }
        noCursor();

        updateNet(net);
        updateSun(sun);

        checkSunCollision(sun, celestials);
        celestialCollision(celestials);
        applyInterplanetaryGravity(celestials);
        dissolveCelstial(celestials);
        handleFusion(celestials);
        applyHeat(celestials);
        celestialIsTooHot(celestials);

        triggerSuperNova(sun, celestials);
        triggerImplosion(sun, celestials);

        drawNet(net);

        //Backwards loop for safe deletion
        for (let i = celestials.length - 1; i >= 0; i--) {
            let celestial = celestials[i];

            celestialTrail(celestial);
            drawCelestial(celestial);

            //Physics calculation
            let dirVec = findDirectionVector(sun, celestial);
            let forceMag = findMagnitudeOfForce(dirVec.copy(), sun, celestial);
            let forceVec = createForceVector(dirVec.copy(), forceMag);

            updateCelestial(celestial, forceVec);

            //Delete logic
            let bounds = 1000;
            if (celestial.pos.x < -bounds || celestial.pos.x > width + bounds ||
                celestial.pos.y < -bounds || celestial.pos.y > height + bounds) {
                celestial.offScreenTimer++;
            } else {
                celestial.offScreenTimer = 0;
            }
            if (celestial.offScreenTimer > 100) {
                celestials.splice(i, 1);
            }
        }
        drawHUD(sun, celestials, net);
    }
}

/**
 * Creating title screen dot celestial
 */
function createDotCelestial() {
    let xPos = (windowWidth / 2) + 351;
    let yPos = (windowHeight / 2) - 45;

    dotCelestial = {
        pos: createVector(xPos, yPos),
        vel: createVector(0, 0),
        acc: createVector(0, 0),
        mass: 15,
        name: "Xirnus",
        radius: 0,
        finalRadius: 30,
        thicc: 3,
        trail: [],
        color: "#FFFFFF",
        offScreenTimer: 0,
        heat: 0,
        fillOpacity: 255,
        maxHeat: random(150, 500),
        type: "COLD",
    };
}

/**
 * Creates our net object, which is used to capture new suns
 */
function createNet() {
    net = {
        pos: createVector(mouseX, mouseY),
        radius: 50,
    }
    return net;
}

/**
 * Creating our initial sun object
*/
function createSun() {
    let sun = {
        pos: createVector(windowWidth / 2, windowHeight / 2),
        mass: 100,
        radius: 200,
        thicc: 2,
        name: "Sol",
        isCaptured: false,
        color: "#ffffffff",
        type: "NEUTRAL",
    }
    return sun;
}

/**
 * Factory that produces our celestials
*/
function createCelestial(sun) {
    let hotOrCold = random() > 0.5;
    let type = hotOrCold ? "HOT" : "COLD";
    let palette = [color(243, 194, 87, 255),
    color(248, 207, 129, 255),
    color(255, 231, 126, 255),
    color(255, 227, 136, 255),
    color(255, 254, 174, 255),];
    //['#ffb7b7ff', '#b0efffff', "#f0c1ffff", '#a7ffaeff', '#fffeaeff']
    //'#f3c257ff', '#f8cf81ff', "#ffe77eff", '#ffe388ff', '#fffeaeff'

    let startPos = createVector(    //Spawns the celestial relatively to our current sun
        random((sun.pos.x - sun.radius) - spawnRange, (sun.pos.x + sun.radius) + spawnRange),
        random((sun.pos.y - sun.radius) - spawnRange, (sun.pos.y + sun.radius) + spawnRange));

    let toSun = p5.Vector.sub(sun.pos, startPos);   //Finds the directional vector from the celestial to the sun
    let rotationDirection = random() < 0.5 ? HALF_PI : -HALF_PI;    //Rotating the vector 90 degrees to have our celestials in good orbit by default
    let initialVel = toSun.copy().rotate(rotationDirection);    //Applying the rotation

    let distance = toSun.mag(); //Finds the distance between celestial and sun
    let orbitalSpeed = calculateOrbitalSpeed(distance); //Finds the orbital speed for celestial
    initialVel.setMag(orbitalSpeed);    //Sets the initial velocity using orbital speed

    let celestial = {
        pos: startPos,
        vel: initialVel,
        acc: createVector(0, 0),
        mass: random(1, 30),
        name: random(planetData.names),
        radius: 0,
        finalRadius: random(10, 50),
        thicc: random(1, 5),
        trail: [],
        color: random(palette),
        offScreenTimer: 0,
        isMagnetized: false,
        magnetTarget: null,
        heat: 0,
        fillOpacity: 255,
        maxHeat: random(150, 500),
        type: type,
    };
    return celestial;
}

/**
 * 
 */
function drawNet(net) {
    push();
    noFill();
    strokeWeight(2);
    stroke("#FFFFFF");
    setLineDash([2, 10]);
    circle(net.pos.x, net.pos.y, net.radius);
    pop();
}

/**
 * 
*/
function drawSun(sun) {
    if (sun.isCaptured) {
        push();
        fill(0);
        strokeWeight(sun.thicc);
        stroke(sun.color);
        circle(sun.pos.x, sun.pos.y, sun.radius);
        pop();
    } else {
        push();
        fill(0);
        strokeWeight(sun.thicc);
        if (sun.type === "HOT") {
            stroke("#ffd390ff");
        } else if (sun.type === "COLD") {
            stroke("#90fff0ff");
        } else {
            stroke("#FFFFFF");
        }
        circle(sun.pos.x, sun.pos.y, sun.radius);
        pop();
    }
}

/**
 * 
*/
function drawCelestial(celestial) {
    celestial.radius = lerp(celestial.radius, celestial.finalRadius, 0.1);

    let hotColor = color(255, 255, 255);
    let heatRatio = map(celestial.heat, celestial.maxHeat * 0.5, celestial.maxHeat, 0, 1);
    heatRatio = constrain(heatRatio, 0, 1);
    let baseColor = color(celestial.color);
    if (celestial.type === "HOT") {
        hotColor = color(255, 50, 50);
    } else {
        hotColor = color(0, 175, 255);
    }
    let calculatedColor = lerpColor(baseColor, hotColor, heatRatio);

    celestial.displayColor = calculatedColor;

    calculatedColor.setAlpha(celestial.fillOpacity);

    push();
    fill(0, 0, 0, celestial.fillOpacity);
    strokeWeight(celestial.thicc);
    stroke(calculatedColor);
    circle(celestial.pos.x, celestial.pos.y, celestial.radius);
    pop();
}

/**
 * 
 */
function updateNet(net) {
    if (sun.isCaptured) {
        net.radius = sun.radius + 10;
    } else {
        net.radius = 50;
    }
    net.pos.x = mouseX;
    net.pos.y = mouseY;
    return net;
}

/**
 * 
*/
function updateCelestial(celestial, force) {
    let acceleration = p5.Vector.div(force, celestial.mass);

    acceleration.mult(timeScale);

    celestial.acc.add(acceleration);
    celestial.vel.add(celestial.acc);

    let scaledVelocity = p5.Vector.mult(celestial.vel, timeScale);

    celestial.pos.add(scaledVelocity);
    celestial.acc.mult(0);
}

/**
 * 
 */
function updateSun(sun) {
    if (sun.isCaptured) {
        sun.pos.x = mouseX;
        sun.pos.y = mouseY;
    }
}

/**
 * 
 */
function spawnCelestial(sun, celestials) {
    if (frameCount % autoSpawnRate === 0) {
        celestials.push(createCelestial(sun))
    }
}

/**
 * checks the collision between the net and the celestial.
 */
function canCapture(net, celestial) {
    return dist(net.pos.x, net.pos.y, celestial.pos.x, celestial.pos.y) < (net.radius + celestial.radius) / 2;
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
function triggerSuperNova(sun, celestials) {
    if (keyIsDown(81)) {
        isNova = true;
        superNova(sun, celestials);
    } else {
        isNova = false;
    }
}

/**
 * 
 */
function triggerImplosion(sun, celestials) {
    if (keyIsDown(87)) {
        isImplode = true;
        implosion(sun, celestials);
    } else {
        isImplode = false;
    }
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
    let f;
    let distance = directionVector.mag();

    if (doYouBelieveInGravity === true) {
        distance = constrain(distance, 100, 10000) //Trying to prevent the bodies from being too close to the sun.
        f = gravConstant * ((sun.mass * celestial.mass) / (distance * distance));
    } else {
        f = springConstant * (sun.mass * celestial.mass * distance);
        f = constrain(f, 0, 50);
    }
    return f;
}

/**
 * 
*/
function createForceVector(directionVector, magnitude) {
    directionVector.normalize();
    return directionVector.mult(magnitude);
}

/**
 * 
 */
function calculateOrbitalSpeed(distance) {
    if (doYouBelieveInGravity === true) {
        return sqrt((gravConstant * sun.mass) / distance);
    } else {
        return distance * sqrt((springConstant * sun.mass));
    }
}

/**
 * 
*/
function celestialTrail(celestial) {
    celestial.trail.push(celestial.pos.copy());

    if (celestial.trail.length > 100) {
        celestial.trail.shift();
    }
    push();
    noFill();
    strokeCap(SQUARE);

    let trailColor;

    if (celestial.displayColor) {
        trailColor = color(celestial.displayColor);
    } else {
        trailColor = color(celestial.color);
    }

    for (let i = 0; i < celestial.trail.length - 1; i++) {
        let posCurrent = celestial.trail[i];
        let posNext = celestial.trail[i + 1];
        let ratio = i / celestial.trail.length;
        let currentThicc = ratio * (celestial.mass / 2);

        let currentAlpha = ratio * 125;

        trailColor.setAlpha(currentAlpha);
        strokeWeight(currentThicc);
        stroke(trailColor);
        line(posCurrent.x, posCurrent.y, posNext.x, posNext.y);
    }
    pop();
}

/**
 * 
*/
function mousePressed() {
    if (mouseButton === LEFT) {
        //Start screen logic
        if (state === 'start') {
            state = 'play';

            userStartAudio();
            if (!music.isPlaying()) {
                music.loop();
            }
            let toSun = p5.Vector.sub(sun.pos, dotCelestial.pos);
            let rotationDirection = HALF_PI;
            let initialVel = toSun.copy().rotate(rotationDirection);
            let distance = toSun.mag();
            let orbitalSpeed = sqrt((gravConstant * sun.mass) / distance);
            initialVel.setMag(orbitalSpeed);
            dotCelestial.vel = initialVel;
            celestials.push(dotCelestial);
            return;
        }
        //Release Logic
        if (sun.isCaptured) {
            sun.isCaptured = false;
            return;
        }

        //Recapture logic
        if (captureSun(net, sun)) {
            return;
        }


        //Capture logic
        let capturedIndex = -1;
        for (let i = 0; i < celestials.length; i++) {
            if (canCapture(net, celestials[i]) && celestials[i].heat < celestials[i].maxHeat) {
                capturedIndex = i;
                break;
            }
        }
        if (capturedIndex != -1) {

            ghostSun = createGhostSun(sun)

            let captured = celestials[capturedIndex];
            sun.pos = captured.pos.copy();
            sun.mass = captured.mass * massMultiplier;
            sun.radius = captured.radius;
            sun.thicc = captured.thicc;
            sun.type = captured.type;

            sun.color = captured.color;

            sun.name = captured.name;
            sun.isCaptured = true;
            celestials.splice(capturedIndex, 1);
        }
    }

    if (mouseButton === RIGHT) {
        let clickedCelestial = null;

        for (let celestial of celestials) {
            let d = dist(mouseX, mouseY, celestial.pos.x, celestial.pos.y);
            let hitBox = (celestial.radius + net.radius) / 2;

            if (d < hitBox && celestial.heat < celestial.maxHeat) {
                clickedCelestial = celestial;
                break;
            }
        }
        if (clickedCelestial) {
            let alreadySelected = celestials.find(celestial => celestial.isSelected === true);

            if (!alreadySelected) {
                clickedCelestial.isSelected = true;
            } else if (alreadySelected !== clickedCelestial) {
                alreadySelected.isSelected = false;
                alreadySelected.isMagnetized = true;
                alreadySelected.magnetTarget = clickedCelestial;
                clickedCelestial.isMagnetized = true;
                clickedCelestial.magnetTarget = alreadySelected;
            }
        } else {
            for (let celestial of celestials) calculateOrbitalSpeed.isSelected = false;
        }
        return;
    }

    if (mouseButton === CENTER) {
        celestials.push(createCelestial(sun));
    }
    return false;
}

/**
 * 
 */
function keyPressed() {
    if (key === 'e' || key === 'E') {
        if (targetTimeScale === 1) {
            applySoundFilter(music, filter);
            targetTimeScale = 0;
        } else {
            targetTimeScale = 1;
            removeSoundFilter(music, filter);
        }
    }

    if (key === 'r' || key === 'R') {
        if (doYouBelieveInGravity === false) {
            mode = "Newton";
            doYouBelieveInGravity = true;
        } else {
            mode = "Hooke";
            doYouBelieveInGravity = false;
        }
        convertVeolcities(sun, celestials);
    }

    if (key === 'a' || key === 'A') {
        canSpawn = !canSpawn;
    }

    if (key === 's' || key === 'S') {
        canCollide = !canCollide;
    }

    if (key === 'd' || key === 'D') {
        interGravity = !interGravity;
    }

    if (key === 'z' || key === 'Z') {
        isDissolving = true;
    }
}

/**
 * 
 */
function superNova(sun, celestials) {
    let blastPower = sun.mass * 0.005;
    for (let celestial of celestials) {
        let blastDirection = p5.Vector.sub(celestial.pos, sun.pos);
        let distance = blastDirection.mag();
        blastDirection.normalize();
        let minBlast = blastPower / 20;
        let currentBlast = map(distance, 0, 600, blastPower, minBlast);
        currentBlast = constrain(currentBlast, minBlast, blastPower);
        blastDirection.mult(currentBlast);
        celestial.vel.add(blastDirection);
    }
}

/**
 * 
 */
function implosion(sun, celestials) {
    let blastPower = sun.mass * 0.005;
    for (let celestial of celestials) {
        let blastDirection = p5.Vector.sub(sun.pos, celestial.pos);
        let distance = blastDirection.mag();
        blastDirection.normalize();
        let minBlast = blastPower / 20;
        let currentBlast = map(distance, 0, 600, blastPower, minBlast);
        currentBlast = constrain(currentBlast, minBlast, blastPower);
        blastDirection.mult(currentBlast);
        celestial.vel.add(blastDirection);
    }
}

/**
 * 
 */
function drawHUD(sun, celestials, net) {
    let togX = 160;
    let sunType = "NEXUS";
    if (sun.type === "HOT") {
        sunType = "IGNIS"
    } else if (sun.type === "COLD") {
        sunType = "BOREAS"
    }

    push();
    noStroke();
    fill(255);
    textSize(14);
    textStyle(BOLD);
    textFont('Helvetica');
    textAlign(LEFT, TOP);
    text(sun.name.toUpperCase(), 20, 20);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(12);
    text("Mass:           " + sun.mass.toFixed(2) + " Gton", 20, 40);
    text("Radius:         " + sun.radius.toFixed(2) + " Mm", 20, 55);
    text("Type:            " + sunType, 20, 85);
    text("Orbiting:       " + celestials.length, 20, 70);
    text("____________________", 20, 90);
    text("Press 'Q' | Supernova", 20, 105);
    drawActiveToggle(isNova, togX, 111);
    text("Press 'W' | Implode", 20, 120);
    drawActiveToggle(isImplode, togX, 126);
    text("Press 'E' | Dilate Time", 20, 135);
    drawActiveToggle(targetTimeScale === 0, togX, 141);
    text("Press 'R' | Mode Switch", 20, 150);
    text(printMode(), togX - 5, 150);
    text("Press 'A' | Toggle Spawn", 20, 165);
    drawActiveToggle(canSpawn, togX, 171);
    text("Press 'S' | Collision", 20, 180);
    drawActiveToggle(canCollide, togX, 186);
    text("Press 'D' | Multi Grav", 20, 195);
    drawActiveToggle(interGravity, togX, 201);
    text("Press 'Z' | Dissolve All", 20, 210);
    drawActiveToggle(isDissolving, togX, 216);
    pop();

    if (!sun.isCaptured) {
        for (let celestial of celestials) {
            if (canCapture(net, celestial) && celestial.heat < celestial.maxHeat) {
                let celestialMass = celestial.mass * 10;
                push();
                if (mouseY > windowHeight - 90 && mouseX > windowWidth - 100) {
                    translate(mouseX + -100, mouseY - 85);
                }
                else if (mouseY > windowHeight - 90) {
                    translate(mouseX + 15, mouseY - 85);
                }
                else if (mouseX > windowWidth - 100) {
                    translate(mouseX - 100, mouseY);
                } else {
                    translate(mouseX + 15, mouseY);
                }
                textSize(14);
                textStyle(BOLD);
                let safeName = celestial.name || "Unknown";
                let nameWidth = textWidth(safeName.toUpperCase());

                let boxWidth = max(100, nameWidth + 20);

                fill(0, 0, 0, 200);
                stroke(255);
                strokeWeight(1);
                rect(0, 0, boxWidth + 15, 85);

                noStroke();
                fill(255);
                textAlign(LEFT, TOP);
                textFont('Helvetica');

                text(safeName.toUpperCase(), 5, 5);

                let entropy = (celestial.heat / celestial.maxHeat) * 100;

                textSize(12);
                textStyle(NORMAL);
                text("Mass:  " + celestialMass.toFixed(2) + " Gton", 5, 25);
                text("Speed:    " + celestial.vel.mag().toFixed(2) + " Δv", 5, 40);
                text("Size:     " + celestial.radius.toFixed(2) + " Mm", 5, 55)
                fill(celestial.displayColor);
                if (celestial.type === "HOT") {
                    text("Entropy:  " + entropy.toFixed(2) + " %", 5, 70);
                } else {
                    text("Entropy: -" + entropy.toFixed(2) + " %", 5, 70);
                }
                pop();
                break;
            }
        }
    }
    infoScreen();
}

/**
 * 
 */
function startScreen() {
    push();
    fill(255, 255, 255, titleAlpha);
    textSize(150);
    textFont('Montserrat');
    text("RBIT", (windowWidth / 2) + 110, (windowHeight / 2) + 90);
    pop();

    push();
    noFill();
    stroke(255, 255, 255, titleAlpha);
    strokeWeight(2);
    let startY = windowHeight / 2 + 50;
    let bottomY = windowHeight - 50;
    bezier(0, startY, windowWidth * 0.3, bottomY, windowWidth * 0.7, bottomY, windowWidth, startY);
    pop();
    if (state === 'start') {
        drawCelestial(dotCelestial);
        //Add start text
    }
}

/**
 * 
 */
function timeDialation() {
    timeScale = lerp(timeScale, targetTimeScale, timeRate)
    if (abs(timeScale - targetTimeScale) < 0.001) {
        timeScale = targetTimeScale;
    }
}

/**
 * 
 */
function applySoundFilter(music, filter) {
    filter.freq(400, 0.5, 0.05);
    filter.res(4, 0.5, 0.05);
}

/**
 * 
 */
function removeSoundFilter(music, filter) {
    filter.freq(22050, 0.5, 0.05);
    filter.res(0, 0.5, 0.05);
}

/**
 * 
 */
function convertVeolcities(sun, celestials) {
    for (let celestial of celestials) {
        let toSun = p5.Vector.sub(sun.pos, celestial.pos);
        let distance = toSun.mag();
        let currentDir = celestial.vel.copy().normalize();

        let newSpeed;

        if (doYouBelieveInGravity === true) {
            newSpeed = sqrt((gravConstant * sun.mass) / distance);

        } else {
            newSpeed = distance * sqrt(springConstant * sun.mass);
        }
        celestial.vel = currentDir.mult(newSpeed);
        celestial.acc.mult(0);
    }
}

/**
 * 
 */
function drawActiveToggle(booleanGuy, x, y) {
    if (booleanGuy) {
        push();
        noFill();
        stroke(255);
        strokeWeight(2);
        circle(x, y, 5);
        pop();
    }
}

/**
 * 
 */
function checkSunCollision(sun, celestials) {
    if (targetTimeScale !== 0 || !sun.isCaptured) {
        return;
    }

    for (let celestial of celestials) {
        let collisionThreshold = (sun.radius / 2) + (celestial.radius / 2);
        let currentDist = dist(sun.pos.x, sun.pos.y, celestial.pos.x, celestial.pos.y);

        if (currentDist < collisionThreshold) {
            let pushVector = p5.Vector.sub(celestial.pos, sun.pos).normalize();

            celestial.vel.add(pushVector.copy().mult(bumpPower));

            let overlap = collisionThreshold - currentDist;
            let displacement = pushVector.copy().mult(overlap + 2);
            celestial.pos.add(displacement);
        }
    }
}

/**
 * 
 */
function celestialCollision(celestials) {
    if (!canCollide) return;

    for (let i = 0; i < celestials.length; i++) {
        for (let j = i + 1; j < celestials.length; j++) {
            let cel1 = celestials[i];
            let cel2 = celestials[j];

            let radius1 = cel1.radius / 2;
            let radius2 = cel2.radius / 2;

            let distVec = p5.Vector.sub(cel1.pos, cel2.pos);
            let distance = distVec.mag();
            let minDist = radius1 + radius2;

            if (distance < minDist) {
                let overlap = minDist - distance;
                let correction = distVec.copy().normalize().mult(overlap / 2);

                cel1.pos.add(correction);
                cel2.pos.sub(correction);

                let normal = p5.Vector.sub(cel1.pos, cel2.pos).normalize();
                let relativeVelocity = p5.Vector.sub(cel1.vel, cel2.vel);
                let velocityNormal = p5.Vector.dot(relativeVelocity, normal);

                if (velocityNormal > 0) continue;

                let impulseMult = -(1 + resistance) * velocityNormal;
                impulseMult /= (1 / cel1.mass + 1 / cel2.mass);

                let impulse = normal.mult(impulseMult);

                let impulse1 = p5.Vector.div(impulse, cel1.mass);
                let impulse2 = p5.Vector.div(impulse, cel2.mass);

                cel1.vel.add(impulse1);
                cel2.vel.sub(impulse2);
            }
        }
    }
}

/**
 * 
 */
function applyInterplanetaryGravity(celestials) {
    if (!interGravity) return;

    for (let i = 0; i < celestials.length; i++) {
        for (let j = i + 1; j < celestials.length; j++) {
            let cel1 = celestials[i];
            let cel2 = celestials[j];

            let dir = p5.Vector.sub(cel2.pos, cel1.pos);
            let distance = dir.mag();
            distance = constrain(distance, 20, 1000);
            let forceMag = (gravConstant) * ((cel1.mass * cel2.mass) / (distance * distance));
            let forceVec = dir.normalize().mult(forceMag);
            let acc1 = p5.Vector.div(forceVec, cel1.mass);
            cel1.acc.add(acc1);
            let acc2 = p5.Vector.div(forceVec, cel2.mass).mult(-1);
            cel2.acc.add(acc2);
        }
    }
}

function createStarBabies(numberStars) {
    let stars = [];

    for (i = 0; i < numberStars; i++) {
        let starBaby = {
            x: random(5, windowWidth - 5),
            y: random(5, windowHeight - 5),
            radius: random(2, 5),
            startBright: random(10, 255),
            minBright: random(0, 25),
            maxBright: random(150, 255),
            fadeRate: random(0.01, 0.1),
        };
        stars.push(starBaby);
    }
    return stars;
}

function drawStarBabies(stars) {
    push();
    noStroke();
    for (let star of stars) {
        fill(255, 255, 255, star.startBright);
        circle(star.x, star.y, star.radius);
    }
    pop();
}

//
function updateStarBabies(stars) {
    for (let star of stars) {
        star.x += star.fadeRate;
        if (star.x >= windowWidth) {
            star.x = 0;
        }
    }

}

function dissolveCelstial(celestials) {
    if (!isDissolving) return;
    canSpawn = false;
    for (let i = celestials.length - 1; i >= 0; i--) {
        let celestial = celestials[i];
        celestial.finalRadius -= dissolveRate;
        if (celestial.finalRadius <= 0) {
            celestials.splice(i, 1);
        }
    }
    if (celestials.length === 0) {
        isDissolving = false;
        canSpawn = true;
    }
}

function handleFusion(celestials) {
    for (let i = celestials.length - 1; i >= 0; i--) {
        let cel1 = celestials[i];

        if (cel1.isSelected) {
            cel1.color = "#2bbe4bff";
        }

        if (cel1.isMagnetized && cel1.magnetTarget) {
            let cel2 = cel1.magnetTarget;

            if (cel1.heat > cel1.maxHeat || cel2.heat > cel2.maxHeat) {
                cel1.isMagnetized = false;
                cel1.magnetTarget = null;
                cel2.isMagnetized = false;
                cel2.magnetTarget = null;
                continue;
            }

            cel1.magnetTarget.color = "#2bbe4bff";
            /* 
                        stroke('#62a8ffff');
                        strokeWeight(2);
                        line(cel1.pos.x, cel1.pos.y, cel2.pos.x, cel2.pos.y);
             */
            let dir = p5.Vector.sub(cel2.pos, cel1.pos);
            let distance = dir.mag();
            dir.normalize();

            dir.mult(100 / dist(cel1.pos.x, cel1.pos.y, cel2.pos.x, cel2.pos.y));
            cel1.vel.add(dir);

            if (distance < ((cel1.radius + cel2.radius) / 2) + 1) {


                let index2 = celestials.indexOf(cel2);
                if (index2 > -1) {
                    cel1.trail = [];
                    cel1.mass += cel2.mass / 2;
                    cel1.finalRadius = sqrt((cel1.radius * cel1.radius) + (cel2.radius * cel2.radius));
                    cel1.radius = cel1.finalRadius;
                    cel1.color = "#f8cf81ff";
                    cel1.vel.add(cel2.vel).normalize();
                    cel1.name = random(planetData.names);
                    cel1.heat = (cel1.heat + cel2.heat) / 3;

                    cel1.isMagnetized = false;
                    cel1.magnetTarget = null;

                    celestials.splice(index2, 1);
                }
            }
        }
    }
}

function createGhostSun(sun) {
    ghostSun = {
        pos: sun.pos.copy(),
        radius: sun.radius,
        thicc: sun.thicc,
        color: "#FFFFFF",
        dissolveRate: sun.mass / 10,
    };
    return ghostSun;
}

function drawGhostSun(ghost) {
    if (ghost !== null) {
        push();
        fill(0);
        stroke(ghost.color);
        strokeWeight(ghost.thicc);
        circle(ghost.pos.x, ghost.pos.y, ghost.radius);
        pop();

        ghost.radius -= ghostSun.dissolveRate;

        if (ghost.radius < 0) {
            ghostSun = null;
        }
    }
}

function captureSun(net, sun) {
    let sunCanBeCaptured = canCapture(net, sun);

    if (sun.isCaptured === false && sunCanBeCaptured) {
        sun.isCaptured = true;
        return true;
    }
    return false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // starArray = createStarBabies(numberStars);
}

function infoScreen() {
    let icon = {
        x: width - 40,
        y: 40,
        radius: 30,
    };

    drawIcon(icon);

    let isHovering = dist(mouseX, mouseY, icon.x, icon.y) < icon.radius / 2;
    if (isHovering) {
        drawInfoOverlay();
    }
}

function drawIcon(icon) {
    push();
    stroke(255);
    fill(0);
    circle(icon.x, icon.y, icon.radius);

    noStroke();
    fill(255);
    rectMode(CENTER);
    rect(icon.x, icon.y + 3, 4, 12);
    circle(icon.x, icon.y - 7, 4);
    pop();
}

function drawInfoOverlay() {
    let boxX = width * 0.65;
    let boxY = 85;
    let margin = 20;
    let boxW = (width - boxX) - margin;
    let boxH = height - 170;

    push();

    stroke(255);
    strokeWeight(1);
    fill(0, 0, 0, 230);
    rectMode(CORNER);
    rect(boxX, boxY, boxW, boxH,);

    fill(255);
    noStroke();
    textSize(14);
    textLeading(16);
    textFont('Helvetica');
    textAlign(LEFT, TOP);

    let textX = boxX + margin;
    let textY = boxY + margin;
    let textW = boxW - (margin * 1.5);
    let textH = boxH - (margin * 2);

    let content = getInfoText();

    text(content, textX, textY, textW, textH);
    pop();
}

function getInfoText() {
    return `WELCOME TO ORBIT
    A physics based gravitational sandbox, where you can experiment
    with the gravitational laws of the universe!

    Every 2 seconds, a new 'Celestial' spawns in orbit around the Sun (white ring).

    MOUSE CONTROLS
        • Left Click: Move the Sun, or click a Celestial to make it the new Sun. Notice how mass/size affects the orbits of others.

        • Right Click: Select two Celestials to magnetize them. If they touch, they fuse into a larger Celestial.

        • Middle Click: Force a new Celestial to Spawn around the current Sun.

    KEYBOARD SHORTCUTS
    [Q] Supernova (Hold) | Exerts massive force on all Celestials.
    [W] Implosion (Hold) | Forcefully pulls Celestials tightly inward.
    [E] Time Dilation | Pauses time. You can push Celestials while paused; velocity builds up and releases when time resumes.
    [R] Gravity Mode Toggle:
        • Newton: Gravity gets stronger the closer you are.
        • Hooke: Gravity gets stronger the further you are.

    [A] Spawn Toggle | Turn natural spawning on/off.
    [S] Collision | Toggle bounce physics.
    [D] Multi-Gravity | ALL Celestials exert their own gravity.
    [Z] Dissolve | Destroy all Celestials.
    
    ENTROPY: All Celestials either generate or draw intense amounts of heat as they orbit the sun.
    As a Celestial take thermic effect, it will change colors.
    When a Celestial gets too hot or too cold it will explode or implode, respectively.
    Merging Celestials, stoppin time, or turning it into a Sun can delay the Supernova.
    `;
}

function applyHeat(celestials) {
    if (targetTimeScale === 1) {
        for (let i = 0; i < celestials.length; i++) {
            calculateHeat(celestials[i]);
        }
    }
}

function calculateHeat(celestial) {
    celestial.heat += heatMultiplier * ((celestial.mass * celestial.vel.mag()) / celestial.finalRadius);
    return celestial.heat;
}

function celestialIsTooHot(celestials) {
    for (let i = 0; i < celestials.length; i++) {
        if (celestials[i].heat > celestials[i].maxHeat) {
            if (celestials[i].type === "HOT") {
                celestials[i].vel.mult(0);
                superNova(celestials[i], celestials);
                celestials[i].fillOpacity -= calculateExplosionRate(celestials[i]);
                celestials[i].finalRadius += 15;
                if (celestials[i].fillOpacity <= 0)
                    celestials.splice(i, 1);
            } else {
                celestials[i].vel.mult(0);
                implosion(celestials[i], celestials);
                celestials[i].fillOpacity -= calculateExplosionRate(celestials[i]);
                celestials[i].finalRadius += 15;
                if (celestials[i].fillOpacity <= 0)
                    celestials.splice(i, 1);

            }
        }
    }
}

function calculateExplosionRate(celestial) {
    return celestial.thicc * 1.2;
}

function printMode() {
    let modeChar = 'N';
    if (mode === "Hooke") {
        modeChar = 'H';
    }
    return modeChar;
}