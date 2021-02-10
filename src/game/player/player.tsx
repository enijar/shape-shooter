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
const direction = new THREE.Vector3();

const MAX_PROJECTILES = 5;

type Projectile = {
  id: number;
  position: THREE.Vector3;
  direction: THREE.Vector3;
  ref: any;
};

type ProjectileObject = {
  id: number;
  position: THREE.Vector3;
};

export default function Player() {
  const playerGroup = React.useRef<THREE.Group>();
  const playerMesh = React.useRef<THREE.Mesh>();
  const lastProjectileTime = React.useRef<number>(0);
  const projectiles = React.useRef<Projectile[]>([]);
  const [projectileObjects, setProjectileObjects] = React.useState<
    ProjectileObject[]
  >([]);
  const firing = React.useRef<boolean>(false);
  const [size, setSize] = React.useState<number>(0);
  const [zoom] = React.useState<number>(1);
  const { player } = useGame();
  const texture = useTexture(shape(player.shape, player.color));
  useControls();
  const { raycaster } = useThree();

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
      firing.current = true;
    }

    function onUp() {
      firing.current = false;
    }

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useFrame((state) => {
    const now = Date.now();

    if (
      firing.current &&
      now - lastProjectileTime.current >= (1 - player.firingSpeed) * 1000
    ) {
      lastProjectileTime.current = now;
      const position = player.position
        .clone()
        .add(new THREE.Vector3(0, 0.1, 0));
      const id = now;
      projectiles.current.push({
        id,
        position,
        direction: direction
          .subVectors(position, state.raycaster.ray.origin)
          .normalize(),
        ref: React.createRef(),
      });
      setProjectileObjects((projectileObjects) => {
        return [...projectileObjects, { id, position }];
      });
    }

    projectiles.current.forEach((projectile) => {
      const object = projectile.ref.current;
      if (!object) return;
      object.translateY(0.005);
    });
  });

  React.useEffect(() => {
    if (projectileObjects.length > MAX_PROJECTILES) {
      setProjectileObjects((projectileObjects) => {
        const [first, ...rest] = projectileObjects;
        projectiles.current = projectiles.current.filter((projectile) => {
          return projectile.id !== first.id;
        });
        return rest;
      });
    }
  }, [projectileObjects]);

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
      {projectileObjects.map((projectileObject) => {
        const projectile = projectiles.current.find((projectile) => {
          return projectile.id === projectileObject.id;
        });
        if (!projectile) return null;
        return (
          <mesh
            key={projectile.id}
            position={projectile.position}
            ref={projectile.ref}
          >
            <planeBufferGeometry attach="geometry" args={[0.01, 0.01, 1]} />
            <meshBasicMaterial attach="material" color={vars.color.black} />
          </mesh>
        );
      })}
    </>
  );
}
