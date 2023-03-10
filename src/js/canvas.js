const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;

class Bubble {
  constructor() {
    this.size = Math.random() * 2 + 0.5;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = "hsl(" + 360 * Math.random() + ",100%,50%)";
    this.countOfParticles = window.innerWidth < 992 ? 15 : 70;
    this.bubbles = [];
  }

  init() {
    for (let i = 0; i < this.countOfParticles; i++) {
      this.bubbles.push(new Bubble());
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255)";
    // ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size < 0 || this.x + this.size > canvas.width) {
      this.speedX = -this.speedX;
    }

    if (this.y + this.size < 0 || this.y + this.size > canvas.height) {
      this.speedY = -this.speedY;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }

  render() {
    this.bubbles.forEach((bubble) => {
      bubble.draw();
      bubble.update();
    });
  }
}

const bubble = new Bubble();
bubble.init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubble.render();

  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  canvas.width = document.body.clientWidth;
  canvas.height = window.innerHeight;
  bubble.render();
});
