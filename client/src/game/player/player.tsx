import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "react-three-fiber";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { PlayerHp, PlayerHpBar, PlayerName, PlayerTag } from "./styles";
import { deg2rad } from "../utils";
import createShape from "../shape";
import { useGame } from "../state";
import Html from "../html";
import PlayerEntity from "../../shared/game/entities/player";
import state from "../../shared/game/state";

type Props = {
  player: PlayerEntity;
  index: number;
  currentPlayer?: boolean;
};

export default function Player({
  player,
  index,
  currentPlayer = false,
}: Props) {
  const texture = useTexture(createShape(player.shape, player.color));
  const { raycaster } = useThree();
  const { size, zoom } = useGame();
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
      player.rotate(Math.atan2(oY - cY, oX - cX) - deg2rad(90));
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [raycaster, currentPlayer, player, box]);

  useFrame(() => {
    if (!group.current || !mesh.current) return;
    group.current.position.x = state.players[index].x;
    group.current.position.y = state.players[index].y;
    mesh.current.rotation.z = state.players[index].r;
  });

  return (
    <group ref={group}>
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
        <PlayerTag>
          <PlayerName>{player.name}</PlayerName>
          <PlayerHp hp={player.hp}>
            <PlayerHpBar />
          </PlayerHp>
        </PlayerTag>
      </Html>
    </group>
  );
}
