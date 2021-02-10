import React from "react";
import { Canvas } from "react-three-fiber";
import { GameWrapper } from "./styles";
import World from "./world/world";
import Player from "./player/player";

export default function Game() {
  return (
    <GameWrapper>
      <Canvas>
        <React.Suspense fallback={null}>
          <World>
            <Player />
          </World>
        </React.Suspense>
      </Canvas>
    </GameWrapper>
  );
}
