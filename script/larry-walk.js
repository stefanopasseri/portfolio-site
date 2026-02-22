function createWalkerSketch(parentId) {
  return function (p) {
    let walker;
    let canvasSize = 500;
    let spacing = canvasSize / 12;

    let cols, rows;
    let margin = 1;

    p.setup = function () {
      p.createCanvas(canvasSize, canvasSize).parent(parentId);
      p.frameRate(10);

      p.background(255);

      cols = p.floor(p.width / spacing);
      rows = p.floor(p.height / spacing);

      // draw grid once
      p.stroke(220);
      p.noFill();
      p.strokeWeight(1);
      for (let i = margin; i < cols - margin; i++) {
        for (let j = margin; j < rows - margin; j++) {
          p.square(i * spacing, j * spacing, spacing);
        }
      }

      walker = new Walker();
    };

    p.draw = function () {
      walker.update();
      walker.show();
    };

    class Walker {
      constructor() {
        this.i = p.floor(cols / 2);
        this.j = p.floor(rows / 2);

        this.pi = this.i;
        this.pj = this.j;

        this.pauseTimer = 0;
        this.dx = 0;
        this.dy = 0;

        this.homing = false;
        this.nextHomeTime = p.millis() + p.random(5000, 8000);
      }

      update() {
        if (this.pauseTimer > 0) {
          this.pauseTimer--;
          return;
        }

        this.pi = this.i;
        this.pj = this.j;

        if (!this.homing && p.millis() > this.nextHomeTime) {
          this.homing = true;

          if (p.random(1) < 0.5) {
            this.dx = p.random(1) < 0.5 ? 1 : -1;
            this.dy = 0;
          } else {
            this.dy = p.random(1) < 0.5 ? 1 : -1;
            this.dx = 0;
          }
        }

        if (this.homing) {
          this.i += this.dx;
          this.j += this.dy;

          if (this.i <= margin || this.i >= cols - 1 - margin) {
            this.i -= this.dx;
            this.dx *= -1;
            this.i += this.dx;
            this.pauseTimer = 10;
            this.homing = false;
            this.nextHomeTime = p.millis() + p.random(8000, 15000);
          }

          if (this.j <= margin || this.j >= rows - 1 - margin) {
            this.j -= this.dy;
            this.dy *= -1;
            this.j += this.dy;
            this.pauseTimer = 10;
            this.homing = false;
            this.nextHomeTime = p.millis() + p.random(8000, 15000);
          }

          return;
        }

        let choice = p.floor(p.random(4));
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

        this.i += this.dx;
        this.j += this.dy;

        if (this.i <= margin || this.i >= cols - 1 - margin) {
          this.i -= this.dx;
          this.dx *= -1;
          this.i += this.dx;
          this.pauseTimer = 10;
        }

        if (this.j <= margin || this.j >= rows - 1 - margin) {
          this.j -= this.dy;
          this.dy *= -1;
          this.j += this.dy;
          this.pauseTimer = 10;
        }

        if (p.random(1) < 0.1) {
          this.pauseTimer = 5;
        }
      }

      show() {
        let cx = this.i * spacing;
        let cy = this.j * spacing;
        let px = this.pi * spacing;
        let py = this.pj * spacing;

        p.stroke(150, 125);
        p.fill(0, 2);
        p.strokeWeight(1);
        p.square(cx, cy, spacing);

        p.stroke(0, 5);
        p.strokeWeight(1);
        p.line(px + spacing / 2, py + spacing / 2, cx + spacing / 2, cy + spacing / 2);

        p.fill(255);
        p.noStroke();
        p.circle(px + spacing / 2, py + spacing / 2, spacing / 8);

        p.fill(0);
        p.circle(cx + spacing / 2, cy + spacing / 2, spacing / 8);
      }
    }
  };
}

// create independent instances
new p5(createWalkerSketch('sketch1'));
new p5(createWalkerSketch('sketch2'));
new p5(createWalkerSketch('sketch3'));
new p5(createWalkerSketch('sketch4'));
