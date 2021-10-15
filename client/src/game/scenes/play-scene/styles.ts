import styled from "styled-components";

export const PlayerForm = styled.form`
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1em;
  backdrop-filter: blur(1em);
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input,
  button {
    padding: 0.25em 0.5em;
    color: black;
    display: block;
    margin-top: 0.5em;
  }
`;
