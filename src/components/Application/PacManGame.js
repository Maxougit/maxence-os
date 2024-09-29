// PacManGame.jsx
import React, { useEffect, useRef } from 'react';
import initGame from './GameLogic';

const PacManGame = () => {
  const canvasRef = useRef(null);
  const histogramRef = useRef(null);
  const ghostListRef = useRef(null); // Nouvelle référence pour les fantômes capturés

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const canvas = canvasRef.current;
      const histogram = histogramRef.current;
      const ghostList = ghostListRef.current;
      initGame(canvas, histogram, ghostList); // Passer ghostList à initGame
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div ref={histogramRef} style={{ marginBottom: '20px' }}></div>
      <canvas ref={canvasRef} width={540} height={300} />
      <div
        id="capturedGhosts"
        ref={ghostListRef}
        style={{
          marginTop: '20px',
          width: '540px',
          background: '#333',
          padding: '10px',
          borderRadius: '5px',
          maxHeight: '150px',
          overflowY: 'auto',
          color: '#fff',
        }}
      >
        <h3>Fantômes Capturés :</h3>
        {/* Les informations des fantômes capturés seront ajoutées ici */}
      </div>
    </div>
  );
};

export default PacManGame;
