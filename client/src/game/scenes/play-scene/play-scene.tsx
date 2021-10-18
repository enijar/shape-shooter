import React from "react";
import { GameState } from "@app/shared";
import { useFrame } from "@react-three/fiber";
import server from "../../../services/server";
import gameState from "../../game-state";
import Controls from "./controls";
import Arena from "./arena";
import Players from "./players";
import Items from "./items";
import Leaderboard from "./leaderboard";
import Minimap from "./minimap";
import JoinForm from "./join-form";
import useSubscription from "../../hooks/use-subscription";
import { Subscription } from "../../types";
import Bullets from "./bullets";
import AiMissiles from "./ai-missiles";
import Foods from "./foods";

const MAX_ENTITIES = 500;

export default function PlayScene() {
  React.useEffect(() => {
    server.on("tick", (state: GameState) => {
      gameState.players = state.players;
      gameState.aiMissiles = state.aiMissiles;
      gameState.bullets = state.bullets;
      gameState.items = state.items;
      gameState.foods = state.foods;
    });
    return () => {
      server.off("tick");
    };
  }, []);

  useFrame(({ clock }) => {
    for (let i = 0; i < MAX_ENTITIES; i++) {
      useSubscription.emit(Subscription.tick, i, clock);
    }
  });

  return (
    <group>
      <Controls />
      <React.Suspense fallback={<></>}>
        <Arena />
        <Players />
        <AiMissiles />
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
