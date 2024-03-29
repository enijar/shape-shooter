import React from "react";
import { Action } from "@app/shared";
import Actions from "../../globals/actions";
import server from "../../../services/server";
import { useStore } from "../../store";

export default function Controls() {
  const { currentPlayer } = useStore();

  React.useEffect(() => {
    if (currentPlayer === null) {
      server.emit("shooting", false);
      return;
    }

    let shooting = false;

    function shoot() {
      shooting = !shooting;
      server.emit("shooting", shooting);
    }

    window.addEventListener("pointerdown", shoot);
    window.addEventListener("pointerup", shoot);
    return () => {
      window.removeEventListener("pointerdown", shoot);
      window.removeEventListener("pointerup", shoot);
    };
  }, [currentPlayer]);

  if (currentPlayer === null) return <></>;

  return (
    <Actions
      keyMap={{
        w: Action.up,
        s: Action.down,
        a: Action.left,
        d: Action.right,
        arrowup: Action.up,
        arrowdown: Action.down,
        arrowleft: Action.left,
        arrowright: Action.right,
      }}
    />
  );
}
