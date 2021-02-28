import { ModifierStatus } from "@shape-shooter/shared";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  rootSize: 20,
  font: {
    primary: `"Open Sans", sans-serif`,
  },
  color: {
    black: "#000000",
    black959: "#959595",
    white: "#ffffff",
    healthBar: "#00ff00",
    blue: "#3399cc",
    kills: "#e04a4a",
    red: "#ff0000",
    green: "#07930e",
    hp: "#00ff00",
    armor: "#736a6a",
    gameBackground: "#1f1f1f",
    modifiers: {
      [ModifierStatus.heal]: {
        inner: "#8cff10",
        outer: "#8cff10",
      },
      [ModifierStatus.armor]: {
        inner: "#695f5f",
        outer: "#695f5f",
      },
    },
    bullets: {
      circle: "#ff0000",
      square: "#00ff00",
      triangle: "#000000",
      ring: "#ffffff",
    },
  },
  zIndex: {
    game: 1,
    leaderboard: 2,
    deathMenu: 3,
  },
};
