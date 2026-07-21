'use client';
import { useState, useEffect } from 'react';

/**
 * Horloge « hydration-safe » : null au premier rendu (serveur et hydratation),
 * puis mise à jour asynchrone côté client à l'intervalle demandé.
 */
export default function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const raf = requestAnimationFrame(update);
    const timer = setInterval(update, intervalMs);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [intervalMs]);

  return now;
}
