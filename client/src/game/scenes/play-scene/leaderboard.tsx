import React from "react";
import styled from "styled-components";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { PlayerType } from "../../entities/player";
import server from "../../../services/server";

const LEADERBOARD_SIZE = {
  x: 200,
  y: 345,
};

type Props = {
  gap?: number;
};

export default function Leaderboard({ gap = 20 }: Props) {
  const groupRef = React.useRef<THREE.Group>();
  const [topPlayers, setTopPlayers] = React.useState([]);

  const { size } = useThree();

  React.useEffect(() => {
    server.on("tick", (state: { players: PlayerType[] }) => {
      const topPlayers = state.players
        .sort((a, b) => {
          return b.exp - a.exp;
        })
        .slice(0, 10);
      setTopPlayers(topPlayers);
    });
  }, []);

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
        <meshStandardMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      <Html
        style={{ width: `${LEADERBOARD_SIZE.x}px` }}
        calculatePosition={() => {
          return [size.width - LEADERBOARD_SIZE.x - gap, gap];
        }}
      >
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
  padding: 0.25em 0.5em;
`;
