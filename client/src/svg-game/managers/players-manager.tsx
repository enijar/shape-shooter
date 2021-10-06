import React from "react";
import PlayerObject from "../objects/player-object";
import { useState } from "../state";

export default function PlayersManager() {
  const { players } = useState();

  return (
    <g>
      {players.map((player) => {
        return <PlayerObject key={player.id} {...player} />;
      })}
    </g>
  );
}
