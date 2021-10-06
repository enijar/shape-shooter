import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  place-items: center;
  place-content: center;
  padding: 1em;

  form {
    --h: 45.86;
    --s: 64.61%;
    --l: 52.35%;

    fieldset {
      border: none;
      display: grid;
      grid-template-columns: 4em 12em;
      grid-template-rows: 2em;
      margin-bottom: 0.5em;
    }

    label,
    input,
    button {
      padding: 0.25em 0.5em;
    }

    label,
    button {
      cursor: pointer;
      color: white;
    }

    input,
    button {
      display: block;
    }

    label {
      display: flex;
      align-items: center;
      background-color: hsl(var(--h), var(--s), var(--l));

      :hover {
        background-color: hsl(var(--h), var(--s), calc(var(--l) * 0.9));
      }
    }

    input {
      width: 100%;
      height: 100%;
      outline: none;
      color: black;
      border: 2px solid transparent;

      :focus {
        border: 2px solid hsl(var(--h), var(--s), var(--l));
      }
    }

    button {
      margin-left: auto;
      background-color: hsl(var(--h), var(--s), var(--l));
      border: 2px solid hsl(var(--h), var(--s), calc(var(--l) * 0.9));
    }
  }
`;

export const Svg = styled.svg`
  width: 100%;
  height: auto;

  @media (orientation: landscape) {
    width: auto;
    height: 100%;
  }
`;
