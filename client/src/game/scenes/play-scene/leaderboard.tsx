import React from "react";
import styled from "styled-components";
import * as THREE from "three";
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
  const groupRef = React.useRef<THREE.Group>();
  const [topPlayers, setTopPlayers] = React.useState([]);

  const { size } = useThree();

  useFrame(() => {
    const topPlayers = gameState.players
      .sort((a, b) => b.exp - a.exp)
      .slice(0, 10);
    setTopPlayers(topPlayers);
  });

  useFrame(({ camera, size }) => {
    groupRef.current.position.copy(camera.position);
    groupRef.current.position.x +=
      size.width * 0.5 - LEADERBOARD_SIZE.x * 0.5 - gap;
    groupRef.current.position.y +=
      size.height * 0.5 - LEADERBOARD_SIZE.y * 0.5 - gap;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeBufferGeometry args={[LEADERBOARD_SIZE.x, LEADERBOARD_SIZE.y]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      <Html
        style={{ width: `${LEADERBOARD_SIZE.x}px`, padding: "0.25em 0.5em" }}
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
    </group>
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
