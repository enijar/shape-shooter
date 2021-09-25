import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import server from "../../services/server";
import { useThree } from "@react-three/fiber";
import useRotation from "../hooks/use-rotation";
import styled from "styled-components";

const HEALTH_BAR_HEIGHT = 4;

export type PlayerType = {
  id?: string;
  color?: string;
  size?: number;
  name?: string;
  x: number;
  y: number;
  rotation: number;
  health: number;
  maxHealth: number;
};

type Props = {
  id: string;
  color?: string;
  size?: number;
  name?: string;
  current?: boolean;
};

export default function Player({
  color = "crimson",
  size = 100,
  name = "Noob",
  id,
  current = false,
}: Props) {
  const groupRef = React.useRef<THREE.Group>();
  const meshRef = React.useRef<THREE.Mesh>();
  const healthBarRef = React.useRef<HTMLDivElement>();

  useRotation(meshRef, current);

  const { camera } = useThree();

  React.useEffect(() => {
    server.on("tick", (state: { players: PlayerType[] }) => {
      const index = state.players.findIndex((player) => player.id === id);
      if (index === -1) return;
      groupRef.current.position.x = state.players[index].x;
      groupRef.current.position.y = state.players[index].y;
      meshRef.current.rotation.z = state.players[index].rotation;
      const health =
        (100 / state.players[index].maxHealth) * state.players[index].health;
      healthBarRef.current.style.width = `${health}%`;
      if (current) {
        camera.position.copy(groupRef.current.position);
      }
    });
  }, [camera, id, current]);

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <planeBufferGeometry args={[size, size]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html
        style={{
          transform: "translate(-50%, 50%)",
          pointerEvents: "none",
          userSelect: "none",
        }}
        position={[0, -size * 0.5, 0]}
      >
        <HealthBar size={size}>
          <HealthBarFill ref={healthBarRef} />
        </HealthBar>
        <Name size={size}>{name}</Name>
      </Html>
    </group>
  );
}

type HealthBarProps = {
  size: number;
};

const HealthBar = styled.div<HealthBarProps>`
  width: ${({ size }) => size}px;
  height: ${HEALTH_BAR_HEIGHT}px;
  background-color: #000000;
`;

const HealthBarFill = styled.div`
  width: 100%;
  height: 100%;
  background: green;
  transition: width 0.2s linear;
`;

type NameProps = {
  size: number;
};

const Name = styled.div<NameProps>`
  text-align: center;
  width: ${({ size }) => size}px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.25em;
`;
