import * as THREE from "three";
import create from "zustand";
import { GameState, Player } from "./types";

export const useGame = create<GameState>((set) => {
  return {
    size: Math.max(window.innerWidth, window.innerHeight),
    zoom: 1,
    players: [],
    currentPlayerId: "",
    setCurrentPlayerId(currentPlayerId: string) {
      set({ currentPlayerId });
    },
    setPlayers(players: Player[]) {
      set({ players });
    },
    movePlayer(axis: "x" | "y", direction: number) {
      const { players, currentPlayerId } = useGame.getState();
      for (let i = 0, length = players.length; i < length; i++) {
        if (players[i].id === currentPlayerId) {
          const { speed } = players[i];
          let [x, y, z] = players[i].position;
          x = axis === "x" ? x - direction * speed : x;
          y = axis === "y" ? y - direction * speed : y;
          players[i].position = [x, y, z];
          break;
        }
      }
      set({ players });
    },
    shoot(position: THREE.Vector3, rotation: THREE.Euler) {
      // const bullet = {
      //   lifetime: 3500,
      //   speed: 0.5,
      //   createdAt: Date.now(),
      //   position: position.clone(),
      //   rotation: rotation.clone(),
      // };
      // const { player, setPlayer } = useGame.getState();
      // setPlayer({ ...player, bullets: [...player.bullets, bullet] });
    },
    update(time: number, delta: number) {
      const { players } = useGame.getState();
      // const bullets: Bullet[] = [];
      // player.bullets.forEach((bullet) => {
      //   if (time - bullet.createdAt >= bullet.lifetime) return;
      //   bullet.position.x += 1;
      //   bullet.position.y += 1;
      //   bullets.push(bullet);
      // });
      // player.bullets = bullets;
      set({ players });
    },
    setSize(size: number) {
      set({ size });
    },
    setZoom(zoom: number) {
      set({ zoom });
    },
  };
});
