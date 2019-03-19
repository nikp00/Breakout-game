function Brick(i, j, w, h, hue, saturation, lightnes, a, wasHit) {
  this.i = i;
  this.j = j;
  this.w = w;
  this.h = h;
  this.x;
  this.y;
  this.wasHit = wasHit;
  this.a = a;
  this.hue = hue;
  this.saturation = saturation;
  this.lightnes = lightnes;
  this.staticLightnes = lightnes;
  this.powerup = new PowerUp(floor(random(1, 20)), this.i, this.j, this.w, this.h, index(this.i, this.j, cols));
  this.render = function() {

    if (!this.wasHit) {
      if (this.i == 15) {
        var x = this.i * brickWidth + offset;
      } else {
        var x = this.i * brickWidth + this.i * offset + offset;
      }

      var y = this.j * brickHeight + this.j * offset + offset;
      this.x = x;
      this.y = y;


      colorMode(HSL);
      stroke(this.hue, this.saturation, 100, 100);
      fill(this.hue, this.saturation, this.lightnes, this.a);

      rect(x, y, w, h);
      noStroke();
    }
  }
}