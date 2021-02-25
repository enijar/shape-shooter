import React from "react";
import { ControlsKeys } from "../../shared/types";
import { useGame } from "../state";

type Controls = {
  moveX: -1 | 0 | 1;
  moveY: -1 | 0 | 1;
  firing: boolean;
};

export default function useControls(): Controls {
  const { socket } = useGame();
  const [activeKeys, setActiveKeys] = React.useState<string[]>([]);
  const [pointerDown, setPointerDown] = React.useState<boolean>(false);
  const [controls, setControls] = React.useState<Controls>(() => ({
    moveX: 0,
    moveY: 0,
    firing: false,
  }));

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      setActiveKeys((activeKeys) => {
        if (!activeKeys.includes(key)) {
          return [...activeKeys, key];
        }
        return activeKeys;
      });
    }

    function onKeyUp(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      setActiveKeys((activeKeys) => {
        const index = activeKeys.indexOf(key);
        if (index === -1) {
          return activeKeys;
        }
        return activeKeys.filter((activeKey, activeKeyIndex) => {
          return index !== activeKeyIndex;
        });
      });
    }

    function onPointerDown() {
      setPointerDown(true);
    }

    function onPointerUp() {
      setPointerDown(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  React.useEffect(() => {
    let moveX: -1 | 0 | 1 = 0;
    let moveY: -1 | 0 | 1 = 0;
    if (activeKeys.includes(ControlsKeys.moveUp)) {
      moveY = -1;
    }
    if (activeKeys.includes(ControlsKeys.moveDown)) {
      moveY = 1;
    }
    if (activeKeys.includes(ControlsKeys.moveLeft)) {
      moveX = -1;
    }
    if (activeKeys.includes(ControlsKeys.moveRight)) {
      moveX = 1;
    }
    if (socket !== null) {
      socket.emit("controls", { moveX, moveY, firing: pointerDown });
    }
    setControls({ moveX, moveY, firing: pointerDown });
  }, [activeKeys, pointerDown, socket]);

  return controls;
}
