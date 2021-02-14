import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import engine from "../shared/game/engine";
import World from "./world/world";
import Bullets from "./entities/bullets";
import Player from "./player/player";

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
    game.setPlayer(engine.state.player);
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
            {player !== null && <Player player={player} currentPlayer={true} />}
            {players.map((player) => {
              return <Player key={player.id} player={player} />;
            })}
            <Bullets />
          </World>
        </React.Suspense>
      </Canvas>
    </GameWrapper>
  );
}
