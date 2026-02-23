let walker;
let canvasSize = 500;
let spacing = canvasSize / 12;

let cols, rows;
let margin = 1;

function setup() {
  createCanvas(canvasSize, canvasSize).parent('sketch2');
  frameRate(10);

  background(255);

  cols = floor(width / spacing);
  rows = floor(height / spacing);

  // draw grid (NOTE: if you ever add background() in draw, you must redraw grid there too)
  stroke(220);
  noFill();
  strokeWeight(1);
  for (let i = margin; i < cols - margin; i++) {
    for (let j = margin; j < rows - margin; j++) {
      square(i * spacing, j * spacing, spacing);
    }
  }

  walker = new Walker();
}

function draw() {
  walker.update();
  walker.show();
}

class Walker {
  constructor() {
    this.i = floor(cols / 2);
    this.j = floor(rows / 2);

    this.pi = this.i;
    this.pj = this.j;

    this.pauseTimer = 0; // how long to pause
    this.dx = 0; // current direction x
    this.dy = 0; // current direction y

    // ---------------- HOMING STATE ----------------
    this.homing = false; // are we currently homing?
    this.nextHomeTime = millis() + random(5000, 8000); // when to start homing next
  }

  update() {
    // if paused, count down and do nothing
    if (this.pauseTimer > 0) {
      this.pauseTimer--;
      return;
    }

    // store previous position (for your line drawing)
    this.pi = this.i;
    this.pj = this.j;

    // ---------------- START HOMING (sometimes) ----------------
    // Only start homing if we're NOT already homing
    if (!this.homing && millis() > this.nextHomeTime) {
      this.homing = true;

      // pick axis + direction (like Arduino: doX + dirPos)
      if (random(1) < 0.5) {
        // home in X
        this.dx = random(1) < 0.5 ? 1 : -1;
        this.dy = 0;
      } else {
        // home in Y
        this.dy = random(1) < 0.5 ? 1 : -1;
        this.dx = 0;
      }
    }

    // ---------------- HOMING MODE ----------------
    if (this.homing) {
      // move straight in chosen direction
      this.i += this.dx;
      this.j += this.dy;

      // if we hit ANY edge, do the same "pause + reverse" logic
      if (this.i <= margin || this.i >= cols - 1 - margin) {
        this.i -= this.dx; // undo step into the wall
        this.dx *= -1; // reverse
        this.i += this.dx; // step away
        this.pauseTimer = 10; // pause after hitting edge
        this.homing = false; // exit homing
        this.nextHomeTime = millis() + random(8000, 15000); // schedule next homing
      }

      if (this.j <= margin || this.j >= rows - 1 - margin) {
        this.j -= this.dy;
        this.dy *= -1;
        this.j += this.dy;
        this.pauseTimer = 10;
        this.homing = false;
        this.nextHomeTime = millis() + random(8000, 15000);
      }

      return; // IMPORTANT: don’t do random walk on homing frames
    }

    // ---------------- NORMAL LOCAL RANDOM WALK ----------------
    // randomly choose direction (like Arduino doX + dirPos)
    let choice = floor(random(4));
    if (choice === 0) {
      this.dx = 1;
      this.dy = 0;
    }
    if (choice === 1) {
      this.dx = -1;
      this.dy = 0;
    }
    if (choice === 2) {
      this.dx = 0;
      this.dy = 1;
    }
    if (choice === 3) {
      this.dx = 0;
      this.dy = -1;
    }

    // move
    this.i += this.dx;
    this.j += this.dy;

    // check edges (your existing behavior)
    if (this.i <= margin || this.i >= cols - 1 - margin) {
      this.i -= this.dx; // undo move
      this.dx *= -1; // reverse direction
      this.i += this.dx; // move opposite
      this.pauseTimer = 10; // pause after hitting edge
    }

    if (this.j <= margin || this.j >= rows - 1 - margin) {
      this.j -= this.dy;
      this.dy *= -1;
      this.j += this.dy;
      this.pauseTimer = 10;
    }

    // occasional small pause like machine thinking (keep it)
    if (random(1) < 0.1) {
      this.pauseTimer = 5;
    }
  }

  show() {
    let cx = this.i * spacing;
    let cy = this.j * spacing;
    let px = this.pi * spacing;
    let py = this.pj * spacing;

    stroke(150, 125);
    fill(0, 2);
    strokeWeight(1);
    square(cx, cy, spacing);

    // make line visible (your earlier alpha was too low)
    stroke(0, 5);
    strokeWeight(1);
    line(px + spacing / 2, py + spacing / 2, cx + spacing / 2, cy + spacing / 2);

    // erase previous dot
    strokeWeight(5);
    fill(255); // match background color exactly
    circle(px + spacing / 2, py + spacing / 2, spacing / 8);

    // draw current dot
    strokeWeight(4);
    fill(0);
    circle(cx + spacing / 2, cy + spacing / 2, spacing / 8);
  }
}
