import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import engine from "../shared/game/engine";
import World from "./world/world";
import Bullets from "./entities/bullets";
import Player from "./player/player";
import {
  ConnectedPayload,
  RotatedPayload,
  EngineActionType,
  Shape,
  MovedPayload,
} from "../shared/types";

export default function Game() {
  const { playerId, size, zoom, players } = useGame();

  React.useEffect(() => {
    engine.start();

    engine.on(EngineActionType.connect, (payload) => {
      const p = payload as ConnectedPayload;
      useGame.getState().setPlayerId(p.playerId);
      useGame.getState().setPlayers(p.players);
    });

    engine.on(EngineActionType.rotate, (payload) => {
      const p = payload as RotatedPayload;
      const { players, setPlayers } = useGame.getState();
      players[p.playerId - 1].r = p.r;
      setPlayers([...players]);
    });

    engine.on(EngineActionType.move, (payload) => {
      const p = payload as MovedPayload;
      const { players, setPlayers } = useGame.getState();
      players[p.playerId - 1].x = p.x;
      players[p.playerId - 1].y = p.y;
      setPlayers([...players]);
    });

    engine.on(EngineActionType.shoot, (payload) => {
      const p = payload as MovedPayload;
      console.log(p);
    });

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
            {players.map((player, index) => {
              if (player.id === -1) return null;
              return (
                <Player
                  key={player.id}
                  currentPlayer={player.id === playerId}
                  index={index}
                  player={player}
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
