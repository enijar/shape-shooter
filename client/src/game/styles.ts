import styled from "styled-components";
import { lighten, rgba } from "polished";
import vars from "../styles/vars";

export const GameWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${vars.zIndex.game};
`;

type DeathMenuProps = {
  show?: boolean;
};
export const DeathMenu = styled.div<DeathMenuProps>`
  position: absolute;
  user-select: none;
  top: 0;
  left: 0;
  z-index: ${vars.zIndex.deathMenu};
  pointer-events: ${({ show }) => (show ? "all" : "none")};
  width: 100vw;
  height: 100vh;
  color: ${vars.color.black};
  background-color: ${rgba(vars.color.white, 0.5)};
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity ${({ show }) => (show ? 1 : 0.25)}s linear;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    background-color: ${vars.color.white};
    padding: 0.5em 1em;
    margin-bottom: 0.25em;
    font-weight: bold;
    text-transform: uppercase;
    border: 2px solid ${vars.color.black};
  }

  button {
    background-color: ${vars.color.black};
    color: ${vars.color.white};
    border: none;
    padding: 0.5em 1em;
    border-radius: 2em;
    outline: none;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${lighten(0.25, vars.color.black)};
    }
  }
`;

export const Leaderboard = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: ${vars.zIndex.leaderboard};
  color: ${vars.color.white};
  padding: 1em;
  pointer-events: none;
  user-select: none;
`;

export const LeaderboardPlayer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
  font-size: 0.75em;
  line-height: 1em;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const LeaderboardPlayerName = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 7em;
  text-align: right;
  padding: 0.25rem;
  margin-right: 0.5rem;
  background-color: ${vars.color.black};
`;

export const LeaderboardPlayerKills = styled.div`
  width: 4.25em;
  padding: 0.25rem;
  background-color: ${vars.color.kills};
  text-align: right;
`;
