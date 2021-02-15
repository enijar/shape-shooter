import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import engine from "../shared/game/engine";
import World from "./world/world";
import Bullets from "./entities/bullets";
import Player from "./player/player";
import { Shape, Weapon } from "../shared/types";

export default function Game() {
  const { player, size, zoom, players } = useGame();

  React.useEffect(() => {
    function onResize() {
      useGame
        .getState()
        .setSize(Math.max(window.innerWidth, window.innerHeight));
    }

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  React.useEffect(() => {
    const game = useGame.getState();
    game.setPlayer({
      id: 1,
      active: true,
      x: 0,
      y: 0,
      r: 0,
      health: 0.8,
      speed: 0.005,
      name: "Enijar",
      shape: Shape.triangle,
      weapon: Weapon.handgun,
      color: "#ff0000",
      lastShotTime: 0,
      shootingSpeed: 0.75,
    });
    game.setPlayers(engine.state.players);
    return engine.destroy;
  }, []);

  return (
    <GameWrapper>
      <Canvas>
        <React.Suspense fallback={null}>
          <World>
            {/*Default camera if there is no current player*/}
            {player === null && (
              <OrthographicCamera
                makeDefault
                position={[0, 0, size]}
                zoom={size * zoom}
              />
            )}
            {players.map((p, index) => {
              return (
                <Player
                  key={p.id}
                  currentPlayer={p.id === player?.id}
                  index={index}
                  player={p}
                />
              );
            })}
            <Bullets />
          </World>
        </React.Suspense>
      </Canvas>
    </GameWrapper>
  );
}
