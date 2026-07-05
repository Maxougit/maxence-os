// Logique du jeu Server Rescue, séparée du composant React
// pour rester testable et compatible Fast Refresh

export const TICK_MS = 250;
export const RESTART_TICKS = 4; // ~1 seconde pour redémarrer un pod
export const BEST_SCORE_KEY = 'serverRescueBest';

const POD_BASE_NAMES = [
  'api-gateway',
  'auth-service',
  'payment-api',
  'user-service',
  'frontend',
  'redis-cache',
  'postgres-db',
  'worker-queue',
  'ingress-nginx',
  'prometheus',
  'grafana',
  'ci-runner',
];

const randomSuffix = () => Math.random().toString(16).slice(2, 7);

const createPods = () =>
  POD_BASE_NAMES.map((name, id) => ({
    id,
    name: `${name}-${randomSuffix()}`,
    status: 'running',
    restartTicks: 0,
  }));

export const initialGame = (phase = 'idle') => ({
  phase,
  pods: createPods(),
  health: 100,
  fixed: 0,
  ticks: 0,
  crashCountdown: 14,
});

// Un tick de simulation : les pods redémarrent, de nouveaux crashent
// de plus en plus vite, et la santé du cluster suit l'état des pods
export const step = (game) => {
  if (game.phase !== 'playing') return game;

  const ticks = game.ticks + 1;
  let pods = game.pods.map((pod) => {
    if (pod.status !== 'restarting') return pod;
    return pod.restartTicks > 1
      ? { ...pod, restartTicks: pod.restartTicks - 1 }
      : { ...pod, status: 'running', restartTicks: 0 };
  });

  let crashCountdown = game.crashCountdown - 1;
  if (crashCountdown <= 0) {
    const running = pods.filter((pod) => pod.status === 'running');
    if (running.length > 0) {
      const victim = running[Math.floor(Math.random() * running.length)];
      pods = pods.map((pod) =>
        pod.id === victim.id ? { ...pod, status: 'crashed' } : pod
      );
    }
    const base = Math.max(3, 14 - Math.floor(ticks / 40));
    crashCountdown = base + Math.floor(Math.random() * 4);
  }

  const crashedCount = pods.filter((pod) => pod.status === 'crashed').length;
  const health =
    crashedCount > 0
      ? Math.max(0, game.health - crashedCount * 0.7)
      : Math.min(100, game.health + 0.15);

  return {
    ...game,
    pods,
    ticks,
    crashCountdown,
    health,
    phase: health <= 0 ? 'gameover' : 'playing',
  };
};
