import React from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "react-three-fiber";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import {Shape, Transport, utils} from "@shape-shooter/shared";
import createShape from "../shape";
import { useGame } from "../state";
import vars from "../../styles/vars";
import Minimap from "../minimap";
import { deg2rad } from "../utils";
import gameState from "../game-state";

type Props = {
  id: number;
  name: string;
  shape: Shape;
  color: string;
  currentPlayer?: boolean;
};

const HP_BORDER_WIDTH = 0.005;

export default function Player({
  id,
  name,
  shape,
  color,
  currentPlayer = false,
}: Props) {
  const font = useLoader(
    THREE.FontLoader,
    "/assets/3d/fonts/OpenSans_Bold.json"
  );
  const shapeImage = React.useMemo(() => createShape(shape, color), [
    shape,
    color,
  ]);
  const texture = useTexture(shapeImage);
  const { raycaster } = useThree();
  const { size, zoom } = useGame();
  const lastR = React.useRef<number>(0);
  const group = React.useRef<THREE.Group>();
  const meshGroup = React.useRef<THREE.Group>();
  const mesh = React.useRef<THREE.Mesh>();
  const material = React.useRef<THREE.MeshBasicMaterial>();
  const textGeometry = React.useRef<THREE.TextGeometry>();
  const textHpStatsGeometry = React.useRef<THREE.TextGeometry>();
  const box = React.useMemo<THREE.Box3>(() => new THREE.Box3(), []);
  const [hp, setHp] = React.useState<number>(1);

  useFrame(() => {
    const player = gameState.players.find((player) => player.id === id);
    if (!player) return;
    if (group.current) {
      group.current.position.x = player.x;
      group.current.position.y = player.y;
    }
    if (meshGroup.current) {
      meshGroup.current.rotation.z = player.r;
    }
    if (player.hp !== hp) {
      setHp(player.hp);
    }
  });

  React.useEffect(() => {
    if (textHpStatsGeometry.current) {
      textHpStatsGeometry.current.computeBoundingBox();
      textHpStatsGeometry.current.center();
      textHpStatsGeometry.current.dispose();
    }
  }, [hp]);

  // Update current player's rotation
  React.useEffect(() => {
    if (!currentPlayer) return;

    function onMove() {
      if (!meshGroup.current || !mesh.current) return;
      box.setFromObject(meshGroup.current);
      const cX = (box.max.x + box.min.x) / 2;
      const cY = (box.max.y + box.min.y) / 2;
      const { x: oX, y: oY } = raycaster.ray.origin;
      let r = Math.atan2(oY - cY, oX - cX) - deg2rad(90);
      r = parseFloat(r.toFixed(2));
      if (r !== lastR.current) {
        lastR.current = r;
        const { socket } = useGame.getState();
        if (socket !== null) {
          socket.emit("rotate", r);
        }
      }
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [raycaster, currentPlayer, box]);

  React.useEffect(() => {
    if (!textGeometry.current) return;
    textGeometry.current.computeBoundingBox();
    textGeometry.current.center();
    textGeometry.current.dispose();
  }, []);

  return (
    <group ref={group}>
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
              name,
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
          {/* @ts-ignore */}
          <mesh position={[utils.map(hp, 0, 1, -0.05, 0), 0, 0]}>
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
            ref={material}
            attach="material"
            map={texture}
            transparent={true}
          />
        </mesh>
      </group>
      {currentPlayer && (
        <>
          <Minimap />
          <OrthographicCamera
            makeDefault
            position={[0, 0, size]}
            zoom={size * zoom}
          />
        </>
      )}
    </group>
  );
}
