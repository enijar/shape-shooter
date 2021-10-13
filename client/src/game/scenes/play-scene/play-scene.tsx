import React from "react";
import { Action, PlayerEntity, GameState } from "@app/shared";
import { Html } from "@react-three/drei";
import styled from "styled-components";
import server from "../../../services/server";
import { useAppStore } from "../../../state/use-app-store";
import Arena from "./arena";
import Bullets from "./bullets";
import Items from "./items";
import Player from "../../entities/player";
import Minimap from "./minimap";
import Leaderboard from "./leaderboard";
import Actions from "../../globals/actions";
import gameState from "../../game-state";
import Foods from "./foods";

export default function PlayScene() {
  const [currentPlayer, setCurrentPlayer] = React.useState<PlayerEntity>(null);
  const [players, setPlayers] = React.useState<PlayerEntity[]>([]);
  const nameInputRef = React.useRef<HTMLInputElement>();

  const { connected } = useAppStore();

  React.useEffect(() => {
    if (!connected) return;

    function addPlayer(player: PlayerEntity) {
      setPlayers((players) => {
        if (players.find((p) => p.id === player.id)) {
          return players;
        }
        return [...players, player];
      });
    }

    server.on(
      "connected",
      ({
        player,
        players,
      }: {
        player: PlayerEntity;
        players: PlayerEntity[];
      }) => {
        setCurrentPlayer(player);
        setPlayers(players);
      }
    );

    server.on("player.connected", (player: PlayerEntity) => {
      addPlayer(player);
    });

    server.on("player.killed", (player: PlayerEntity) => {
      console.log("player.killed->player", currentPlayer, player.id);
      if (player.id === currentPlayer?.id) {
        console.log("p", player);
        setCurrentPlayer({ ...player });
      }
    });

    server.on("player.damaged", (player: PlayerEntity) => {
      setPlayers((players) => {
        return players.map((p) => {
          if (p.id === player.id) {
            return player;
          }
          return p;
        });
      });
    });

    server.on("player.disconnected", (player: PlayerEntity) => {
      setPlayers((players) => {
        return players.filter((p) => p.id !== player.id);
      });
    });
  }, [currentPlayer, connected]);

  React.useEffect(() => {
    if (!connected) return;
    server.on("tick", (state: GameState) => {
      gameState.players = state.players;
      gameState.bullets = state.bullets;
      gameState.items = state.items;
      gameState.foods = state.foods;
    });
  }, [connected]);

  const play = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    server.emit("player.update.name", nameInputRef.current.value);
  }, []);

  return (
    <group>
      <Arena />
      {currentPlayer?.inGame && (
        <Actions
          keyMap={{
            w: Action.up,
            s: Action.down,
            a: Action.left,
            d: Action.right,
          }}
        />
      )}
      {players.map((player) => {
        return (
          <Player
            key={player.id}
            {...player}
            current={player.id === currentPlayer?.id}
          />
        );
      })}
      <Bullets currentPlayer={currentPlayer} />
      <Items />
      <Foods />
      <Leaderboard />
      <Minimap players={players} />
      {!currentPlayer?.inGame && (
        <Html style={{ transform: "translate(-50%, -50%)" }}>
          <PlayerForm onSubmit={play}>
            <label>
              <h3>Enter a Name</h3>
              <input
                ref={nameInputRef}
                defaultValue="Noob"
                onChange={(event) => {
                  nameInputRef.current.value = event.target.value;
                }}
              />
            </label>
            <button>Play</button>
          </PlayerForm>
        </Html>
      )}
    </group>
  );
}

export const PlayerForm = styled.form`
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1em;
  backdrop-filter: blur(1em);
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input,
  button {
    padding: 0.25em 0.5em;
    color: black;
    display: block;
    margin-top: 0.5em;
  }
`;
