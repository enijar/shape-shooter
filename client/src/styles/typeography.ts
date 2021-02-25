import styled, { css } from "styled-components";
import vars from "./vars";

type TitleProps = {
  center?: boolean;
};
export const Title = styled.div<TitleProps>`
  color: ${vars.color.white};

  ${({ center = false }) => {
    if (center) {
      return css`
        text-align: center;
      `;
    }
  }}
  h1 {
    font-size: 5em;
  }

  h2 {
    font-size: 4em;
  }

  h3 {
    font-size: 3em;
  }

  h4 {
    font-size: 2em;
  }

  h5 {
    font-size: 1em;
  }
`;
