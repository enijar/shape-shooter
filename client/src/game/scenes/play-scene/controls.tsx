import React from "react";
import { Action, PlayerEntity } from "@app/shared";
import Actions from "../../globals/actions";
import server from "../../../services/server";

type Props = {
  currentPlayer?: PlayerEntity;
};

export default function Controls({ currentPlayer }: Props) {
  React.useEffect(() => {
    if (currentPlayer === null) return;
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
        ArrowUp: Action.up,
        ArrowDown: Action.down,
        ArrowLeft: Action.left,
        ArrowRight: Action.right,
      }}
    />
  );
}
