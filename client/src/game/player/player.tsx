import React from "react";
import * as THREE from "three";
import { useThree } from "react-three-fiber";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { PlayerHp, PlayerHpBar, PlayerName, PlayerTag } from "./styles";
import { deg2rad } from "../utils";
import createShape from "../shape";
import { useGame } from "../state";
import Html from "../html";
import PlayerEntity from "../../shared/game/entities/player";
import { GameActionType, GameEventType } from "../../shared/types";

type Props = {
  player: PlayerEntity;
  currentPlayer?: boolean;
};

export default function Player({ player, currentPlayer = false }: Props) {
  const texture = useTexture(createShape(player.shape, player.color));
  const { raycaster } = useThree();
  const { size, zoom, instance } = useGame();
  const group = React.useRef<THREE.Group>();
  const mesh = React.useRef<THREE.Mesh>();
  const box = React.useMemo<THREE.Box3>(() => new THREE.Box3(), []);
  const [hp, setHp] = React.useState(player.hp);

  React.useEffect(() => {
    return instance.subscribe(GameEventType.playerHp, (payload: any) => {
      if (payload.playerId === player.id) {
        setHp(payload.hp);
      }
    });
  }, [player, instance]);

  React.useEffect(() => {
    return instance.subscribe(GameEventType.playerRotate, (payload: any) => {
      if (!mesh.current) return;
      if (payload.playerId === player.id) {
        mesh.current.rotation.z = payload.r;
      }
    });
  }, [player, instance]);

  React.useEffect(() => {
    if (group.current) {
      group.current.position.x = player.x;
      group.current.position.y = player.y;
    }
    return instance.subscribe(GameEventType.playerMove, (payload: any) => {
      if (!group.current) return;
      if (payload.playerId === player.id) {
        group.current.position.x = player.x;
        group.current.position.y = player.y;
      }
    });
  }, [player, instance]);

  // Update current player's rotation
  React.useEffect(() => {
    if (!currentPlayer) return;

    function onMove() {
      if (!group.current || !mesh.current) return;
      box.setFromObject(group.current);
      const cX = (box.max.x + box.min.x) / 2;
      const cY = (box.max.y + box.min.y) / 2;
      const { x: oX, y: oY } = raycaster.ray.origin;
      instance.action(GameActionType.playerRotate, {
        playerId: player.id,
        r: Math.atan2(oY - cY, oX - cX) - deg2rad(90),
      });
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [raycaster, currentPlayer, player, box, instance]);

  return (
    <group ref={group} visible={hp > 0}>
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
      {hp > 0 && (
        <Html center position={[0, -0.06, 0]}>
          <PlayerTag>
            <PlayerName>{player.name}</PlayerName>
            <PlayerHp hp={hp}>
              <PlayerHpBar />
            </PlayerHp>
          </PlayerTag>
        </Html>
      )}
    </group>
  );
}
