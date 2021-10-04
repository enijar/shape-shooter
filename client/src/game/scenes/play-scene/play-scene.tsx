import React from "react";
import server from "../../../services/server";
import { useAppStore } from "../../../state/use-app-store";
import Arena from "./arena";
import Bullets from "./bullets";
import Items from "./items";
import Player, { PlayerType } from "../../entities/player";
import Minimap from "./minimap";
import Leaderboard from "./leaderboard";

export default function PlayScene() {
  const [currentPlayer, setCurrentPlayer] = React.useState<PlayerType>(null);
  const [players, setPlayers] = React.useState<PlayerType[]>([]);

  const { connected } = useAppStore();

  React.useEffect(() => {
    if (!connected) return;

    function addPlayer(player: PlayerType) {
      setPlayers((players) => {
        if (players.find((p) => p.id === player.id)) {
          return players;
        }
        return [...players, player];
      });
    }

    server.on(
      "connected",
      ({ player, players }: { player: PlayerType; players: PlayerType[] }) => {
        setCurrentPlayer(player);
        setPlayers(players);
      }
    );

    server.on("player.connected", (player: PlayerType) => {
      addPlayer(player);
    });

    server.on("player.killed", (player: PlayerType) => {
      setPlayers((players) => {
        return players.filter((p) => p.id !== player.id);
      });
      if (currentPlayer !== null && player.id === currentPlayer.id) {
        setCurrentPlayer(null);
      }
    });

    server.on("player.damaged", (player: PlayerType) => {
      setPlayers((players) => {
        return players.map((p) => {
          if (p.id === player.id) {
            return player;
          }
          return p;
        });
      });
    });

    server.on("player.disconnected", (player: PlayerType) => {
      setPlayers((players) => {
        return players.filter((p) => p.id !== player.id);
      });
    });
  }, [currentPlayer, connected]);

  return (
    <group>
      <Arena />
      {players.map((player) => {
        return (
          <Player
            key={player.id}
            {...player}
            current={player.id === currentPlayer?.id}
          />
        );
      })}
      <Bullets />
      <Items />
      <Leaderboard />
      <Minimap players={players} />
    </group>
  );
}
