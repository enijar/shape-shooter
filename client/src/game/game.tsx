import React from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useHistory } from "react-router-dom";
import io from "../services/io";
import { GameWrapper } from "./styles";
import { useGame } from "./state";
import World from "./world/world";
import Player from "./entities/player";
import Bullets from "./entities/bullets";
import vars from "../styles/vars";
import gameState from "./game-state";
import { ModifierData } from "../shared/types";
import Modifier from "./entities/modifier";

export default function Game() {
  const history = useHistory();
  const {
    name,
    shape,
    color,
    size,
    zoom,
    players,
    currentPlayer,
    mapSize,
    modifiers,
  } = useGame();

  React.useEffect(() => {
    if (!name || !shape || !color) {
      history.push("/");
      return;
    }

    function onJoined(state: any) {
      const {
        setCurrentPlayer,
        setPlayers,
        setMapSize,
        setMapBounds,
        setModifiers,
      } = useGame.getState();
      setCurrentPlayer(state.currentPlayer);
      setPlayers(state.players);
      setMapSize(state.mapSize);
      setMapBounds(state.mapBounds);
      setModifiers(state.modifiers ?? []);
    }
    function onPlayerJoin(state: any) {
      useGame.getState().setPlayers(state.players);
    }
    function onPlayerLeave(state: any) {
      useGame.getState().setPlayers(state.players);
    }
    function onPlayerDeath(playerId: number) {
      const { players, setPlayers, currentPlayer } = useGame.getState();
      setPlayers(players.filter((player) => player.id !== playerId));
      if (currentPlayer) {
        if (playerId === currentPlayer.id) {
          history.push("/");
        }
      }
    }
    function onTick(state: any) {
      gameState.players = state.players;
    }
    function onModifiers(modifiers: ModifierData[]) {
      useGame.getState().setModifiers(modifiers ?? []);
    }
    function onDisconnect() {
      console.log("disconnect");
    }

    const socket = io.connect();
    useGame.getState().setSocket(socket);
    io.on("game.joined", onJoined);
    io.on("game.tick", onTick);
    io.on("game.player.join", onPlayerJoin);
    io.on("game.player.leave", onPlayerLeave);
    io.on("game.player.death", onPlayerDeath);
    io.on("game.modifiers", onModifiers);
    io.on("disconnected", onDisconnect);
    io.emit("game.join", { name, shape, color });

    return () => {
      const { setCurrentPlayer, setPlayers, setSocket } = useGame.getState();
      setCurrentPlayer(null);
      setPlayers([]);
      setSocket(null);
      io.off("game.joined", onJoined);
      io.off("game.player.join", onPlayerJoin);
      io.off("game.player.leave", onPlayerLeave);
      io.off("game.tick", onTick);
      io.off("game.modifiers", onModifiers);
      io.off("disconnected", onDisconnect);
      io.disconnect();
    };
  }, [name, shape, color, history]);

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

  const handleCreated = React.useCallback(({ gl }) => {
    gl.gammaFactor = 2.2;
    gl.toneMapping = THREE.CineonToneMapping;
    gl.toneMappingExposure = 0.75;
    gl.outputEncoding = THREE.sRGBEncoding;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.setClearColor(vars.color.gameBackground);
  }, []);

  return (
    <GameWrapper>
      <Canvas onCreated={handleCreated}>
        <React.Suspense fallback={null}>
          <World size={mapSize}>
            {/*Default camera if there is no current player*/}
            {currentPlayer === null && (
              <OrthographicCamera
                makeDefault
                position={[0, 0, size]}
                zoom={size * zoom}
              />
            )}
            {players.map((player) => {
              if (player === null) return null;
              return (
                <Player
                  key={player.id}
                  currentPlayer={player.id === currentPlayer?.id}
                  id={player.id}
                  name={player.name}
                  shape={player.shape}
                  color={player.color}
                />
              );
            })}
            {modifiers.map((modifier, index) => {
              return (
                <Modifier
                  key={index}
                  x={modifier.x}
                  y={modifier.y}
                  status={modifier.status}
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
