import React from "react";
import { PlayerEntityData } from "@app/shared";
import server from "../../../services/server";
import { useStore } from "../../store";
import Player from "../../entities/player";
import { ConnectedData } from "../../types";

function Players() {
  const { players, currentPlayer } = useStore();

  React.useEffect(() => {
    function removePlayer(player: PlayerEntityData) {
      const { players, setPlayers, currentPlayer, setCurrentPlayer } =
        useStore.getState();
      setPlayers(players.filter((p) => p[0] !== player[0]));
      if (player[0] === currentPlayer?.[0]) {
        setCurrentPlayer(null);
      }
    }

    server.on("player.killed", removePlayer);
    server.on("player.disconnected", removePlayer);
    server.on("connected", (data: ConnectedData) => {
      const { setCurrentPlayer, setPlayers } = useStore.getState();
      setCurrentPlayer(data.player);
      setPlayers(data.players);
    });
    server.on("player.connected", (player: PlayerEntityData) => {
      const { players, setPlayers } = useStore.getState();
      if (players.find((p) => p[0] === player[0]) === undefined) {
        setPlayers([...players, player]);
      }
    });
    server.on("player.update", (player: PlayerEntityData) => {
      const { players, setPlayers } = useStore.getState();
      setPlayers(
        players.map((p) => {
          if (p[0] === player[0]) {
            return player;
          }
          return p;
        })
      );
    });
    return () => {
      server.off("player.killed");
      server.off("player.disconnected");
      server.off("connected");
      server.off("player.connected");
      server.off("player.update");
    };
  }, []);

  return (
    <React.Suspense fallback={<></>}>
      {players.map((player) => {
        return (
          <Player
            key={player[0]}
            id={player[0]}
            x={player[1]}
            y={player[2]}
            color={player[3]}
            rotation={player[4]}
            exp={player[5]}
            health={player[6]}
            maxHealth={player[7]}
            name={player[8]}
            current={player[0] === currentPlayer?.[0]}
          />
        );
      })}
    </React.Suspense>
  );
}

export default React.memo(Players);
