import * as THREE from "three";
import create from "zustand";
import { GameState, Player, Shape, Weapon } from "./types";

export const useGame = create<GameState>((set) => {
  return {
    player: {
      position: new THREE.Vector3(0, 0, 0),
      health: 0.8,
      speed: 0.005,
      name: "Enijar",
      shape: Shape.triangle,
      weapon: Weapon.handgun,
      color: "#ff0000",
      firingSpeed: 0.75,
    },
    setPlayer(player: Player) {
      set({ player });
    },
    movePlayer(axis: "x" | "y", direction: number) {
      const { player } = useGame.getState();
      const { speed } = player;
      const { x, y } = player.position;
      player.position.set(
        axis === "x" ? x - direction * speed : x,
        axis === "y" ? y - direction * speed : y,
        0
      );
      set({ player });
    },
  };
});
