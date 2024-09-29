import { experiences } from './experiencesData';

export default function initGame(canvas, histogramContainer, ghostList) {
  if (typeof window === 'undefined') return;

  const ctx = canvas.getContext('2d');
  const tileSize = 20;
  const pacmanSpeed = 2;

  // Carte du jeu (1 = mur, 2 = pellet, 0 = vide)
  const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
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

  // Paramètres de Pac-Man
  const pacman = {
    gridX: 1,
    gridY: 1,
    x: 1 * tileSize + tileSize / 2, // Position centrée en pixels
    y: 1 * tileSize + tileSize / 2,
    dx: pacmanSpeed, // Vitesse en pixels par frame
    dy: 0,
    speed: pacmanSpeed,
    radius: tileSize * 0.4, // Rayon pour la hitbox
    direction: { dx: pacmanSpeed, dy: 0 }, // Direction initiale vers la droite
  };

  // Fantômes
  const ghosts = [];

  let score = 0;
  let imagesLoaded = 0;
  const totalImages = experiences.length + 1;

  // Chargement de l'image de Pac-Man
  const pacmanImg = new Image();
  pacmanImg.src = '/images/pacman.png';
  pacmanImg.onload = imageLoaded;
  pacmanImg.onerror = () => console.error("Erreur lors du chargement de l'image Pac-Man");

  // Chargement des images des fantômes
  const ghostImages = experiences.map((exp, index) => {
    const img = new Image();
    img.src = exp.image;
    img.onload = imageLoaded;
    img.onerror = () =>
      console.error(`Erreur lors du chargement de l'image pour ${exp.company}`);
    return { img, id: exp.id, radius: tileSize * 0.4 }; // Rayon pour la hitbox
  });

  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      initGhostsWithCheck();
    }
  }

  function initGhosts() {
    const positions = [
      { gridX: 9, gridY: 9 },
      { gridX: 8, gridY: 5 },
      { gridX: 10, gridY: 6 },
      { gridX: 10, gridY: 6 }, // Assurez-vous que chaque fantôme a une position unique ou une logique spécifique
    ];

    positions.forEach((pos, index) => {
      // Vérifier si l'index dépasse le nombre d'expériences pour éviter les erreurs
      if (index >= ghostImages.length) return;

      ghosts.push({
        gridX: pos.gridX,
        gridY: pos.gridY,
        x: pos.gridX * tileSize + tileSize / 2,
        y: pos.gridY * tileSize + tileSize / 2,
        img: ghostImages[index].img,
        id: ghostImages[index].id,
        direction: getRandomDirection(), // Direction initiale aléatoire
        radius: ghostImages[index].radius, // Rayon pour la hitbox
      });
    });
  }

  // Fonction pour s'assurer qu'il n'y a pas de collision initiale
  function ensureNoInitialCollision() {
    ghosts.forEach((ghost) => {
      const distance = Math.sqrt(
        Math.pow(pacman.x - ghost.x, 2) + Math.pow(pacman.y - ghost.y, 2)
      );
      if (distance < pacman.radius + ghost.radius + 5) {
        // Ajouter une marge de sécurité
        ghost.x += tileSize;
        ghost.y += tileSize;
      }
    });
  }

  function initGhostsWithCheck() {
    initGhosts();
    ensureNoInitialCollision();
    updateHistogram();
    requestAnimationFrame(gameLoop);
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
    const nextX = pacman.x + pacman.direction.dx;
    const nextY = pacman.y + pacman.direction.dy;

    // Vérifier le mouvement horizontal
    if (canMoveToPixel(nextX, pacman.y)) {
      pacman.x = nextX;
    } else {
      pacman.direction.dx = 0; // Arrêter le mouvement horizontal en cas de mur
    }

    // Vérifier le mouvement vertical
    if (canMoveToPixel(pacman.x, nextY)) {
      pacman.y = nextY;
    } else {
      pacman.direction.dy = 0; // Arrêter le mouvement vertical en cas de mur
    }

    const mapX = Math.floor(pacman.x / tileSize);
    const mapY = Math.floor(pacman.y / tileSize);

    // Manger un pellet
    if (map[mapY][mapX] === 2) {
      map[mapY][mapX] = 0;
      score++;
      updateHistogram();
    }
  }

  function updateGhosts() {
    ghosts.forEach((ghost) => {
      const nextX = ghost.x + ghost.direction.dx;
      const nextY = ghost.y + ghost.direction.dy;

      // Déplacement horizontal si possible
      if (canMoveToPixel(nextX, ghost.y)) {
        ghost.x = nextX;
      } else {
        ghost.direction = getRandomDirection(); // Changer de direction en cas de mur
      }

      // Déplacement vertical si possible
      if (canMoveToPixel(ghost.x, nextY)) {
        ghost.y = nextY;
      } else {
        ghost.direction = getRandomDirection(); // Changer de direction en cas de mur
      }
    });
  }

  function checkCollisions() {
    // Utiliser une boucle for inversée pour éviter les problèmes lors de la suppression
    for (let i = ghosts.length - 1; i >= 0; i--) {
      const ghost = ghosts[i];
      if (checkCircleCollision(pacman, ghost)) {
        ghosts.splice(i, 1); // Supprimer le fantôme avant d'appeler la notification
        updateHistogram();
        showExperienceInfo(ghost.id); // Afficher les infos de l'expérience
      }
    }
  }

  /**
   * Vérifie la collision entre deux cercles.
   * @param {Object} circle1 - Premier cercle (Pac-Man) avec x, y et radius.
   * @param {Object} circle2 - Deuxième cercle (Fantôme) avec x, y et radius.
   * @returns {boolean} - True si les cercles se chevauchent, sinon false.
   */
  function checkCircleCollision(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const combinedRadii = circle1.radius + circle2.radius;
    return distance < combinedRadii;
  }

  /**
   * Détermine si la position suivante en pixels est accessible (pas un mur).
   * @param {number} x - Coordonnée X en pixels.
   * @param {number} y - Coordonnée Y en pixels.
   * @returns {boolean} - True si la position est accessible, sinon false.
   */
  function canMoveToPixel(x, y) {
    const mapX = Math.floor(x / tileSize);
    const mapY = Math.floor(y / tileSize);

    // Vérifier les limites de la carte
    if (mapY < 0 || mapY >= ROWS || mapX < 0 || mapX >= COLS) return false;

    // Vérifier si la position est un mur
    return map[mapY][mapX] !== 1;
  }

  /**
   * Dessine le fond du jeu.
   */
  function drawBackground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Dessine la carte du jeu, y compris les murs et les pellets.
   */
  function drawMap() {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (map[y][x] === 1) {
          ctx.fillStyle = 'blue'; // Murs en bleu
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else if (map[y][x] === 2) {
          ctx.fillStyle = 'white'; // Pellets en blanc
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

  /**
   * Dessine Pac-Man sur le canvas.
   */
  function drawPacman() {
    ctx.drawImage(
      pacmanImg,
      pacman.x - pacman.radius,
      pacman.y - pacman.radius,
      pacman.radius * 2,
      pacman.radius * 2
    );
  }

  /**
   * Dessine tous les fantômes sur le canvas.
   */
  function drawGhosts() {
    ghosts.forEach((ghost) => {
      ctx.drawImage(
        ghost.img,
        ghost.x - ghost.radius,
        ghost.y - ghost.radius,
        ghost.radius * 2,
        ghost.radius * 2
      );
    });
  }

  /**
   * Gère les événements de pression de touches pour changer la direction de Pac-Man.
   * @param {KeyboardEvent} event - L'événement de touche enfoncée.
   */
  function keyDown(event) {
    switch (event.keyCode) {
      case 37: // Flèche gauche
        pacman.direction = { dx: -pacmanSpeed, dy: 0 };
        break;
      case 38: // Flèche haut
        pacman.direction = { dx: 0, dy: -pacmanSpeed };
        break;
      case 39: // Flèche droite
        pacman.direction = { dx: pacmanSpeed, dy: 0 };
        break;
      case 40: // Flèche bas
        pacman.direction = { dx: 0, dy: pacmanSpeed };
        break;
    }
  }

  /**
   * Met à jour l'élément UI de l'histogramme en fonction du nombre de fantômes mangés.
   */
  function updateHistogram() {
    const totalExperiences = experiences.length;
    const eatenGhosts = totalExperiences - ghosts.length;
    const percentage = (eatenGhosts / totalExperiences) * 100;

    histogramContainer.innerHTML = `
      <div style="position: relative; background: gray; width: 100%; height: 20px; border-radius: 5px;">
        <div style="background: green; width: ${percentage}%; height: 100%; border-radius: 5px;"></div>
        <span style="color: white; position: absolute; left: 50%; top: 0; transform: translateX(-50%); font-size: 12px;">
          ${eatenGhosts} / ${totalExperiences} expériences
        </span>
      </div>
    `;
  }

  /**
   * Affiche les informations sur l'expérience débloquée lorsqu'un fantôme est mangé.
   * @param {number|string} expId - L'ID de l'expérience.
   */
  function showExperienceInfo(expId) {
    const experience = experiences.find((exp) => exp.id === expId);
    if (experience) {
      // Créer un élément pour afficher les informations
      const ghostInfo = document.createElement('div');
      ghostInfo.classList.add('ghost-info');

      const ghostImg = document.createElement('img');
      ghostImg.src = experience.image;
      ghostImg.alt = experience.company;

      const details = document.createElement('div');
      details.classList.add('ghost-details');
      details.innerHTML = `
        <strong>${experience.company}</strong><br/>
        ${experience.position}<br/>
        ${experience.description}
      `;

      ghostInfo.appendChild(ghostImg);
      ghostInfo.appendChild(details);

      // Ajouter l'info à la liste
      ghostList.appendChild(ghostInfo);

      // Optionnel : Ajouter une animation ou un effet pour attirer l'attention
      ghostInfo.style.opacity = '0';
      setTimeout(() => {
        ghostInfo.style.transition = 'opacity 0.5s';
        ghostInfo.style.opacity = '1';
      }, 100);
    } else {
      console.error(`Expérience avec l'ID ${expId} non trouvée.`);
    }
  }

  /**
   * Retourne une direction aléatoire pour le mouvement des fantômes.
   * @returns {Object} - Un objet contenant dx et dy.
   */
  function getRandomDirection() {
    const directions = [
      { dx: pacmanSpeed, dy: 0 }, // Droite
      { dx: -pacmanSpeed, dy: 0 }, // Gauche
      { dx: 0, dy: pacmanSpeed }, // Bas
      { dx: 0, dy: -pacmanSpeed }, // Haut
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  // S'assurer que Pac-Man est toujours en mouvement en définissant une direction initiale
  pacman.direction = { dx: pacmanSpeed, dy: 0 };

  // Ajouter l'écouteur d'événements pour les touches
  document.addEventListener('keydown', keyDown);
}
