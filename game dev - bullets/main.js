let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

let player = {
  x: canvas.width / 2,
  y: canvas.height - 20,
  radius: 25,
  color: 'white',
  speed: 8 // Increased player speed
};

let bullets = [];
let circles = [];

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createCircle() {
  let circle = {
    x: getRandomNumber(0, canvas.width),
    y: getRandomNumber(20, canvas.height / 2),
    radius: getRandomNumber(10, 30),
    color: `rgb(${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)})`,
    velocityX: getRandomNumber(-3, 3),
    velocityY: getRandomNumber(-3, 3)
  };

  // Ensure the initial velocity is not zero 
  let minAbsoluteVelocity = 2;
  if (Math.abs(circle.velocityX) < minAbsoluteVelocity) {
    circle.velocityX = circle.velocityX < 0 ? -minAbsoluteVelocity : minAbsoluteVelocity;
  }
  if (Math.abs(circle.velocityY) < minAbsoluteVelocity) {
    circle.velocityY = circle.velocityY < 0 ? -minAbsoluteVelocity : minAbsoluteVelocity;
  }

  circles.push(circle);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawCircle(circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fillStyle = circle.color;
  ctx.fill();
  ctx.closePath();
}

function drawBullet(bullet) {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bullet.x, bullet.y, 5, 10);
}

function updatePlayer() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'a' && player.x - player.radius / 2 > 0) {
      player.x -= player.speed;
    } else if (event.key === 'd' && player.x + player.radius / 2 < canvas.width) {
      player.x += player.speed;
    }
  });

  // Left click to shoot
  document.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
      let bullet = {
        x: player.x,
        y: player.y - player.radius / 2,
        width: 5,
        height: 10
      };
      bullets.push(bullet);
    }
  });
}

function updateCircles() {
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    circle.x += circle.velocityX;
    circle.y += circle.velocityY;

    // Bounce off the walls
    if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width) {
      circle.velocityX *= -1;
    }

    if (circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height / 2) {
      circle.velocityY *= -1;
    }
  }
}

function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    bullet.y -= 10; // bullet speed

    // Check for collision with circles
    for (let j = 0; j < circles.length; j++) {
      let circle = circles[j];
      let dx = bullet.x - circle.x;
      let dy = bullet.y - circle.y;
      let distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance < bullet.width / 2 + circle.radius) {
        // Remove the bullet and the circle on collision
        bullets.splice(i, 1);
        circles.splice(j, 1);
      }
    }

    // Remove bullets when they go off the canvas
    if (bullet.y < 0) {
      bullets.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();

  for (let i = 0; i < circles.length; i++) {
    drawCircle(circles[i]);
  }

  for (let i = 0; i < bullets.length; i++) {
    drawBullet(bullets[i]);
  }

  updateBullets();
  updateCircles();

  setInterval(drawCircle, 2000)

  requestAnimationFrame(draw);
}

// Create initial circles
for (let i = 0; i < 10; i++) {
  createCircle();
}

updatePlayer();
draw();
