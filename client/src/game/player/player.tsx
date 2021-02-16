import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "react-three-fiber";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { PlayerName } from "./styles";
import { EngineActionType, Player as PlayerType } from "../../shared/types";
import { deg2rad } from "../utils";
import createShape from "../shape";
import { useGame } from "../state";
import Html from "../html";
import engine from "../../shared/game/engine";

type Props = {
  player: PlayerType;
  index: number;
  currentPlayer?: boolean;
};

export default function Player({ player, currentPlayer = false }: Props) {
  const texture = useTexture(createShape(player.shape, player.color));
  const { raycaster } = useThree();
  const { size, zoom, players } = useGame();
  const group = React.useRef<THREE.Group>();
  const mesh = React.useRef<THREE.Mesh>();
  const box = React.useMemo<THREE.Box3>(() => new THREE.Box3(), []);

  // Update current player's rotation
  React.useEffect(() => {
    if (!currentPlayer) return;

    function onMove() {
      if (!group.current || !mesh.current) return;
      box.setFromObject(group.current);
      const cX = (box.max.x + box.min.x) / 2;
      const cY = (box.max.y + box.min.y) / 2;
      const { x: oX, y: oY } = raycaster.ray.origin;
      engine.emit(EngineActionType.rotate, {
        playerId: player.id,
        r: Math.atan2(oY - cY, oX - cX) - deg2rad(90),
      });
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [raycaster, currentPlayer, player.id, box]);

  useFrame(() => {
    if (!group.current || !mesh.current) return;

    for (let i = 0, length = players.length; i < length; i++) {
      if (players[i].id !== player.id) continue;
      group.current.position.x = players[i].x;
      group.current.position.y = players[i].y;
      mesh.current.rotation.z = players[i].r;
    }
  });

  return (
    <group ref={group} visible={player.id > -1}>
      <mesh ref={mesh}>
        <planeBufferGeometry attach="geometry" args={[0.1, 0.1, 1]} />
        <meshBasicMaterial attach="material" map={texture} transparent={true} />
      </mesh>
      {currentPlayer && (
        <OrthographicCamera
          makeDefault
          position={[0, 0, size]}
          zoom={size * zoom}
        />
      )}
      <Html center position={[0, -0.06, 0]}>
        <PlayerName>{player.name}</PlayerName>
      </Html>
    </group>
  );
}
