'use strict';
import React from 'react';
import { isMobileDevice } from '@/utils/device';

const COLS = 24;
const ROWS = 14;
const START_SPEED_MS = 160;
const MIN_SPEED_MS = 70;

// Flèches, ZQSD (AZERTY) et WASD (QWERTY)
const KEY_DIRECTIONS = {
  arrowup: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 },
  arrowleft: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 },
  z: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  q: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

class TerminalSnake extends React.Component {
  constructor(props) {
    super(props);

    const snake = [
      { x: 8, y: 7 },
      { x: 7, y: 7 },
      { x: 6, y: 7 },
    ];

    this.state = {
      snake,
      food: this.spawnFood(snake),
      score: 0,
      gameOver: false,
      showTouchControls: false,
    };

    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    this.setState({ showTouchControls: isMobileDevice() });
    this.scheduleTick();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    clearTimeout(this.tickTimeout);
    clearTimeout(this.exitTimeout);
  }

  scheduleTick = () => {
    const speed = Math.max(MIN_SPEED_MS, START_SPEED_MS - this.state.score * 4);
    this.tickTimeout = setTimeout(this.tick, speed);
  };

  spawnFood = (snake) => {
    const free = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!snake.some((cell) => cell.x === x && cell.y === y)) {
          free.push({ x, y });
        }
      }
    }
    return free[Math.floor(Math.random() * free.length)];
  };

  setDirection = (direction) => {
    // Interdit le demi-tour sur place
    if (direction.x === -this.direction.x && direction.y === -this.direction.y) {
      return;
    }
    this.nextDirection = direction;
  };

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.props.onExit(this.state.score, true);
      return;
    }

    const direction = KEY_DIRECTIONS[event.key.toLowerCase()];
    if (direction) {
      event.preventDefault();
      this.setDirection(direction);
    }
  };

  tick = () => {
    if (this.state.gameOver) return;

    this.direction = this.nextDirection;
    const { snake, food, score } = this.state;
    const head = {
      x: snake[0].x + this.direction.x,
      y: snake[0].y + this.direction.y,
    };

    const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
    // La queue avance en même temps que la tête, elle n'est donc pas une collision
    const hitSelf = snake
      .slice(0, -1)
      .some((cell) => cell.x === head.x && cell.y === head.y);

    if (hitWall || hitSelf) {
      this.setState({ gameOver: true });
      this.exitTimeout = setTimeout(
        () => this.props.onExit(this.state.score, false),
        1500
      );
      return;
    }

    const eats = head.x === food.x && head.y === food.y;
    const newSnake = [head, ...(eats ? snake : snake.slice(0, -1))];

    this.setState(
      {
        snake: newSnake,
        food: eats ? this.spawnFood(newSnake) : food,
        score: eats ? score + 1 : score,
      },
      this.scheduleTick
    );
  };

  renderGrid = () => {
    const { snake, food } = this.state;
    const rows = ['┌' + '─'.repeat(COLS) + '┐'];

    for (let y = 0; y < ROWS; y++) {
      let row = '│';
      for (let x = 0; x < COLS; x++) {
        if (snake[0].x === x && snake[0].y === y) {
          row += '@';
        } else if (snake.some((cell) => cell.x === x && cell.y === y)) {
          row += 'o';
        } else if (food.x === x && food.y === y) {
          row += '*';
        } else {
          row += ' ';
        }
      }
      rows.push(row + '│');
    }

    rows.push('└' + '─'.repeat(COLS) + '┘');
    return rows.join('\n');
  };

  render() {
    const { score, gameOver, showTouchControls } = this.state;
    const touchButtonStyle = {
      background: 'transparent',
      border: '1px solid limegreen',
      color: 'limegreen',
      borderRadius: '4px',
      padding: '8px 16px',
      fontSize: '16px',
    };

    return (
      <div>
        <p>{gameOver ? `GAME OVER — score : ${score}` : `SNAKE — score : ${score}`}</p>
        <pre style={{ lineHeight: 1.05, margin: 0 }}>{this.renderGrid()}</pre>
        <p style={{ opacity: 0.7 }}>
          Flèches ou ZQSD pour se déplacer — Échap pour quitter
        </p>
        {showTouchControls && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              style={touchButtonStyle}
              onClick={() => this.setDirection({ x: -1, y: 0 })}
            >
              ◀
            </button>
            <button
              style={touchButtonStyle}
              onClick={() => this.setDirection({ x: 0, y: -1 })}
            >
              ▲
            </button>
            <button
              style={touchButtonStyle}
              onClick={() => this.setDirection({ x: 0, y: 1 })}
            >
              ▼
            </button>
            <button
              style={touchButtonStyle}
              onClick={() => this.setDirection({ x: 1, y: 0 })}
            >
              ▶
            </button>
            <button
              style={{ ...touchButtonStyle, marginLeft: 'auto' }}
              onClick={() => this.props.onExit(this.state.score, true)}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default TerminalSnake;
