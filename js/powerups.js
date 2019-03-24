function PowerUp(n, i, j, w, h, index) {
  this.n = n;
  this.i = i;
  this.j = j;
  this.w = floor(w / 1.5);
  this.h = floor(w / 1.5);
  this.x = null;
  this.y = null;
  this.magForce = 0;
  this.life = magLife = floor(random(3, 10));
  this.paddleExpand = 0;
  this.force = 1;
  this.ballControl = 0;
  this.image;
  this.parentBrick = index;
  this.render = true;
  this.gravity = floor(random(1, 4));


  switch (n) {
    case 1:
      this.magForce = 1000;
      this.image = img1;
      this.life = 1;
      break;
    case 2:
      this.paddleExpand = floor(random(paddleWidth / this.life, 200 / this.life));
      this.image = img2;
      break;
    case 3:
      this.force = floor(random(2, 6));
      this.image = img3;
      break;
    default:
      this.life = 0;
      this.image = def;
  }

  this.update = function() {
    if (this.life > 0) {
      this.life--;
      if (this.n == 2)
        paddle.w = paddleWidth + (this.paddleExpand * this.life);
      if (this.n == 3)
        paddle.force = this.force;
      if (this.n == 1)
        paddle.magForce = this.magForce;
    } else {
      paddle.w = paddleWidth;
    }
  }

  this.fall = function() {
    if (this.y == null) {
      this.y = bricks[this.parentBrick].y;
      this.x = bricks[this.parentBrick].x;
    }
    if (run) {
      this.y += this.gravity;
    }
    image(this.image, this.x + this.w / 2, this.y, this.w, this.h);
  }

  this.check = function(n) {
    if (this.y + this.h > paddle.y && this.y <= paddle.y + paddle.h && this.x + this.w >= paddle.x && this.x <= paddle.x + paddle.w) {
      var p = powerups.splice(powerups.indexOf(this), 1)[0];
      for (let i = 0; i < paddle.powerup.length; i++) {
        if (paddle.powerup[i].n == p.n) {
          paddle.powerup[i].life += p.life;
          p = null;
          break;
        }
      }
      if (p != null) {
        paddle.powerup.push(p);
      }

      for (let i = 0; i < paddle.powerup.length; i++) {
        if (paddle.powerup[i].n == this.n) {
          if (paddle.powerup[i].n == 2)
            paddle.w = paddleWidth + (paddle.powerup[i].paddleExpand * paddle.powerup[i].life);
          if (paddle.powerup[i].n == 3)
            paddle.force = paddle.powerup[i].force;
          if (paddle.powerup[i].n == 1)
            paddle.magForce = paddle.powerup[i].magForce;
        }
      }

    }
  }

  this.removeUsed = function() {
    if (this.life <= 0)
      paddle.powerup.splice(paddle.powerup.indexOf(this), 1);
  }



}