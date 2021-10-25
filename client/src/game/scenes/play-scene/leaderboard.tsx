import React from "react";
import styled from "styled-components";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gameState from "../../game-state";

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

  useFrame(() => {
    const topPlayers = gameState.players
      .sort((a, b) => b[5] - a[5])
      .slice(0, 10);
    setTopPlayers(topPlayers);
  });

  return (
    <Html
      style={{
        width: `${LEADERBOARD_SIZE.x}px`,
        padding: "0.25em 0.5em",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      calculatePosition={() => {
        return [size.width - LEADERBOARD_SIZE.x - gap, gap];
      }}
    >
      <h3>Leaderboard</h3>
      {topPlayers.map((player) => {
        return (
          <Item key={player[0]}>
            {player[8] ?? "Noob"} – {player[5]}
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
