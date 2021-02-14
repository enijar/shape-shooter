import React from "react";
import { Controls } from "../../shared/types";
import { useGame } from "../state";

type ControlsState = {
  [Controls.moveUp]: () => boolean;
  [Controls.moveDown]: () => boolean;
  [Controls.moveLeft]: () => boolean;
  [Controls.moveRight]: () => boolean;
  shooting: () => boolean;
};

const SHOOTING_DELAY = 1000;

export default function useControls(): ControlsState {
  const { player } = useGame();
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
          player &&
          pointerDown.current &&
          shootingDelta > SHOOTING_DELAY * (1 - player.shootingSpeed)
        ) {
          lastShootTime.current = now;
          return true;
        }
        return false;
      },
    };
  }, [activeKeys, pointerDown, player]);

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
