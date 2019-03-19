function Paddle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.left = false;
  this.right = false;
  this.magForce = 0;
  this.force = 1;
  this.powerup = [];
  this.powerup.push(new PowerUp(0));

  this.render = function() {
    if (run) {
      if (isPredicting) {
        this.x = paddleX;
      } else if (run) {
        if (this.left) {
          this.x += 6;
        } else if (this.right) {
          this.x -= 6;
        }
      }

      if (this.x + this.w > canvasWidth) {
        this.x = canvasWidth - this.w;
      } else if (this.x < 0) {
        this.x = 0;
      }

      fill(255);
      rect(this.x, this.y, this.w, this.h);
    } else {
      fill(255);
      rect(this.x, this.y, this.w, this.h);
    }
  }
}