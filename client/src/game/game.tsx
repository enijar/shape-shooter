import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import World from "./world/world";
// import Bullets from "./entities/bullets";
import Player from "./player/player";
import engine, { EnginePlayerShape } from "../shared/game/engine";
import Bullets from "./entities/bullets";

export default function Game() {
  const { size, zoom, player, players } = useGame();

  React.useEffect(() => {
    engine.start();
    const listener = engine.subscribe("connected", (payload: any) => {
      console.log("connected");
      const game = useGame.getState();
      game.setPlayer(payload.player);
      game.setPlayers(payload.players);
    });
    engine.connect("Enijar", EnginePlayerShape.triangle, "#ff0000");
    return () => {
      listener();
      engine.stop();
    };
  }, []);

  React.useEffect(() => {
    // engine.on(EngineActionType.connect, (payload) => {
    //   const p = payload as ConnectedPayload;
    //   useGame.getState().setPlayerId(p.playerId);
    //   useGame.getState().setPlayerIds(p.players.map((player) => player.id));
    // });
    //
    // engine.on(EngineActionType.tick, (payload) => {
    //   const p = payload as TickedPayload;
    //   state.players = p.players;
    //   state.bullets = p.bullets;
    // });
    //
    // engine.emit(EngineActionType.connect, {
    //   name: "Enijar",
    //   shape: Shape.triangle,
    //   color: "#ff0000",
    // });

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
