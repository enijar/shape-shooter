import styled from "styled-components";
import vars from "../../styles/vars";

const PLAYER_SIZE = 200;

export const PlayerWeapon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  filter: invert(100%);
`;

export const PlayerShape = styled.div`
  pointer-events: none;
  position: relative;

  img {
    display: block;
    align-self: center;
    flex-shrink: 0;
  }
`;

export const PlayerName = styled.div`
  background-color: ${vars.color.black};
  color: ${vars.color.white};
  padding: 0.1em 0.5em;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type PlayerHealthBarProps = {
  health: number;
};
export const PlayerHealthBar = styled.div<PlayerHealthBarProps>`
  width: 64%;
  height: 14px;
  border: 2px solid ${vars.color.black};
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ health }) => health * 100}%;
    height: 100%;
    background-color: ${vars.color.healthBar};
    transition: width 0.15s linear;
  }
`;

export const PlayerWrapper = styled.div`
  user-select: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: ${PLAYER_SIZE}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
