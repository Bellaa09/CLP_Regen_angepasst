// ==============================
// GLOBALE SKALIERUNG
// ==============================
let RES_SCALE = 1;
const BASE_W = 270;
const BASE_H = 480;

// ==============================
// DATEN
// ==============================
let jahre = [2002, 2010, 2013, 2016, 2021];
let schäden = [5.52, 0.45, 2.66, 0.81, 9.41];

// ==============================
// VARIABLEN
// ==============================
let allDrops = [];
let currentIndex = 0;
let yearDuration = 3000;
let lastUpdate = 0;

let dropCount = 0;
let targetCount = 0;
let maxDisplayDrops = 941;
let interpSpeed = 0.05;

let img1, img2;

let scaleAnim = 1;
let scaleTarget = 1;
let scaleSpeed = 0.05;

let dropFactor = 0.25;
let prevScaledCount = 0;

let animationStart = 0;

// Offsets für Text
let leftOffsetX = 0;
let rightTextOffsetX = 0;

// Startzeiten und Dauer für Ease-Out Animation
let leftStartTime = 14500;   // 14,5 Sekunden
let leftDuration = 1000;     // 1 Sekunde
let rightStartTime = 14700;  // 14,7 Sekunden
let rightDuration = 1000;    // 1 Sekunde

let qrY = -120;
let qrSpeed = 0;
let qrGravity = 0.35;

// ==============================
// PRELOAD
// ==============================
function preload() {
  img1 = loadImage('Verlauf_CLP.png');
  img2 = loadImage('QR.png');
}

// ==============================
// SETUP
// ==============================
function setup() {
  pixelDensity(window.devicePixelRatio || 1);
  createCanvas(BASE_W * RES_SCALE, BASE_H * RES_SCALE);

  for (let i = 0; i < maxDisplayDrops; i++) {
    allDrops.push(new Drop());
  }

  dropCount = schäden[0];
  targetCount = dropCount;
  lastUpdate = millis();
  animationStart = millis();
}

// ==============================
// EASE FUNCTIONS
// ==============================
function easeOutQuad(t) {
  return t * (2 - t);
}

function easeInQuad(t) {
  return t * t;
}


// ==============================
// DRAW
// ==============================
function draw() {
  background(5, 10, 30); //schwarz
  //background(135, 40, 200); //lila

  push();
  scale(RES_SCALE);

  let elapsed = millis() - animationStart;

  // ------------------------------
  // Tropfen
  // ------------------------------
  dropCount += (targetCount - dropCount) * interpSpeed;
  scaleAnim += (scaleTarget - scaleAnim) * scaleSpeed;

  let dropFade = 1;
  if (elapsed > 15000) { // Tropfen fade-out nach 15 Sekunden
    dropFade = max(0, 1 - (elapsed - 15000) / 5000);
  }

  let maxCSV = Math.max(...schäden);
  let percentage = (dropCount / maxCSV) * dropFactor * dropFade;
  let scaledCount = floor(percentage * maxDisplayDrops);
  scaledCount = constrain(scaledCount, 0, maxDisplayDrops);

  for (let i = 0; i < scaledCount; i++) {
    let d = allDrops[i];
    if (i > prevScaledCount) d.y = random(-400, -50);
    d.fall();
    d.show();
  }
  prevScaledCount = scaledCount;

  // ------------------------------
  // Verlauf-Bild über Tropfen
  // ------------------------------
  imageMode(CORNER);
  blendMode(MULTIPLY);
  image(img1, 0, 0, BASE_W, BASE_H);
  blendMode(BLEND);

  // ------------------------------
  // Jahreswechsel (für Zahlen)
  // ------------------------------
  if (millis() - lastUpdate > yearDuration) {
    lastUpdate = millis();
    currentIndex = (currentIndex + 1) % jahre.length;
    targetCount = schäden[currentIndex];
    scaleAnim = 1;
    scaleTarget = 1;
  }

  // ------------------------------
  // Text Offsets mit Ease-Out
  // ------------------------------
  if (elapsed >= leftStartTime) {
    let t = (elapsed - leftStartTime) / leftDuration;
    t = constrain(t, 0, 1);
    leftOffsetX = -250 * easeOutQuad(t);
  }

  if (elapsed >= rightStartTime) {
    let t = (elapsed - rightStartTime) / rightDuration;
    t = constrain(t, 0, 1);
    rightTextOffsetX = 300 * easeOutQuad(t);
  }

  // ------------------------------
  // Text über Verlauf
  // ------------------------------
  if (elapsed < leftStartTime || leftOffsetX > -250 || rightTextOffsetX < 300) {
    // Linker Textblock
    noStroke();
    textFont('sans-serif');
    fill(255, 0);
    rect(5 + leftOffsetX, 5, 200, 60, 5);

    fill(240, 255, 76);
    textSize(70);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(jahre[currentIndex], 15 + leftOffsetX, 30);

  // Balken
  fill(5, 10, 30); //schwarz
  noStroke(); // Keine Konturlinie
  rect(13 + leftOffsetX, 106, 159, 22); // rect(x, y, breite, höhe)
    
  fill(5, 10, 30); //schwarz
  noStroke(); // Keine Konturlinie
  rect(13 + leftOffsetX, 124, 182, 22); // rect(x, y, breite, höhe)
    
    fill(240, 255, 76); // Gelb
    textSize(14);
    textLeading(18);
    textStyle(NORMAL);
    text("verursachte Starkregen\nVersicherungsschäden von", 20 + leftOffsetX, 109);
    
    // Rechter Textblock
    push();
    scale(scaleAnim);
    fill(240, 255, 76);
    textSize(70);
    textAlign(RIGHT, TOP);
    textStyle(BOLD);
    text(targetCount, 255 + rightTextOffsetX, 205);
    pop();
    
  // Balken
  fill(5, 10, 30); //schwarz
  noStroke(); // Keine Konturlinie
  rect(150 +rightTextOffsetX, 281, 110, 22); // rect(x, y, breite, höhe)

    fill(240, 255, 76); // Gelb
    textSize(14);
    textLeading(18);
    textAlign(RIGHT, TOP);
    textStyle(NORMAL);
    text("Milliarden Euro.", 255 + rightTextOffsetX, 284);
  }
  
  function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - pow(-2 * t + 2, 3) / 2;
}

// ==============================
// EASE FUNCTIONS
// ==============================
function easeInOutCubic(t) {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 - pow(-2 * t + 2, 3) / 2;
}

// ------------------------------
// QR-CODE – smooth Ease-Out (5s)
// ------------------------------
let qrStartTime = 15000;
let qrDuration = 5000;

if (elapsed >= qrStartTime && elapsed <= qrStartTime + qrDuration) {
  let t = (elapsed - qrStartTime) / qrDuration;
  t = constrain(t, 0, 1);

  // Ease-Out cubic
  let easedT = 1 - pow(1 - t, 3);

  let startY = -120;
  let targetY = BASE_H / 2 - 60;

  let y = startY + (targetY - startY) * easedT;

  tint(240, 255, 76);
  image(img2, BASE_W / 2 - 60, y, 120, 120);
  tint(255);

} else if (elapsed > qrStartTime + qrDuration && elapsed <= 25000) {
  // bleibt ruhig in der Mitte stehen
  tint(240, 255, 76);
  image(img2, BASE_W / 2 - 60, BASE_H / 2 - 60, 120, 120);
  tint(255);
}




  // ------------------------------
  // LOOP RESET
  // ------------------------------
  if (elapsed > 25000) {
    animationStart = millis();
    leftOffsetX = 0;
    rightTextOffsetX = 0;
    dropCount = schäden[0];
    targetCount = dropCount;
    currentIndex = 0;
    prevScaledCount = 0;
    lastUpdate = millis();
    for (let d of allDrops) d.reset();
  }

  pop();
}

// ==============================
// DROP CLASS
// ==============================
class Drop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(BASE_W);
    this.y = random(-400, -50);
    this.z = random(0, 20);
    this.len = map(this.z, 0, 20, 10, 20);
    this.yspeed = map(this.z, 0, 50, 1, 3);
  }

  fall() {
    this.y += this.yspeed;
    this.yspeed += map(this.z, 0, 50, 0, 0.02);
    if (this.y > BASE_H) this.reset();
  }

  show() {
    blendMode(DIFFERENCE);
    stroke(135, 40, 200);
    strokeWeight(map(this.z, 0, 30, 20, 80));
    line(this.x, this.y, this.x, this.y + this.len);
    blendMode(BLEND);
  }
}