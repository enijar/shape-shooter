import styled from "styled-components";

export const PlayerForm = styled.form`
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1em;
  backdrop-filter: blur(1em);
  user-select: none;
  display: grid;
  grid-template-columns: 20em;
  grid-auto-rows: max-content;
  place-content: center;

  input,
  button {
    padding: 0.25em 0.5em;
    color: black;
    display: block;
    margin-top: 0.5em;
  }

  input {
    width: 100%;

    &[type="color"] {
      padding: 0;
      background-color: transparent;
      height: 2em;
      border: none;
    }
  }

  label {
    margin-bottom: 0.5em;
    text-align: left;

    :last-child {
      margin-bottom: 0;
    }
  }
`;
