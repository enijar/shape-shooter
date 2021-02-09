import { GameWrapper, GameWorld, GameBackground } from "./styles";
import { useGame } from "./state";
import Player from "./player/player";

export default function Game() {
  const { player } = useGame();

  return (
    <GameWrapper>
      <GameWorld
        style={{ transform: `translate(${player.x}px, ${player.y}px)` }}
      >
        <GameBackground />
      </GameWorld>
      <Player />
    </GameWrapper>
  );
}
