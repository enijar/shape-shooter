import React from "react";
import { Player } from "../types";
import { useState } from "../state";
import settings from "../settings";

type Props = Player & {
  size?: number;
};

function PlayerObject(
  { id, name, x, y, color, size = settings.player.size }: Props,
  ref: React.ForwardedRef<SVGSVGElement>
) {
  const { zoom } = useState();

  const currentPlayerId = React.useMemo(() => {
    return useState.getState().currentPlayer.id;
  }, []);

  const position = React.useMemo(() => {
    if (id === currentPlayerId) {
      return { x: 50 - size * zoom * 0.5, y: 50 - size * zoom * 0.5 };
    }
    return { x, y };
  }, [id, currentPlayerId, x, y, size, zoom]);

  return (
    <g ref={ref} transform={`translate(${position.x} ${position.y})`}>
      <g transform={`scale(${zoom})`}>
        <rect x={0} y={0} width={size} height={size} fill={color} />
      </g>
    </g>
  );
}

export default React.forwardRef(PlayerObject);
