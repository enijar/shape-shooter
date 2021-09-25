import React from "react";
import * as THREE from "three";
import { settings } from "@app/shared";
import { Html } from "@react-three/drei";
import server from "../../services/server";
import { useThree } from "@react-three/fiber";
import useRotation from "../hooks/use-rotation";
import styled from "styled-components";

const BAR_HEIGHT = 14;

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
  exp: number;
};

type Props = PlayerType & {
  current?: boolean;
};

export default function Player({
  color = "crimson",
  size = 100,
  name = "Noob",
  id,
  exp,
  current = false,
}: Props) {
  const groupRef = React.useRef<THREE.Group>();
  const meshRef = React.useRef<THREE.Mesh>();
  const healthBarRef = React.useRef<HTMLDivElement>();
  const healthTextRef = React.useRef<HTMLDivElement>();
  const expBarRef = React.useRef<HTMLDivElement>();
  const expTextRef = React.useRef<HTMLDivElement>();

  useRotation(meshRef, current);

  const { camera } = useThree();

  React.useEffect(() => {
    server.on("tick", (state: { players: PlayerType[] }) => {
      const index = state.players.findIndex((player) => player.id === id);
      if (index === -1) return;
      const player = state.players[index];

      // Update position
      groupRef.current.position.x = player.x;
      groupRef.current.position.y = player.y;
      meshRef.current.rotation.z = player.rotation;

      // Health
      const health = (100 / player.maxHealth) * player.health;
      healthBarRef.current.style.width = `${health}%`;
      healthTextRef.current.innerText = `${health}%`;

      // Exp/level
      const level = Math.floor(player.exp / settings.exp.perLevel);
      const levelExp = player.exp - level * settings.exp.perLevel;
      const exp = (100 / settings.exp.perLevel) * levelExp;
      expBarRef.current.style.width = `${exp}%`;
      expTextRef.current.innerText = `lvl. ${level}`;

      // Camera follow player
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
          transform: "translate(-50%, 1em)",
          pointerEvents: "none",
          userSelect: "none",
          width: `${size}px`,
        }}
        position={[0, -size * 0.5, 0]}
      >
        <Bar>
          <BarFill ref={healthBarRef} color="hsl(120, 83%, 37%)">
            <div ref={healthTextRef}>100%</div>
          </BarFill>
        </Bar>
        <Bar style={{ marginTop: "0.25em" }}>
          <BarFill ref={expBarRef} style={{ width: "0%" }} color="hsl(240, 83%, 37%)">
            <div ref={expTextRef}>lvl. {exp}</div>
          </BarFill>
        </Bar>
        <Name>{name}</Name>
      </Html>
    </group>
  );
}

const Bar = styled.div`
  width: 100%;
  height: ${BAR_HEIGHT}px;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  border-radius: 2em;
`;

type BarFillProps = {
  color: string;
};

const BarFill = styled.div<BarFillProps>`
  width: 100%;
  height: 100%;
  transition: width 0.2s linear;
  background-color: ${({ color }) => color};

  div {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    font-size: ${BAR_HEIGHT * 0.75}px;
    font-weight: bold;
  }
`;

const Name = styled.div`
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.25em;
`;
