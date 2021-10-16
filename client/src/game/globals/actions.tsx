import React from "react";
import { Action } from "@app/shared";
import server from "../../services/server";

type KeyActionMap = {
  [key: string]: Action;
};

type ActionMap = {
  [key: string]: boolean;
};

type Props = {
  keyMap: KeyActionMap;
};

export default function Actions({ keyMap }: Props) {
  const [actions, setActions] = React.useState<ActionMap>(() => {
    const actions: ActionMap = {};
    for (const key in keyMap) {
      actions[keyMap[key]] = false;
    }
    return actions;
  });

  React.useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.repeat) return;
      const key = event.key;
      if (keyMap.hasOwnProperty(key)) {
        setActions((actions) => {
          return { ...actions, [keyMap[key]]: true };
        });
      }
    }

    function onKeyup(event: KeyboardEvent) {
      const key = event.key;
      if (keyMap.hasOwnProperty(key)) {
        setActions((actions) => {
          return { ...actions, [keyMap[key]]: false };
        });
      }
    }

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
    };
  }, [keyMap]);

  React.useEffect(() => {
    server.emit("actions", actions);
  }, [actions]);

  React.useEffect(() => {
    function onBlur() {
      setActions({});
    }

    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return <></>;
}
