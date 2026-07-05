import { initialGame, step } from './serverRescue';

describe('ServerRescue game logic', () => {
  it('ne fait rien tant que la partie est en idle', () => {
    const game = initialGame();
    expect(step(game)).toBe(game);
  });

  it('fait crasher un pod quand le compte à rebours atteint zéro', () => {
    let game = { ...initialGame('playing'), crashCountdown: 1 };
    game = step(game);
    expect(game.pods.filter((pod) => pod.status === 'crashed')).toHaveLength(1);
  });

  it('fait baisser la santé quand des pods sont crashés', () => {
    let game = { ...initialGame('playing'), crashCountdown: 1 };
    game = step(game);
    const healthAfterCrash = game.health;
    game = step(game);
    expect(game.health).toBeLessThan(healthAfterCrash);
  });

  it('régénère la santé quand tous les pods tournent', () => {
    const game = { ...initialGame('playing'), health: 50 };
    expect(step(game).health).toBeGreaterThan(50);
  });

  it('termine la partie quand la santé atteint zéro', () => {
    let game = { ...initialGame('playing'), health: 0.1, crashCountdown: 1 };
    game = step(game); // un pod crashe
    game = step(game); // la santé tombe à zéro
    expect(game.phase).toBe('gameover');
    expect(game.health).toBe(0);
  });

  it('remet un pod en marche après son redémarrage', () => {
    let game = initialGame('playing');
    game.pods[0] = { ...game.pods[0], status: 'restarting', restartTicks: 1 };
    game = step(game);
    expect(game.pods[0].status).toBe('running');
  });
});
