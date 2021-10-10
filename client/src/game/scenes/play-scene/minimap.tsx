import React from "react";
import { PlayerEntity, settings } from "@app/shared";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import gameState from "../../game-state";
import { Html } from "@react-three/drei";

const MAP_SIZE = 200;

const PLAYER_SIZE = (1 / settings.arena.size) * settings.player.size;

type Props = {
  players: PlayerEntity[];
  gap?: number;
};

export default function Minimap({ players, gap = 20 }: Props) {
  const playerRefs = React.useRef<HTMLDivElement[]>([]);

  useFrame(() => {
    for (let i = 0, length = gameState.players.length; i < length; i++) {
      if (!playerRefs.current[i]) continue;
      const player = gameState.players[i];
      playerRefs.current[i].style.visibility = player.inGame
        ? "visible"
        : "hidden";
      const x = THREE.MathUtils.mapLinear(
        player.x,
        0,
        settings.arena.size,
        0,
        MAP_SIZE
      );
      const y = THREE.MathUtils.mapLinear(
        player.y,
        0,
        settings.arena.size,
        0,
        -MAP_SIZE / 2
      );
      playerRefs.current[i].style.transform = `translate3d(calc((${
        MAP_SIZE / 2
      }px + ${x}px) - 50%), calc((${MAP_SIZE / 2}px + ${y}px) - 50%), 0px)`;
      playerRefs.current[i].style.top = `${y}px`;
    }
  });

  const { size } = useThree();

  return (
    <Html
      style={{
        width: `${MAP_SIZE}px`,
        height: `${MAP_SIZE}px`,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "relative",
      }}
      calculatePosition={() => {
        return [gap, size.height - MAP_SIZE - gap];
      }}
    >
      {players.map((player, index) => {
        return (
          <div
            key={player.id}
            ref={(ref) => {
              playerRefs.current[index] = ref;
            }}
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              transform: `translate3d(calc(${MAP_SIZE / 2}px - 50%), calc(${
                MAP_SIZE / 2
              }px - 50%), 0px)`,
              backgroundColor: player.color,
              width: `${Math.max(MAP_SIZE * PLAYER_SIZE, 4)}px`,
              height: `${Math.max(MAP_SIZE * PLAYER_SIZE, 4)}px`,
            }}
          />
        );
      })}
    </Html>
  );
}
