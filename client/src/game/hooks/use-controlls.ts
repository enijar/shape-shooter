import React from "react";
import { Controls } from "../../shared/types";

type ControlsState = {
  [Controls.moveUp]: () => boolean;
  [Controls.moveDown]: () => boolean;
  [Controls.moveLeft]: () => boolean;
  [Controls.moveRight]: () => boolean;
  shooting: () => boolean;
};

const SHOOTING_DELAY = 1000;
const SHOOTING_SPEED = 0.5;

export default function useControls(): ControlsState {
  const [activeKeys, setActiveKeys] = React.useState<string[]>([]);
  const pointerDown = React.useRef<boolean>(false);
  const lastShootTime = React.useRef<number>(0);
  const controlsState = React.useMemo<ControlsState>(() => {
    return {
      [Controls.moveUp]() {
        return activeKeys.includes(Controls.moveUp);
      },
      [Controls.moveDown]() {
        return activeKeys.includes(Controls.moveDown);
      },
      [Controls.moveLeft]() {
        return activeKeys.includes(Controls.moveLeft);
      },
      [Controls.moveRight]() {
        return activeKeys.includes(Controls.moveRight);
      },
      shooting() {
        const now = Date.now();
        const shootingDelta = now - lastShootTime.current;
        if (
          pointerDown.current &&
          shootingDelta > SHOOTING_DELAY * Math.max(0, 1 - SHOOTING_SPEED)
        ) {
          lastShootTime.current = now;
          return true;
        }
        return false;
      },
    };
  }, [activeKeys, pointerDown]);

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
      pointerDown.current = true;
    }

    function onPointerUp() {
      pointerDown.current = false;
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

  return controlsState;
}
