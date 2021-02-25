import styled from "styled-components";

export const AppWrapper = styled.div`
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

export const AppVersion = styled.div`
  pointer-events: none;
  user-select: none;
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  font-size: 0.5em;
`;
