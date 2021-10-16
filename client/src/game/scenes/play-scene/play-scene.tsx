import React from "react";
import { GameState } from "@app/shared";
import server from "../../../services/server";
import gameState from "../../game-state";
import Controls from "./controls";
import Arena from "./arena";
import Players from "./players";
import Bullets from "./bullets";
import Items from "./items";
import Foods from "./foods";
import Leaderboard from "./leaderboard";
import Minimap from "./minimap";
import JoinForm from "./join-form";

export default function PlayScene() {
  React.useEffect(() => {
    server.on("tick", (state: GameState) => {
      gameState.players = state.players;
      gameState.bullets = state.bullets;
      gameState.items = state.items;
      gameState.foods = state.foods;
    });
    return () => {
      server.off("tick");
    };
  }, []);

  return (
    <group>
      <Controls />
      <React.Suspense fallback={<></>}>
        <Arena />
        <Players />
        <Bullets />
        <Items />
        <Foods />
        <Leaderboard />
        <Minimap />
        <JoinForm />
      </React.Suspense>
    </group>
  );
}
