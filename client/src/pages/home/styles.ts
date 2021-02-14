import styled, { css } from "styled-components";
import vars from "../../styles/vars";

export const HomeWrapper = styled.div`
  //
`;

type HomeShapeProps = {
  selected?: boolean;
};
export const HomeShape = styled.div<HomeShapeProps>`
  user-select: none;
  cursor: pointer;
  padding: 0.5em;

  img {
    pointer-events: none;
  }

  ${({ selected }) => {
    if (selected) {
      return css`
        filter: drop-shadow(0px 0px 10px ${vars.color.black});
      `;
    }
  }}
`;
