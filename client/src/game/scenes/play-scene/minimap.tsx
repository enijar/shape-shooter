import React from "react";
import { PlayerEntity, settings } from "@app/shared";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gameState from "../../game-state";

const MAP_SIZE = 200;

const PLAYER_SIZE = (1 / settings.arena.size) * settings.player.size;

type Props = {
  players: PlayerEntity[];
  gap?: number;
};

export default function Minimap({ players, gap = 20 }: Props) {
  const groupRef = React.useRef<THREE.Group>();
  const meshRefs = React.useRef<THREE.Mesh[]>([]);

  useFrame(({ camera, size }) => {
    groupRef.current.position.copy(camera.position);
    groupRef.current.position.x -= size.width * 0.5 - MAP_SIZE * 0.5 - gap;
    groupRef.current.position.y -= size.height * 0.5 - MAP_SIZE * 0.5 - gap;

    for (let i = 0, length = gameState.players.length; i < length; i++) {
      if (!meshRefs.current[i]) continue;
      const player = gameState.players[i];
      meshRefs.current[i].visible = player.inGame;
      meshRefs.current[i].position.x = THREE.MathUtils.mapLinear(
        player.x,
        0,
        settings.arena.size,
        0,
        MAP_SIZE
      );
      meshRefs.current[i].position.y = THREE.MathUtils.mapLinear(
        player.y,
        0,
        settings.arena.size,
        0,
        MAP_SIZE
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeBufferGeometry args={[MAP_SIZE, MAP_SIZE]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      {players.map((player, index) => {
        return (
          <mesh
            visible={false}
            key={player.id}
            ref={(ref) => {
              if (ref instanceof THREE.Mesh) {
                meshRefs.current[index] = ref;
              }
            }}
            position={[0, 0, 0.1]}
          >
            <planeBufferGeometry
              args={[MAP_SIZE * PLAYER_SIZE, MAP_SIZE * PLAYER_SIZE]}
            />
            <meshBasicMaterial color={player.color} />
          </mesh>
        );
      })}
    </group>
  );
}
