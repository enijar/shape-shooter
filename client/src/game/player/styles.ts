import styled from "styled-components";
import vars from "../../styles/vars";

export const PlayerTag = styled.div`
  font-size: 0.75em;
  margin-top: 1em;
`;

export const PlayerName = styled.div`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: 5em;
  padding: 0.25em;
  line-height: 1em;
  color: ${vars.color.white};
  background-color: ${vars.color.black};
`;

export const PlayerHpBar = styled.div`
  height: 100%;
  background-color: ${vars.color.hp};
`;

type PlayerHpProps = {
  hp: number;
};
export const PlayerHp = styled.div<PlayerHpProps>`
  width: 150px;
  height: 0.85em;
  border: 2px solid ${vars.color.black};
  background-color: ${vars.color.white};

  ${PlayerHpBar} {
    width: ${({ hp }) => 100 * hp}%;
  }
`;
