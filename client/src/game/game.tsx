import React from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useHistory } from "react-router-dom";
import {
  DeathMenu,
  Leaderboard,
  GameWrapper,
  LeaderboardPlayer,
  LeaderboardPlayerName,
  LeaderboardPlayerKills,
} from "./styles";
import io from "../services/io";
import { useGame } from "./state";
import World from "./world/world";
import Player from "./entities/player";
import Bullets from "./entities/bullets";
import vars from "../styles/vars";
import gameState from "./game-state";
import { ModifierData, PlayerData } from "@shape-shooter/shared";
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
  const [dead, setDead] = React.useState<boolean>(false);
  const topScoringPlayers = React.useMemo<PlayerData[]>(() => {
    return players.sort((a, b) => b.kills - a.kills).slice(0, 3);
  }, [players]);

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
      setModifiers(state.modifiers);
    }

    function onPlayerDeath(playerId: number) {
      const { players, setPlayers, currentPlayer } = useGame.getState();
      setPlayers(players.filter((player) => player.id !== playerId));
      if (currentPlayer) {
        if (playerId === currentPlayer.id) {
          setDead(true);
        }
      }
    }

    function onPlayerKill(state: any) {
      const { players, setPlayers } = useGame.getState();
      setPlayers(
        players.map((player) => {
          if (player.id === state.playerId) {
            player.kills = state.kills;
          }
          return player;
        })
      );
    }

    function onTick(state: any) {
      const { players, setPlayers } = useGame.getState();
      gameState.players = state.players;
      if (state.players.length !== players.length) {
        setPlayers(state.players);
      }
    }

    function onModifiers(modifiers: ModifierData[]) {
      useGame.getState().setModifiers(Object.values(modifiers));
    }

    function onConnect() {
      io.emit("game.join", { name, shape, color });
    }

    function onDisconnect() {
      const { setCurrentPlayer, setPlayers } = useGame.getState();
      setCurrentPlayer(null);
      setPlayers([]);
    }

    const socket = io.connect();
    useGame.getState().setSocket(socket);
    io.on("game.joined", onJoined);
    io.on("game.player.death", onPlayerDeath, false);
    io.on("game.player.kill", onPlayerKill);
    io.on("game.modifiers", onModifiers);
    io.on("game.tick", onTick);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      io.off("game.joined", onJoined);
      io.on("game.player.death", onPlayerDeath);
      io.off("game.player.kill", onPlayerKill);
      io.off("game.modifiers", onModifiers);
      io.off("game.tick", onTick);
      if (socket !== null) {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      }
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
      io.disconnect();
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
      <Leaderboard>
        {topScoringPlayers.map((player) => {
          return (
            <LeaderboardPlayer key={player.id}>
              <LeaderboardPlayerName>{player.name}</LeaderboardPlayerName>
              <LeaderboardPlayerKills>
                {player.kills} kill{player.kills !== 1 ? "s" : ""}
              </LeaderboardPlayerKills>
            </LeaderboardPlayer>
          );
        })}
      </Leaderboard>
      <DeathMenu show={dead}>
        <h3>You died!</h3>
        <button
          onClick={() => {
            setDead(false);
            io.emit("game.join", { name, shape, color });
          }}
        >
          Respawn
        </button>
      </DeathMenu>
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
