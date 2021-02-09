import { createGlobalStyle } from "styled-components";
import vars from "./vars";

export default createGlobalStyle`
  *, &:before, &:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  html {
    font-family: ${vars.font.primary};
    font-size: ${vars.rootSize}px;
  }
`;
