function brickColisionDetection() {
  for (let i = 0; i < bricks.length; i++) {
    if (ball.x + ball.r / 2 + 1 > bricks[i].x && ball.x - ball.r / 2 - 1 < bricks[i].x + bricks[i].w &&
      ball.y + ball.r / 2 + 1 > bricks[i].y && ball.y - ball.r / 2 - 1 < bricks[i].y + bricks[i].h && !bricks[i].wasHit) {
      bricks[i].wasHit = true;

      if (bricks[i].powerup.life > 0) {
        powerups.push(bricks[i].powerup);
      }

      if (paddle.force <= 1) {
        dy = -dy;
      } else {
        paddle.force--;
      }
      break;

    }
  }

}