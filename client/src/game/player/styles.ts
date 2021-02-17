import styled from "styled-components";
import vars from "../../styles/vars";

export const PlayerName = styled.div`
  text-align: center;
  width: 5em;
  margin-bottom: 0.25em;
`;

export const PlayerHpBar = styled.div`
  height: 100%;
  background-color: ${vars.color.hp};
`;

type PlayerHpProps = {
  hp: number;
};
export const PlayerHp = styled.div<PlayerHpProps>`
  width: 100%;
  height: 0.75em;
  border: 2px solid ${vars.color.black};
  background-color: ${vars.color.white};

  ${PlayerHpBar} {
    width: ${({ hp }) => 100 * hp}%;
  }
`;
