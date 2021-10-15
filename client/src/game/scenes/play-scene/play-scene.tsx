import React from "react";
import { Action, GameState, PlayerEntity } from "@app/shared";
import { Html } from "@react-three/drei";
import { PlayerForm } from "./styles";
import server from "../../../services/server";
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

  React.useEffect(() => {
    function removePlayer(player: PlayerEntity) {
      setPlayers((players) => {
        return players.filter((p) => p.id !== player.id);
      });
      if (player.id === currentPlayer?.id) {
        setCurrentPlayer(null);
      }
    }

    server.on("player.killed", removePlayer);
    server.on("player.disconnected", removePlayer);
    return () => {
      server.off("player.killed");
      server.off("player.disconnected");
    };
  }, [currentPlayer]);

  React.useEffect(() => {
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
    server.on("tick", (state: GameState) => {
      gameState.players = state.players;
      gameState.bullets = state.bullets;
      gameState.items = state.items;
      gameState.foods = state.foods;
    });

    server.on("player.connected", (player: PlayerEntity) => {
      setPlayers((players) => {
        if (players.find((p) => p.id === player.id)) {
          return players;
        }
        return [...players, player];
      });
    });

    server.on("player.update", (player: PlayerEntity) => {
      setPlayers((players) => {
        return players.map((p) => {
          if (p.id === player.id) {
            return player;
          }
          return p;
        });
      });
    });

    return () => {
      server.off("connected");
      server.off("tick");
      server.off("player.connected");
      server.off("player.update");
    };
  }, []);

  const play = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    server.emit("player.join", {
      name: nameInputRef.current.value,
    });
  }, []);

  return (
    <group>
      <Arena />
      {currentPlayer !== null && (
        <Actions
          keyMap={{
            w: Action.up,
            s: Action.down,
            a: Action.left,
            d: Action.right,
            ArrowUp: Action.up,
            ArrowDown: Action.down,
            ArrowLeft: Action.left,
            ArrowRight: Action.right,
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
      <Minimap players={players} currentPlayer={currentPlayer} />
      {currentPlayer == null && (
        <Html calculatePosition={() => [0, 0]}>
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
