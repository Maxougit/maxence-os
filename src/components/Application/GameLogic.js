import { experiences } from './experiencesData';

export default function initGame(canvas, histogramContainer) {
  if (typeof window === 'undefined') return;

  const ctx = canvas.getContext('2d');
  const tileSize = 20;
  const pacmanSpeed = 2;

  // Game map (1 = wall, 2 = pellet, 0 = empty)
  const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 0, 0, 0, 2, 1, 0, 0, 0, 1, 2, 0, 2, 0, 0, 1, 2, 1],
    [1, 2, 1, 0, 1, 1, 2, 1, 1, 1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1],
    [1, 2, 1, 0, 1, 0, 2, 2, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1],
    [1, 2, 1, 0, 1, 0, 1, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1],
    [1, 2, 2, 0, 0, 0, 0, 0, 2, 1, 0, 1, 2, 2, 2, 1, 0, 0, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const ROWS = map.length;
  const COLS = map[0].length;

  // Pac-Man parameters
  const pacman = {
    x: 1,
    y: 1,
    dx: 0,
    dy: 0,
    speed: pacmanSpeed,
    size: tileSize, // Size of Pac-Man
  };

  // Ghosts
  const ghosts = [];

  let score = 0;
  let imagesLoaded = 0;
  const totalImages = experiences.length + 1;

  const pacmanImg = new Image();
  pacmanImg.src = '/images/pacman.png';
  pacmanImg.onload = imageLoaded;
  pacmanImg.onerror = () => console.error('Error loading Pac-Man image');

  const ghostImages = experiences.map((exp) => {
    const img = new Image();
    img.src = exp.image;
    img.onload = imageLoaded;
    img.onerror = () => console.error(`Error loading image for ${exp.company}`);
    return { img, id: exp.id };
  });

  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      initGhosts();
      updateHistogram();
      requestAnimationFrame(gameLoop);
    }
  }

  function initGhosts() {
    const positions = [
      { x: 9, y: 9 },
      { x: 8, y: 5 },
      { x: 10, y: 6 },
    ];

    positions.forEach((pos, index) => {
      ghosts.push({
        x: pos.x,
        y: pos.y,
        img: ghostImages[index].img,
        id: ghostImages[index].id,
      });
    });
  }

  function gameLoop() {
    updatePacman();
    updateGhosts();
    checkCollisions();
    drawBackground();
    drawMap();
    drawPacman();
    drawGhosts();
    requestAnimationFrame(gameLoop);
  }

  function updatePacman() {
    const nextX = pacman.x + pacman.dx;
    const nextY = pacman.y + pacman.dy;

    // Check if Pac-Man can move in the intended direction
    if (canMoveTo(nextX, pacman.y) && canMoveTo(nextX + 1, pacman.y)) {
      pacman.x = nextX;
    }
    if (canMoveTo(pacman.x, nextY) && canMoveTo(pacman.x, nextY + 1)) {
      pacman.y = nextY;
    }

    const mapX = Math.floor(pacman.x);
    const mapY = Math.floor(pacman.y);

    // Eat a pellet
    if (map[mapY][mapX] === 2) {
      map[mapY][mapX] = 0;
      score++;
      updateHistogram();
    }
  }

  function updateGhosts() {
    ghosts.forEach((ghost) => {
      const { dx, dy } = getRandomDirection();
      const nextX = ghost.x + dx;
      const nextY = ghost.y + dy;

      // Move ghost only if the new position is valid
      if (canMoveTo(nextX, ghost.y) && canMoveTo(nextX + 1, ghost.y)) ghost.x = nextX;
      if (canMoveTo(ghost.x, nextY) && canMoveTo(ghost.x, nextY + 1)) ghost.y = nextY;
    });
  }

  function checkCollisions() {
    ghosts.forEach((ghost, index) => {
      if (
        pacman.x < ghost.x + 1 && // Pac-Man's left side
        pacman.x + 1 > ghost.x && // Pac-Man's right side
        pacman.y < ghost.y + 1 && // Pac-Man's top side
        pacman.y + 1 > ghost.y // Pac-Man's bottom side
      ) {
        ghosts.splice(index, 1); // Remove the ghost
        updateHistogram();
        showExperienceInfo(ghost.id); // Show experience info
      }
    });
  }

  function canMoveTo(x, y) {
    const mapX = Math.floor(x);
    const mapY = Math.floor(y);

    // Check the bounds
    if (mapY < 0 || mapY >= ROWS || mapX < 0 || mapX >= COLS) return false;

    // Check if the next position is a wall
    return map[mapY][mapX] !== 1; // Pac-Man cannot pass through walls
  }

  function drawBackground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawMap() {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (map[y][x] === 1) {
          ctx.fillStyle = 'blue'; // Walls in blue
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else if (map[y][x] === 2) {
          ctx.fillStyle = 'white'; // Pellets in white
          ctx.beginPath();
          ctx.arc(
            x * tileSize + tileSize / 2,
            y * tileSize + tileSize / 2,
            tileSize / 4,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      }
    }
  }

  function drawPacman() {
    ctx.drawImage(
      pacmanImg,
      pacman.x * tileSize,
      pacman.y * tileSize,
      tileSize,
      tileSize
    );
  }

  function drawGhosts() {
    ghosts.forEach((ghost) => {
      ctx.drawImage(
        ghost.img,
        ghost.x * tileSize,
        ghost.y * tileSize,
        tileSize,
        tileSize
      );
    });
  }

  function keyDown(event) {
    switch (event.keyCode) {
      case 37: // Left
        pacman.dx = -pacman.speed / tileSize;
        pacman.dy = 0;
        break;
      case 38: // Up
        pacman.dx = 0;
        pacman.dy = -pacman.speed / tileSize;
        break;
      case 39: // Right
        pacman.dx = pacman.speed / tileSize;
        pacman.dy = 0;
        break;
      case 40: // Down
        pacman.dx = 0;
        pacman.dy = pacman.speed / tileSize;
        break;
    }
  }

  function updateHistogram() {
    const totalExperiences = experiences.length;
    const eatenGhosts = totalExperiences - ghosts.length;
    const percentage = (eatenGhosts / totalExperiences) * 100;
    histogramContainer.innerHTML = `
      <div style="background: gray; width: 100%; height: 20px;">
        <div style="background: green; width: ${percentage}%; height: 100%;"></div>
        <span style="color: white; position: absolute; left: 50%; transform: translateX(-50%);">
          ${eatenGhosts} / ${totalExperiences} experiences
        </span>
      </div>
    `;
  }

  function showExperienceInfo(expId) {
    const experience = experiences.find((exp) => exp.id === expId);
    alert(
      `Unlocked Experience:\n\nCompany: ${experience.company}\nPosition: ${experience.position}\nDescription: ${experience.description}`
    );
  }

  function getRandomDirection() {
    const directions = [
      { dx: 1 / tileSize, dy: 0 },
      { dx: -1 / tileSize, dy: 0 },
      { dx: 0, dy: 1 / tileSize },
      { dx: 0, dy: -1 / tileSize },
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  document.addEventListener('keydown', keyDown);
}
