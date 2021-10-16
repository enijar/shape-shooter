import React from "react";
import { PlayerEntity } from "@app/shared";
import server from "../../../services/server";
import { useStore } from "../../store";
import Player from "../../entities/player";
import { ConnectedData } from "../../types";

function Players() {
  const { players, currentPlayer } = useStore();

  React.useEffect(() => {
    function removePlayer(player: PlayerEntity) {
      const { players, setPlayers, currentPlayer, setCurrentPlayer } =
        useStore.getState();
      setPlayers(players.filter((p) => p.id !== player.id));
      if (player.id === currentPlayer?.id) {
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
    server.on("player.connected", (player: PlayerEntity) => {
      const { players, setPlayers } = useStore.getState();
      if (players.find((p) => p.id === player.id) === undefined) {
        setPlayers([...players, player]);
      }
    });
    server.on("player.update", (player: PlayerEntity) => {
      const { players, setPlayers } = useStore.getState();
      setPlayers(
        players.map((p) => {
          if (p.id === player.id) {
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
            key={player.id}
            {...player}
            current={player.id === currentPlayer?.id}
          />
        );
      })}
    </React.Suspense>
  );
}

export default React.memo(Players);
