import {
  PlayerWrapper,
  PlayerShape,
  PlayerWeapon,
  PlayerName,
  PlayerHealthBar,
} from "./styles";
import assets from "../assets";
import { useGame } from "../state";
import useControls from "../hooks/use-controls";

export default function Player() {
  const { player } = useGame();
  useControls();

  return (
    <PlayerWrapper>
      <PlayerShape>
        <img src={assets.shapes[player.shape]} alt={player.shape} />
        <PlayerWeapon src={assets.weapons[player.weapon]} />
      </PlayerShape>
      <PlayerName>{player.name}</PlayerName>
      <PlayerHealthBar health={player.health} />
    </PlayerWrapper>
  );
}
