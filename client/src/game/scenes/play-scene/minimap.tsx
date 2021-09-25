import React from "react";
import { settings } from "@app/shared";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Position } from "@react-three/drei/helpers/Position";
import { PlayerType } from "../../entities/player";
import server from "../../../services/server";

const MAP_SIZE = 200;

const PLAYER_SIZE = (1 / settings.arena.size) * settings.player.size;

type Props = {
  players: PlayerType[];
  gap?: number;
};

export default function Minimap({ players, gap = 20 }: Props) {
  const groupRef = React.useRef<THREE.Group>();
  const meshRefs = React.useRef<THREE.Mesh[]>([]);

  useFrame(({ camera, size }) => {
    groupRef.current.position.copy(camera.position);
    groupRef.current.position.x -= size.width * 0.5 - MAP_SIZE * 0.5 - gap;
    groupRef.current.position.y -= size.height * 0.5 - MAP_SIZE * 0.5 - gap;
  });

  React.useEffect(() => {
    server.on("tick", (state: { players: PlayerType[] }) => {
      for (let i = 0, length = state.players.length; i < length; i++) {
        if (!meshRefs.current[i]) continue;
        const player = state.players[i];
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
  }, []);

  return (
    <group ref={groupRef}>
      <mesh>
        <planeBufferGeometry args={[MAP_SIZE, MAP_SIZE]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      {players.map((player, index) => {
        return (
          <mesh
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
            <meshStandardMaterial color={player.color} />
          </mesh>
        );
      })}
    </group>
  );
}
