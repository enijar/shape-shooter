import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import { Shape } from "../shared/types";
import game from "../shared/game/game";
import World from "./world/world";
import Player from "./player/player";
import Bullets from "./entities/bullets";

export default function Game() {
  const { size, zoom, player, players } = useGame();

  React.useEffect(() => {
    game.start();
    const player = game.addPlayer("Enijar", Shape.triangle, "#ff0000");
    useGame.getState().setPlayer(player);
    useGame.getState().setPlayers(game.players);
    return () => {
      game.stop();
    };
  }, []);

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
              if (p.id === -1) return null;
              return (
                <Player
                  key={p.id}
                  index={index}
                  player={p}
                  currentPlayer={p.id === player?.id}
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
