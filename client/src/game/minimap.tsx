import React from "react";
import * as THREE from "three";
import vars from "../styles/vars";
import { useGame } from "./state";
import { useFrame } from "react-three-fiber";
import { map } from "../shared/game/utils";

export default function Minimap() {
  const { players, currentPlayer } = useGame();
  const playerMeshes = players.map(() => React.createRef<THREE.Mesh>());

  useFrame(() => {
    for (let i = 0, length = players.length; i < length; i++) {
      if (!playerMeshes[i] || !playerMeshes[i].current) continue;
      const { minX, minY, maxX, maxY, x, y } = players[i];
      // @ts-ignore
      playerMeshes[i].current.position.x = map(x, minX, maxX, -0.05, 0.05);
      // @ts-ignore
      playerMeshes[i].current.position.y = map(y, minY, maxY, -0.05, 0.05);
    }
  });

  return (
    <group position={[-0.42, -0.255, 0]}>
      <mesh>
        <planeGeometry attach="geometry" args={[0.1, 0.1, 1]} />
        <meshBasicMaterial attach="material" color={vars.color.black} />
      </mesh>
      <group>
        {players.map((player, index) => {
          if (player === null) return null;
          return (
            <mesh key={player.id} ref={playerMeshes[index]}>
              <circleBufferGeometry attach="geometry" args={[0.002, 32]} />
              <meshBasicMaterial
                attach="material"
                color={
                  player.id === currentPlayer?.id
                    ? vars.color.white
                    : player.color
                }
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
