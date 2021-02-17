import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import engine from "../shared/game/engine";
import World from "./world/world";
import Bullets from "./entities/bullets";
import Player from "./player/player";
import { ConnectedPayload, EngineActionType, Shape } from "../shared/types";

export default function Game() {
  const { playerId, size, zoom, playerIds } = useGame();

  React.useEffect(() => {
    engine.on(EngineActionType.connect, (payload) => {
      const p = payload as ConnectedPayload;
      useGame.getState().setPlayerId(p.playerId);
      useGame.getState().setPlayerIds(p.players.map((player) => player.id));
    });

    // engine.on(EngineActionType.disconnect, (payload) => {
    //   const p = payload as ConnectedPayload;
    //   useGame.getState().setPlayerId(p.playerId);
    //   useGame.getState().setPlayerIds(p.players.map((player) => player.id));
    // });

    engine.emit(EngineActionType.connect, {
      name: "Enijar",
      shape: Shape.triangle,
      color: "#ff0000",
    });

    // todo set player id dynamically
    useGame.getState().setPlayerId(1);

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
    engine.start();
    return engine.destroy;
  }, []);

  return (
    <GameWrapper>
      <Canvas>
        <React.Suspense fallback={null}>
          <World>
            {/*Default camera if there is no current player*/}
            {playerId === null && (
              <OrthographicCamera
                makeDefault
                position={[0, 0, size]}
                zoom={size * zoom}
              />
            )}
            {playerIds.map((id) => {
              if (id === -1) return null;
              return (
                <Player key={id} id={id} currentPlayer={id === playerId} />
              );
            })}
            <Bullets />
          </World>
        </React.Suspense>
      </Canvas>
    </GameWrapper>
  );
}
