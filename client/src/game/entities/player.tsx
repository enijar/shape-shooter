import React from "react";
import styled from "styled-components";
import { PlayerEntity, settings } from "@app/shared";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import useRotation from "../hooks/use-rotation";
import { Bar, BarFill } from "../styles";
import gameState from "../game-state";
import { encodeSvg } from "../utils";

const SIZE = settings.player.size;

type Props = PlayerEntity & {
  current?: boolean;
};

export default function Player({
  color = "crimson",
  name = "Noob",
  id,
  exp,
  current = false,
}: Props) {
  const groupRef = React.useRef<THREE.Group>();
  const htmlRef = React.useRef<HTMLDivElement>();
  const meshRef = React.useRef<THREE.Mesh>();
  const healthBarRef = React.useRef<HTMLDivElement>();
  const healthTextRef = React.useRef<HTMLDivElement>();
  const expBarRef = React.useRef<HTMLDivElement>();
  const expTextRef = React.useRef<HTMLDivElement>();

  const rotationControls = useRotation(meshRef, current);

  useFrame(({ camera }) => {
    const index = gameState.players.findIndex((player) => player.id === id);
    if (index === -1) return;
    const player = gameState.players[index];
    rotationControls.enabled = player.inGame;
    groupRef.current.visible = player.inGame;
    htmlRef.current.style.visibility = player.inGame ? "visible" : "hidden";
    if (!player.inGame) return;

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

  const texture = useTexture(
    encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
<rect x="0" y="0" width="${SIZE}" height="${SIZE}" fill="white"/>
</svg>`
    )
  );

  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={meshRef}>
        <planeBufferGeometry args={[SIZE, SIZE]} />
        <meshBasicMaterial map={texture} color={color} />
      </mesh>
      <Html
        ref={htmlRef}
        style={{
          transform: "translate(-50%, 1em)",
          pointerEvents: "none",
          userSelect: "none",
          width: `${SIZE}px`,
        }}
        position={[0, -SIZE * 0.5, 0]}
      >
        <Bar height={14}>
          <BarFill ref={healthBarRef} color="hsl(120, 83%, 37%)">
            <div ref={healthTextRef}>100%</div>
          </BarFill>
        </Bar>
        <Bar height={14} style={{ marginTop: "0.25em" }}>
          <BarFill
            ref={expBarRef}
            style={{ width: "0%" }}
            color="hsl(240, 83%, 37%)"
          >
            <div ref={expTextRef}>lvl. {exp}</div>
          </BarFill>
        </Bar>
        <Name>{name}</Name>
      </Html>
    </group>
  );
}

const Name = styled.div`
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.25em;
`;
