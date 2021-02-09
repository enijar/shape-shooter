import styled from "styled-components";
import vars from "../styles/vars";
import assets from "./assets";

const WORLD_SIZE = 32 * 100;

export const GameWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${vars.zIndex.game};
`;

export const GameWorld = styled.div`
  width: ${WORLD_SIZE}px;
  height: ${WORLD_SIZE}px;
`;

export const GameBackground = styled.div`
  width: 100%;
  height: 100%;
  background-size: 32px 32px;
  background-repeat: repeat;
  background-image: url("${assets.chunk}");
  opacity: 0.4;
`;
