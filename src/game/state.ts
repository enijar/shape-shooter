import create from "zustand";
import { GameState, Player, Shape, Weapon } from "./types";

export const useGame = create<GameState>((set) => {
  return {
    player: {
      x: 0,
      y: 0,
      health: 0.8,
      speed: 4,
      name: "Enijar",
      shape: Shape.triangle,
      weapon: Weapon.handgun,
    },
    setPlayer(player: Player) {
      set({ player });
    },
    movePlayer(axis: "x" | "y", direction: number) {
      const { player } = useGame.getState();
      const x = axis === "x" ? player.x - direction * player.speed : player.x;
      const y = axis === "y" ? player.y - direction * player.speed : player.y;
      console.log({ x, y });
      set({ player: { ...player, x, y } });
    },
  };
});
