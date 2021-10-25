import React from "react";
import { GameState, settings } from "@app/shared";
import { MathUtils } from "three";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useStore } from "../../store";
import useSubscription from "../../hooks/use-subscription";
import { Subscription } from "../../types";

const MAP_SIZE = 200;

const PLAYER_SIZE = (1 / settings.arena.size) * settings.player.size;

type Props = {
  gap?: number;
};

export default function Minimap({ gap = 20 }: Props) {
  const { currentPlayer, players } = useStore();

  const playerRefs = React.useRef<HTMLDivElement[]>([]);

  useSubscription(
    Subscription.entityTick,
    (i: number, gameState: GameState) => {
      if (!playerRefs.current[i]) return;
      const player = gameState.players[i];
      playerRefs.current[i].style.visibility =
        currentPlayer !== null ? "visible" : "hidden";
      const x = MathUtils.mapLinear(
        player[1],
        0,
        settings.arena.size,
        0,
        MAP_SIZE
      );
      const y = MathUtils.mapLinear(
        player[2],
        0,
        settings.arena.size,
        0,
        -MAP_SIZE / 2
      );
      playerRefs.current[i].style.transform = `translate3d(calc((${
        MAP_SIZE / 2
      }px + ${x}px) - 50%), calc((${MAP_SIZE / 2}px + ${y}px) - 50%), 0px)`;
      playerRefs.current[i].style.top = `${y}px`;
    }
  );

  const { size } = useThree();

  return (
    <Html
      style={{
        width: `${MAP_SIZE}px`,
        height: `${MAP_SIZE}px`,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "relative",
      }}
      calculatePosition={() => {
        return [gap, size.height - MAP_SIZE - gap];
      }}
    >
      {players.map((player, index) => {
        return (
          <div
            key={player[0]}
            ref={(ref) => {
              playerRefs.current[index] = ref;
            }}
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              transform: `translate3d(calc(${MAP_SIZE / 2}px - 50%), calc(${
                MAP_SIZE / 2
              }px - 50%), 0px)`,
              backgroundColor: player[3],
              width: `${Math.max(MAP_SIZE * PLAYER_SIZE, 4)}px`,
              height: `${Math.max(MAP_SIZE * PLAYER_SIZE, 4)}px`,
            }}
          />
        );
      })}
    </Html>
  );
}
