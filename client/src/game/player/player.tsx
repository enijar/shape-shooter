import React from "react";
import * as THREE from "three";
import { useLoader, useThree } from "react-three-fiber";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { deg2rad } from "../utils";
import createShape from "../shape";
import { useGame } from "../state";
import PlayerEntity from "../../shared/game/entities/player";
import { GameActionType, GameEventType } from "../../shared/types";
import vars from "../../styles/vars";
import { map } from "../../shared/game/utils";

type Props = {
  player: PlayerEntity;
  currentPlayer?: boolean;
};

const HP_BORDER_WIDTH = 0.005;

export default function Player({ player, currentPlayer = false }: Props) {
  const font = useLoader(
    THREE.FontLoader,
    "/assets/3d/fonts/OpenSans_Bold.json"
  );
  const shape = React.useMemo(() => createShape(player.shape, player.color), [
    player.shape,
    player.color,
  ]);
  const texture = useTexture(shape);
  const { raycaster } = useThree();
  const { size, zoom, instance } = useGame();
  const group = React.useRef<THREE.Group>();
  const meshGroup = React.useRef<THREE.Group>();
  const mesh = React.useRef<THREE.Mesh>();
  const textGeometry = React.useRef<THREE.TextGeometry>();
  const textHpStatsGeometry = React.useRef<THREE.TextGeometry>();
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
      if (!meshGroup.current) return;
      if (payload.playerId === player.id) {
        meshGroup.current.rotation.z = payload.r;
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
      if (!meshGroup.current || !mesh.current) return;
      box.setFromObject(meshGroup.current);
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

  React.useEffect(() => {
    if (!textGeometry.current) return;
    textGeometry.current.computeBoundingBox();
    textGeometry.current.center();
    textGeometry.current.dispose();
  }, []);

  React.useEffect(() => {
    if (!textHpStatsGeometry.current) return;
    textHpStatsGeometry.current.computeBoundingBox();
    textHpStatsGeometry.current.center();
    textHpStatsGeometry.current.dispose();
  }, [hp]);

  return (
    <group ref={group} visible={hp > 0}>
      {/* Name tag + HP bar */}
      <group position={[0, -0.06, 0]}>
        {/* Name tag background */}
        <mesh position={[0, -0.0002, 0]}>
          <planeGeometry
            attach="geometry"
            args={[0.1 + HP_BORDER_WIDTH, 0.02, 1]}
          />
          <meshBasicMaterial attach="material" color={vars.color.black} />
        </mesh>
        {/* Name tag text */}
        <mesh scale={[0.0003, 0.0003, 0.0003]}>
          <textGeometry
            ref={textGeometry}
            attach="geometry"
            args={[
              player.name,
              {
                font,
                size: 30,
              },
            ]}
          />
          <meshBasicMaterial attach="material" color={vars.color.white} />
        </mesh>
        {/* HP bar */}
        <group position={[0, -0.012 - HP_BORDER_WIDTH, 0]}>
          {/* HP boarder */}
          <mesh>
            <planeGeometry
              attach="geometry"
              args={[0.1 + HP_BORDER_WIDTH, 0.01 + HP_BORDER_WIDTH, 1]}
            />
            <meshBasicMaterial attach="material" color={vars.color.black} />
          </mesh>
          {/* HP fill trail */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry attach="geometry" args={[0.1, 0.01, 1]} />
            <meshBasicMaterial
              attach="material"
              color={vars.color.hp}
              opacity={0.5}
            />
          </mesh>
          {/* HP fill */}
          <mesh position={[map(hp, 0, 1, -0.05, 0), 0, 0]}>
            <planeGeometry attach="geometry" args={[0.1 * hp, 0.01, 1]} />
            <meshBasicMaterial attach="material" color={vars.color.hp} />
          </mesh>
          {/* HP stats */}
          <mesh scale={[0.0003, 0.0003, 0.0003]}>
            <textGeometry
              ref={textHpStatsGeometry}
              attach="geometry"
              args={[
                `${Math.floor(hp * 100)}/100`,
                {
                  font,
                  size: 20,
                },
              ]}
            />
            <meshBasicMaterial
              attach="material"
              color={vars.color.black}
              opacity={0.75}
            />
          </mesh>
        </group>
      </group>

      {/* Player shape */}
      <group ref={meshGroup}>
        <mesh ref={mesh}>
          <planeBufferGeometry attach="geometry" args={[0.1, 0.1, 1]} />
          <meshBasicMaterial
            attach="material"
            map={texture}
            transparent={true}
          />
        </mesh>
      </group>
      {currentPlayer && (
        <OrthographicCamera
          makeDefault
          position={[0, 0, size]}
          zoom={size * zoom}
        />
      )}
    </group>
  );
}
