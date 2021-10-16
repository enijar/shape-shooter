import React from "react";
import { Html } from "@react-three/drei";
import { PlayerForm } from "./styles";
import server from "../../../services/server";
import { useStore } from "../../store";

export default function JoinForm() {
  const { currentPlayer } = useStore();

  const nameInputRef = React.useRef<HTMLInputElement>();
  const colorInputRef = React.useRef<HTMLInputElement>();

  const play = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    server.emit("player.join", {
      name: nameInputRef.current.value,
      color: colorInputRef.current.value,
    });
  }, []);

  if (currentPlayer !== null) return <></>;

  return (
    <Html calculatePosition={() => [0, 0]}>
      <PlayerForm onSubmit={play}>
        <label>
          <h3>Enter a Name</h3>
          <input
            ref={nameInputRef}
            defaultValue="Noob"
            onChange={(event) => {
              nameInputRef.current.value = event.target.value;
            }}
          />
        </label>
        <label>
          <h3>Pick a Colo</h3>
          <input
            ref={colorInputRef}
            defaultValue="crimson"
            onChange={(event) => {
              colorInputRef.current.value = event.target.value;
            }}
          />
        </label>
        <button>Play</button>
      </PlayerForm>
    </Html>
  );
}
