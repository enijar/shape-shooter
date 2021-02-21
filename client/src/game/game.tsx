import React from "react";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import { GameEventType, Shape } from "../shared/types";
import PlayerType from "../shared/game/entities/player";
import World from "./world/world";
import Player from "./player/player";
import Bullets from "./entities/bullets";

export default function Game() {
  const { size, zoom, player, players, instance } = useGame();

  React.useEffect(() => {
    return instance.subscribe(
      GameEventType.playerConnected,
      (player: PlayerType) => {
        const { players, setPlayers } = useGame.getState();
        setPlayers(players.concat([player]));
        console.log("playerConnected->player", player);
      }
    );
  }, [instance]);

  React.useEffect(() => {
    return instance.subscribe(
      GameEventType.playerDisconnected,
      (playerId: number) => {
        const { players, setPlayers } = useGame.getState();
        setPlayers(players.filter((player) => player.id !== playerId));
        console.log("playerDisconnected->playerId", playerId);
      }
    );
  }, [instance]);

  React.useEffect(() => {
    const player = instance.addPlayer("Enijar", Shape.triangle, "#ff0000");
    useGame.getState().setPlayer(player);
  }, [instance]);


  React.useEffect(() => {
    instance.start();
    return () => {
      instance.stop();
      const { setPlayer, setPlayers } = useGame.getState();
      setPlayer(null);
      setPlayers([]);
    };
  }, [instance]);

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
          <World size={instance.mapSize}>
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
