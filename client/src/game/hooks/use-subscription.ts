import React from "react";
import * as THREE from "three";
import { Subscription } from "../types";

type SubscriptionFn = (...data: any[]) => void;

type Subscriptions = {
  [subscription: string]: { id: string; fn: SubscriptionFn }[];
};

const SUBSCRIPTIONS: Subscriptions = {};

export default function useSubscription(
  subscription: Subscription,
  fn: SubscriptionFn
) {
  const id = React.useMemo(() => {
    return THREE.MathUtils.generateUUID();
  }, []);

  React.useEffect(() => {
    if (!SUBSCRIPTIONS.hasOwnProperty(subscription)) {
      SUBSCRIPTIONS[subscription] = [];
    }
    SUBSCRIPTIONS[subscription].push({ id, fn });
    return () => {
      for (let i = SUBSCRIPTIONS[subscription].length - 1; i >= 0; i--) {
        if (SUBSCRIPTIONS[subscription][i].id === id) {
          SUBSCRIPTIONS[subscription].splice(i, 1);
        }
      }
    };
  }, [id, subscription, fn]);
}

useSubscription.emit = function emit(
  subscription: Subscription,
  ...data: any[]
) {
  if (!SUBSCRIPTIONS.hasOwnProperty(subscription)) return;
  for (let i = SUBSCRIPTIONS[subscription].length - 1; i >= 0; i--) {
    SUBSCRIPTIONS[subscription][i].fn(...data);
  }
};
