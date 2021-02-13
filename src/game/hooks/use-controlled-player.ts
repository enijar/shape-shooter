import React from "react";
import { Controls } from "../types";
import { useGame } from "../state";

export default function useControlledPlayer() {
  const { movePlayer } = useGame();
  const nextFrame = React.useRef<number>(-1);
  const activeKeys = React.useRef<string[]>([]);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if (!activeKeys.current.includes(key)) {
        activeKeys.current.push(key);
      }
    }
    function onKeyUp(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const index = activeKeys.current.indexOf(key);
      if (index > -1) {
        activeKeys.current.splice(index, 1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  React.useEffect(() => {
    function update() {
      nextFrame.current = requestAnimationFrame(update);

      if (activeKeys.current.includes(Controls.moveUp)) {
        let amount = -1;
        if (
          activeKeys.current.includes(Controls.moveLeft) ||
          activeKeys.current.includes(Controls.moveRight)
        ) {
          amount *= 0.5;
        }
        movePlayer("y", amount);
      }
      if (activeKeys.current.includes(Controls.moveDown)) {
        let amount = 1;
        if (
          activeKeys.current.includes(Controls.moveLeft) ||
          activeKeys.current.includes(Controls.moveRight)
        ) {
          amount *= 0.5;
        }
        movePlayer("y", amount);
      }
      if (activeKeys.current.includes(Controls.moveLeft)) {
        movePlayer("x", 1);
      }
      if (activeKeys.current.includes(Controls.moveRight)) {
        movePlayer("x", -1);
      }
    }
    update();
    return () => {
      cancelAnimationFrame(nextFrame.current);
    };
  }, [movePlayer]);
}
