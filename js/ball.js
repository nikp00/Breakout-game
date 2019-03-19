function Ball(r, x, y) {
  this.r = r;
  this.x = x;
  this.y = y;

  this.render = function() {
    if (run) {
      if (paddle.magForce == 1000) {
        oldDx = dx;
        oldDy = dy;
      }

      if (this.x + dx > canvasWidth - this.r / 2 || this.x + dx < this.r / 2) {
        dx = -dx;
      }

      if (this.y + dy > paddle.y - this.r / 2 && this.x + dx > paddle.x - this.r / 2 && this.x + dx < paddle.x + paddle.w + this.r / 2) {

        if (paddle.magForce <= 0) {
          dy = -dy;
          dx = 15 * ((ball.x - (paddle.x + paddle.w / 2)) / paddle.w);
          oldDx = dx;
          oldDy = dy;
        } else if (paddle.magForce == 1000) {
          this.x = paddle.w / 2 + paddle.x;
          this.y = paddle.y - ball.r / 2;
          ballIsFrezzed = true;
        }

        for (let i = 0; i < paddle.powerup.length; i++) {
          paddle.powerup[i].update();
          paddle.powerup[i].removeUsed();
        }

      } else if (this.y + dy < this.r / 2) {
        dy = -dy;
      }

      if (spacePressed) {
        dx = oldDx;
        dy = oldDy;
        spacePressed = false;
      }

      if (!ballIsFrezzed) {
        this.x += dx;
        this.y += dy;
      }

      fill(255);
      ellipse(this.x, this.y, r, r);

      if (dx == 0 && dy == 0) {
        dx = oldDx;
        dy = oldDy;
      }
    } else {
      fill(255);
      ellipse(this.x, this.y, r, r);
    }
  }

  this.check = function() {
    if (this.y > canvasHeight) {
      audio.pause();
      noLoop();
      Swal.fire({
        type: 'info',
        title: 'YOU LOST'
      }).then(function() {
        reload();
      });
    }
  }
}