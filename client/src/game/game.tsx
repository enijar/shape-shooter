import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import engine from "./engine";
import World from "./world/world";
import Player from "./player/player";
import Bullet from "./bullet/bullet";

export default function Game() {
  const {
    player,
    players,
    setPlayers,
    bullets,
    setSize,
    setCurrentPlayerId,
    size,
    zoom,
  } = useGame();

  React.useEffect(() => {
    function onResize() {
      setSize(Math.max(window.innerWidth, window.innerHeight));
    }

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [setSize]);

  React.useEffect(() => {
    const game = useGame.getState();
    game.setPlayer(engine.state.player);
    game.setPlayers(engine.state.players);
    return engine.destroy;
  }, [setPlayers, setCurrentPlayerId]);

  return (
    <GameWrapper>
      <Canvas>
        <React.Suspense fallback={null}>
          <World>
            {/* Default camera if there is no current player */}
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

            {bullets.map((bullet) => {
              if (!bullet.active) return null;
              return <Bullet key={bullet.id} bullet={bullet} />;
            })}
          </World>
        </React.Suspense>
      </Canvas>
    </GameWrapper>
  );
}
