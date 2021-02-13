import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import engine from "./engine";
import useControlledPlayer from "./hooks/use-controlled-player";
import World from "./world/world";
import Player from "./player/player";

export default function Game() {
  const {
    players,
    setPlayers,
    setSize,
    currentPlayerId,
    setCurrentPlayerId,
    size,
    zoom,
  } = useGame();

  useControlledPlayer();

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
    const { players } = engine.getState();
    const currentPlayerId = players[0].id;
    setPlayers(players);
    engine.setState({ currentPlayerId });
    engine.start();
    return engine.destroy;
  }, [setPlayers, setCurrentPlayerId]);

  return (
    <GameWrapper>
      <Canvas>
        <React.Suspense fallback={null}>
          <World>
            {currentPlayerId === "" && (
              <OrthographicCamera
                makeDefault
                position={[0, 0, size]}
                zoom={size * zoom}
              />
            )}

            {players.map((player) => {
              return (
                <Player
                  key={player.id}
                  {...player}
                  currentPlayer={player.id === currentPlayerId}
                />
              );
            })}
          </World>
        </React.Suspense>
      </Canvas>
    </GameWrapper>
  );
}
