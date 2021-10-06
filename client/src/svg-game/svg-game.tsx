import React from "react";
import { Svg, Wrapper } from "./styles";
import PlayersManager from "./managers/players-manager";
import { Status, useState } from "./state";
import { uuid } from "./utils";
import Arena from "./objects/arena";

export default function SvgGame() {
  const { status, setCurrentPlayer, addPlayer, setStatus } = useState();

  // @note for testing only
  React.useLayoutEffect(() => {
    if (window.location.host === "localhost:8080") {
      const currentPlayer = {
        name: "James",
        color: "crimson",
        x: 0,
        y: 0,
        id: "30edeec5-fe81-47f4-bcfd-375c94d7ff73",
      };
      setCurrentPlayer(currentPlayer);
      addPlayer(currentPlayer);

      const botCount = 2;
      for (let i = 0; i < botCount; i++) {
        addPlayer({
          x: 10 + i * 10,
          y: 10 + i * 10,
          name: `Bot ${i + 1}`,
          color: "green",
          id: uuid(),
        });
      }

      setStatus(Status.play);
    }
  }, []);

  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const play = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nameInputRef.current === null) return;
    const name = nameInputRef.current.value.trim();
    const color = colorInputRef.current.value;
    // @todo handle errors
    if (name.length === 0) return;
    const currentPlayer = { name, color, x: 0, y: 0, id: uuid() };
    setCurrentPlayer(currentPlayer);
    addPlayer(currentPlayer);
    setStatus(Status.play);
  }, []);

  return (
    <Wrapper>
      {status === Status.setup && (
        <form onSubmit={play}>
          <fieldset>
            <label htmlFor="name">Name</label>
            <input
              autoComplete="off"
              ref={nameInputRef}
              id="name"
              name="name"
              placeholder="Enter a name"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="color">Color</label>
            <input ref={colorInputRef} id="color" name="color" type="color" />
          </fieldset>
          <button>Play Now!</button>
        </form>
      )}
      {status === Status.play && (
        <Svg viewBox="0 0 100 100">
          <Arena />
          <PlayersManager />
        </Svg>
      )}
    </Wrapper>
  );
}
