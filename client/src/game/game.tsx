import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import engine, { EnginePlayerShape } from "../shared/game/engine";
import World from "./world/world";
import Player from "./player/player";
import Bullets from "./entities/bullets";

export default function Game() {
  const { size, zoom, player, players } = useGame();

  React.useEffect(() => {
    engine.start();
    return () => engine.stop();
  }, []);

  React.useEffect(() => {
    const listener = engine.subscribe("connected", (payload: any) => {
      const game = useGame.getState();
      game.setPlayer(payload.player);
      game.setPlayers(payload.players);
    });
    // todo remove when client is connected to server
    engine.connect("Test Player", EnginePlayerShape.triangle, "#00ff00");
    engine.connect("Enijar", EnginePlayerShape.triangle, "#ff0000");
    return () => listener();
  }, []);

  React.useEffect(() => {
    const listener = engine.subscribe("player.damage", (payload: any) => {
      const { players, setPlayers } = useGame.getState();
      setPlayers(
        players.map((p) => {
          if (p.id === payload.playerId) {
            p.hp = payload.hp;
          }
          return p;
        })
      );
    });
    return () => listener();
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
            {players.map((p) => {
              if (p.id === -1) return null;
              return (
                <Player
                  key={p.id}
                  id={p.id}
                  shape={p.shape}
                  color={p.color}
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
