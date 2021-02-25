import styled, { css } from "styled-components";
import vars from "../../styles/vars";

export const HomeWrapper = styled.div`
  //
`;

type HomeShapeProps = {
  selected?: boolean;
  disabled?: boolean;
};
export const HomeShape = styled.div<HomeShapeProps>`
  user-select: none;
  cursor: pointer;
  padding: 0.5em;

  img {
    pointer-events: none;
  }

  ${({ selected, disabled }) => {
    if (disabled) {
      return css`
        pointer-events: none;
        cursor: default;
      `;
    }
    if (selected) {
      return css`
        filter: drop-shadow(0px 0px 15px ${vars.color.white});
      `;
    }
  }}
`;
