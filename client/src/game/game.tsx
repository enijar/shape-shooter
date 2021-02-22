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
  const { size, zoom, players, currentPlayer, instance } = useGame();

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
    useGame.getState().setCurrentPlayer(player);
  }, [instance]);

  React.useEffect(() => {
    instance.start();
    return () => {
      instance.stop();
      const { setCurrentPlayer, setPlayers } = useGame.getState();
      setCurrentPlayer(null);
      setPlayers([]);
    };
  }, [instance]);

  React.useEffect(() => {
    function onResize() {
      useGame
        .getState()
        .setSize(Math.max(window.innerWidth, window.innerHeight));
    }

    function onContextMenu(event: MouseEvent) {
      event.preventDefault();
    }

    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("contextmenu", onContextMenu);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  return (
    <GameWrapper>
      <Canvas>
        <React.Suspense fallback={null}>
          <World size={instance.mapSize}>
            {/*Default camera if there is no current player*/}
            {currentPlayer === null && (
              <OrthographicCamera
                makeDefault
                position={[0, 0, size]}
                zoom={size * zoom}
              />
            )}
            {players.map((player) => {
              if (player.id === -1) return null;
              return (
                <Player
                  key={player.id}
                  player={player}
                  currentPlayer={player.id === currentPlayer?.id}
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
