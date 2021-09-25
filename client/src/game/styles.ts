import styled from "styled-components";

export const SetupSceneWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

type BarFillProps = {
  color: string;
};

export const BarFill = styled.div<BarFillProps>`
  width: 100%;
  height: 100%;
  transition: width 0.2s linear;
  background-color: ${({ color }) => color};

  div {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    font-weight: bold;
  }
`;

type BarProps = {
  height: number;
};

export const Bar = styled.div<BarProps>`
  width: 100%;
  height: ${({ height }) => height}px;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  border-radius: 2em;

  ${BarFill} div {
    font-size: ${({ height }) => height * 0.75}px;
  }
`;
