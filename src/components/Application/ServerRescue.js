'use client';
import React, { useEffect, useState } from 'react';
import { mdiKubernetes } from '@mdi/js';
import {
  TICK_MS,
  RESTART_TICKS,
  BEST_SCORE_KEY,
  initialGame,
  step,
} from '@/utils/serverRescue';

const POD_STYLES = {
  running: 'border-green-500/60 bg-green-500/10 text-green-400',
  crashed:
    'border-red-500 bg-red-500/20 text-red-400 animate-pulse cursor-pointer',
  restarting: 'border-yellow-500/60 bg-yellow-500/10 text-yellow-400',
};

const POD_LABELS = {
  running: 'Running',
  crashed: 'CrashLoopBackOff',
  restarting: 'Restarting',
};

const formatUptime = (ticks) => {
  const seconds = Math.floor((ticks * TICK_MS) / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

const KubernetesIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d={mdiKubernetes} />
  </svg>
);

const ServerRescue = () => {
  const [game, setGame] = useState(() => initialGame());
  const [best, setBest] = useState(() =>
    typeof window === 'undefined'
      ? 0
      : Number(localStorage.getItem(BEST_SCORE_KEY)) || 0
  );

  useEffect(() => {
    if (game.phase !== 'playing') return;
    const interval = setInterval(() => setGame(step), TICK_MS);
    return () => clearInterval(interval);
  }, [game.phase]);

  useEffect(() => {
    if (game.phase === 'gameover' && game.fixed > best) {
      localStorage.setItem(BEST_SCORE_KEY, String(game.fixed));
    }
  }, [game.phase, game.fixed, best]);

  const startGame = () => {
    setBest((current) => Math.max(current, game.fixed));
    setGame(initialGame('playing'));
  };

  const restartPod = (id) => {
    setGame((current) => {
      if (current.phase !== 'playing') return current;
      const pod = current.pods.find((p) => p.id === id);
      if (!pod || pod.status !== 'crashed') return current;
      return {
        ...current,
        fixed: current.fixed + 1,
        pods: current.pods.map((p) =>
          p.id === id
            ? { ...p, status: 'restarting', restartTicks: RESTART_TICKS }
            : p
        ),
      };
    });
  };

  const healthColor =
    game.health > 60
      ? 'bg-green-500'
      : game.health > 30
        ? 'bg-yellow-500'
        : 'bg-red-500';

  return (
    <div className="flex flex-col h-full min-w-[300px] md:min-w-[560px] bg-gray-900 text-gray-100 font-mono p-4 rounded-md overflow-auto">
      <div className="flex items-center gap-2 mb-3">
        <KubernetesIcon className="h-6 w-6 text-blue-400" />
        <span className="font-bold">Server Rescue</span>
        <span className="text-gray-500 text-xs ml-auto">
          kubectl get pods -n production
        </span>
      </div>

      {game.phase === 'idle' && (
        <div className="flex flex-col items-center justify-center flex-grow text-center gap-4 py-8">
          <KubernetesIcon className="h-16 w-16 text-blue-400" />
          <p className="font-bold text-lg">🚨 Le cluster de prod part en vrille !</p>
          <p className="text-sm text-gray-400 max-w-md">
            Des pods crashent de plus en plus vite. Clique sur les pods en{' '}
            <span className="text-red-400">CrashLoopBackOff</span>{' '}
            pour les redémarrer avant que la santé du cluster n&apos;atteigne
            0%.
          </p>
          {best > 0 && (
            <p className="text-sm text-gray-400">
              Record : {best} pods redémarrés
            </p>
          )}
          <button
            className="btn btn-success font-mono"
            onClick={startGame}
          >
            ▶ kubectl apply -f game.yaml
          </button>
        </div>
      )}

      {game.phase === 'gameover' && (
        <div className="flex flex-col items-center justify-center flex-grow text-center gap-4 py-8">
          <p className="font-bold text-2xl text-red-500">☠️ CLUSTER DOWN</p>
          <p className="text-sm text-gray-400">
            L&apos;astreinte va sonner... Uptime : {formatUptime(game.ticks)} —{' '}
            {game.fixed} pods redémarrés
          </p>
          <p className="text-sm text-gray-400">
            Record : {Math.max(best, game.fixed)} pods redémarrés
          </p>
          <button
            className="btn btn-success font-mono"
            onClick={startGame}
          >
            ↻ Rollback & réessayer
          </button>
        </div>
      )}

      {game.phase === 'playing' && (
        <>
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex-grow">
              <div className="flex justify-between text-xs mb-1">
                <span>Santé du cluster</span>
                <span>{Math.ceil(game.health)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${healthColor}`}
                  style={{ width: `${game.health}%` }}
                />
              </div>
            </div>
            <div className="text-right text-xs whitespace-nowrap">
              <p>⏱ {formatUptime(game.ticks)}</p>
              <p>🔧 {game.fixed} pods</p>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {game.pods.map((pod) => (
              <button
                key={pod.id}
                onClick={() => restartPod(pod.id)}
                className={`border rounded-md p-2 text-left transition-colors duration-150 ${POD_STYLES[pod.status]}`}
              >
                <div className="flex items-center gap-1">
                  <KubernetesIcon className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] truncate text-gray-300">
                    {pod.name}
                  </span>
                </div>
                <p className="text-[10px] font-bold mt-1">
                  {POD_LABELS[pod.status]}
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ServerRescue;
