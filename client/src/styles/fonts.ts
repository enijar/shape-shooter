import { createGlobalStyle } from "styled-components";

// @todo reduce number of fonts used
export default createGlobalStyle`
  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-SemiBoldItalic.woff2") format("woff2");
    font-weight: 600;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-ExtraBoldItalic.woff2") format("woff2");
    font-weight: 800;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-BoldItalic.woff2") format("woff2");
    font-weight: bold;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-Regular.woff2") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-ExtraBold.woff2") format("woff2");
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-Light.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-Italic.woff2") format("woff2");
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-LightItalic.woff2") format("woff2");
    font-weight: 300;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-SemiBold.woff2") format("woff2");
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Open Sans";
    src: url("/assets/fonts/OpenSans-Bold.woff2") format("woff2");
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
`;
