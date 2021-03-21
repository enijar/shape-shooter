import React from "react";
import styled from "styled-components";
import { utils } from "@shape-shooter/shared";
import Html from "./html";
import vars from "../styles/vars";
import { useGame } from "./state";
import { useFrame } from "react-three-fiber";
import gameState from "./game-state";

type MinimapPlayerData = {
  id: number;
  x: number;
  y: number;
  color: string;
};

const MINIMAP_SIZE = 200 / vars.rootSize;
const MINIMAP_PLAYER_SIZE = 8 / vars.rootSize;

const MinimapContainer = styled.div`
  position: relative;
  width: ${MINIMAP_SIZE}em;
  height: ${MINIMAP_SIZE}em;
  background-color: ${vars.color.black};
`;

const MinimapPlayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${MINIMAP_PLAYER_SIZE}em;
  height: ${MINIMAP_PLAYER_SIZE}em;
  border-radius: 50%;
`;

export default function Minimap() {
  const { players, currentPlayer, mapBounds } = useGame();
  const [activePlayers, setActivePlayers] = React.useState<MinimapPlayerData[]>(
    []
  );

  React.useEffect(() => {
    setActivePlayers(
      players.map((player) => {
        return {
          id: player.id,
          x: player.x,
          y: player.y,
          color: player.color,
        };
      })
    );
  }, [players]);

  useFrame(() => {
    let needsUpdate = false;
    let updatedActivePlayers = activePlayers;
    for (let i = 0, length = gameState.players.length; i < length; i++) {
      const index = activePlayers.findIndex(
        (activePlayer) => activePlayer.id === gameState.players[i].id
      );
      if (index === -1) continue;
      if (
        updatedActivePlayers[index].id !== gameState.players[i].id ||
        updatedActivePlayers[index].x !== gameState.players[i].x ||
        updatedActivePlayers[index].y !== gameState.players[i].y ||
        updatedActivePlayers[index].color !== gameState.players[i].color
      ) {
        needsUpdate = true;
      }
      updatedActivePlayers[index].id = gameState.players[i].id;
      updatedActivePlayers[index].x = gameState.players[i].x;
      updatedActivePlayers[index].y = gameState.players[i].y;
      updatedActivePlayers[index].color = gameState.players[i].color;
    }
    setActivePlayers(
      needsUpdate ? [...updatedActivePlayers] : updatedActivePlayers
    );
  });

  return (
    <Html
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        top: "auto",
        right: "auto",
        width: "100vw",
        height: "100vh",
        transform: "translate(-50%, 50%)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        padding: "1em",
      }}
      center={false}
    >
      <MinimapContainer>
        {activePlayers.map((activePlayer) => {
          const x = utils.map(
            activePlayer.x,
            mapBounds.x.min,
            mapBounds.x.max,
            0,
            MINIMAP_SIZE - MINIMAP_PLAYER_SIZE
          );
          const y = utils.map(
            activePlayer.y,
            mapBounds.y.min,
            mapBounds.y.max,
            MINIMAP_SIZE - MINIMAP_PLAYER_SIZE,
            0
          );

          return (
            <MinimapPlayer
              key={activePlayer.id}
              style={{
                backgroundColor:
                  activePlayer.id === currentPlayer?.id
                    ? vars.color.white
                    : activePlayer.color,
                transform: `translate3d(${x}em, ${y}em, 0px)`,
              }}
            />
          );
        })}
      </MinimapContainer>
    </Html>
  );
}
