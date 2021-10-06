import React from "react";
import { Player } from "../types";
import { Action, useState } from "../state";
import settings from "../settings";

type Props = Player & {
  size?: number;
};

function PlayerObject(
  { id, name, x, y, color, size = settings.player.size }: Props,
  ref: React.ForwardedRef<SVGSVGElement>
) {
  const { zoom, action } = useState();

  const isCurrentPlayer = React.useMemo(() => {
    return id === useState.getState().currentPlayer.id;
  }, [id]);

  const position = React.useMemo(() => {
    if (isCurrentPlayer) {
      // return { x: 50 - size * zoom * 0.5, y: 50 - size * zoom * 0.5 };
    }
    return { x, y };
  }, [isCurrentPlayer, x, y, size, zoom]);

  // Controls
  React.useEffect(() => {
    const actions: Action[] = [];

    let nextFrame: number;
    (function tick() {
      nextFrame = requestAnimationFrame(tick);
      for (let i = 0, length = actions.length; i < length; i++) {
        action(actions[i]);
      }
    })();

    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      switch (key) {
        case "w":
          if (!actions.includes(Action.up)) {
            actions.push(Action.up);
          }
          break;
        case "s":
          if (!actions.includes(Action.down)) {
            actions.push(Action.down);
          }
          break;
        case "a":
          if (!actions.includes(Action.left)) {
            actions.push(Action.left);
          }
          break;
        case "d":
          if (!actions.includes(Action.right)) {
            actions.push(Action.right);
          }
          break;
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      let index = -1;
      switch (key) {
        case "w":
          index = actions.indexOf(Action.up);
          break;
        case "s":
          index = actions.indexOf(Action.down);
          break;
        case "a":
          index = actions.indexOf(Action.left);
          break;
        case "d":
          index = actions.indexOf(Action.right);
          break;
      }
      actions.splice(index, 1);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      cancelAnimationFrame(nextFrame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <g ref={ref} transform={`translate(${position.x} ${position.y})`}>
      <g transform={`scale(${zoom})`}>
        <rect x={0} y={0} width={size} height={size} fill={color} />
      </g>
    </g>
  );
}

export default React.forwardRef(PlayerObject);
