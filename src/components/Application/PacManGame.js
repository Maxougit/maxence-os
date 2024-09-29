import React, { useEffect, useRef } from "react";
import initGame from "./GameLogic";

const PacManGame = () => {
  const canvasRef = useRef(null);
  const histogramRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const canvas = canvasRef.current;
      const histogram = histogramRef.current;
      initGame(canvas, histogram);
    }
  }, []);

  return (
    <div>
      <div ref={histogramRef} style={{ marginBottom: "20px" }}></div>
      <canvas ref={canvasRef} width={540} height={300} />
    </div>
  );
};

export default PacManGame;
