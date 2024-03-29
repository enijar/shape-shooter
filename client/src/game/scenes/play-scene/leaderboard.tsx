import React from "react";
import styled from "styled-components";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { GameState } from "@app/shared";
import useSubscription from "../../hooks/use-subscription";
import { Subscription } from "../../types";

const LEADERBOARD_SIZE = {
  x: 200,
  y: 330,
};

type Props = {
  gap?: number;
};

export default function Leaderboard({ gap = 20 }: Props) {
  const [topPlayers, setTopPlayers] = React.useState([]);

  const { size } = useThree();

  useSubscription(Subscription.tick, (gameState: GameState) => {
    const topPlayers = gameState.players
      .sort((a, b) => b.exp - a.exp)
      .slice(0, 10);
    setTopPlayers(topPlayers);
  });

  return (
    <Html
      style={{
        width: `${LEADERBOARD_SIZE.x}px`,
        padding: "0.25em 0.5em",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        pointerEvents: "none",
      }}
      calculatePosition={() => {
        return [size.width - LEADERBOARD_SIZE.x - gap, gap];
      }}
    >
      <h3>Leaderboard</h3>
      {topPlayers.map((player) => {
        return (
          <Item key={player.id}>
            {player.name ?? "Noob"} – {player.exp}
          </Item>
        );
      })}
    </Html>
  );
}

const Item = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  margin-top: 0.25em;
  margin-bottom: 0.25em;
`;
