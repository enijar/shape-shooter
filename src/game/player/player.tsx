import React from "react";
import * as THREE from "three";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { useGame } from "../state";
import useControls from "../hooks/use-controls";
import shape from "../shape";
import { useFrame, useThree } from "react-three-fiber";
import { deg2rad } from "../utils";
import vars from "../../styles/vars";

const box = new THREE.Box3();

export default function Player() {
  const playerGroup = React.useRef<THREE.Group>();
  const playerMesh = React.useRef<THREE.Mesh>();
  const lastShootTime = React.useRef<number>(0);
  const shooting = React.useRef<boolean>(false);
  const [size, setSize] = React.useState<number>(0);
  const [zoom] = React.useState<number>(1);
  const { player } = useGame();
  const texture = useTexture(shape(player.shape, player.color));
  useControls();
  const { raycaster } = useThree();
  const bulletRefs = React.useMemo<React.RefObject<THREE.Mesh>[]>(() => {
    return player.bullets.map(() => React.createRef());
  }, [player.bullets]);

  React.useEffect(() => {
    function onResize() {
      setSize(Math.max(window.innerWidth, window.innerHeight));
    }

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  React.useEffect(() => {
    function onMove() {
      if (!playerMesh.current) return;
      if (!playerGroup.current || !playerMesh.current) return;
      box.setFromObject(playerGroup.current);
      const cX = (box.max.x + box.min.x) / 2;
      const cY = (box.max.y + box.min.y) / 2;
      const { x, y } = raycaster.ray.origin;
      playerMesh.current.rotation.z = Math.atan2(y - cY, x - cX) - deg2rad(90);
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [raycaster]);

  React.useEffect(() => {
    function onDown() {
      shooting.current = true;
    }

    function onUp() {
      shooting.current = false;
    }

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useFrame(() => {
    if (!playerMesh.current) return;

    const now = Date.now();

    if (
      shooting.current &&
      now - lastShootTime.current >= (1 - player.shootingSpeed) * 1000
    ) {
      lastShootTime.current = now;
      useGame
        .getState()
        .shoot(player.position.clone(), playerMesh.current.rotation.clone());
    }

    const game = useGame.getState();
    const bullets = [...game.player.bullets];
    bullets.forEach((bullet, index) => {
      if (now - bullet.createdAt >= bullet.lifetime) {
        bullets.splice(index, 1);
        return;
      }
      if (!bulletRefs[index]) return;
      const ref = bulletRefs[index].current;
      if (!ref) return;
      ref.position.z += bullet.speed;
    });
    game.setPlayer({ ...game.player, bullets });
  });

  return (
    <>
      <group
        ref={playerGroup}
        position={[player.position.x, player.position.y, 0]}
      >
        <mesh ref={playerMesh}>
          <planeBufferGeometry attach="geometry" args={[0.1, 0.1, 1]} />
          <meshBasicMaterial attach="material" map={texture} transparent />
        </mesh>
        <OrthographicCamera
          makeDefault
          position={[0, 0, size]}
          zoom={size * zoom}
        />
      </group>
      {player.bullets.map((bullet, index) => {
        return (
          <mesh key={index} ref={bulletRefs[index]}>
            <planeBufferGeometry attach="geometry" args={[0.01, 0.01, 1]} />
            <meshBasicMaterial attach="material" color={vars.color.black} />
          </mesh>
        );
      })}
    </>
  );
}
