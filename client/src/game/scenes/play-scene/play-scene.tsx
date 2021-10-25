import React from "react";
import { GameState } from "@app/shared";
import server from "../../../services/server";
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
import { MAX_ENTITIES } from "../../consts";

export default function PlayScene() {
  React.useEffect(() => {
    server.on("tick", (gameState: GameState) => {
      useSubscription.emit(Subscription.tick, gameState);
      for (let i = 0; i < MAX_ENTITIES; i++) {
        useSubscription.emit(Subscription.entityTick, i, gameState);
      }
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
