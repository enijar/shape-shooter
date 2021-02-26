import { ModifierStatus } from "../shared/types";

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
    red: "#ff0000",
    green: "#07930e",
    hp: "#00ff00",
    gameBackground: "#1f1f1f",
    modifiers: {
      [ModifierStatus.heal]: {
        inner: "#8cff10",
        outer: "#8cff10"
      },
    },
  },
  zIndex: {
    game: 1,
  },
};
