import { createGlobalStyle } from "styled-components";
import vars from "./vars";

export default createGlobalStyle`
  *, &:before, &:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
  }

  html, body, #root {
    height: 100%;
  }

  html {
    font-family: ${vars.font.primary};
    font-size: ${vars.rootSize}px;
    font-weight: 600;
    color: ${vars.color.white};
  }

  svg, img, iframe, canvas {
    max-width: 100%;
    align-self: center;
    flex-shrink: 0;
  }
`;
