import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import engine from "../shared/game/engine";
import World from "./world/world";
import Bullets from "./entities/bullets";
import Player from "./player/player";
import { Shape, Weapon, Player as PlayerType } from "../shared/types";
import socket from "../services/socket";

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
    engine.socket = socket;
    engine.on("engine.connected", game.setPlayer);
    engine.on("engine.players", (players: PlayerType[]) => {
      game.setPlayers(players);
      engine.state.players = players;
    });
    engine.connect({
      name: "Enijar",
      shape: Shape.triangle,
      weapon: Weapon.handgun,
      color: "#ff0000",
    });
    return engine.disconnect;
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
