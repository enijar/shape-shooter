import React from "react";
import { HomeShape, HomeWrapper } from "./styles";
import Page from "../../components/page/page";
import { Title } from "../../styles/typeography";
import { Container, Flex } from "../../styles/layout";
import { Shape } from "../../shared/types";
import createShape from "../../game/shape";
import vars from "../../styles/vars";
import { EnginePlayerShape } from "../../shared/game/engine";

export default function Home() {
  const [name, setName] = React.useState<string>("");
  const [shape, setShape] = React.useState<null | EnginePlayerShape>(null);
  const disabled = React.useMemo<boolean>(() => {
    return name.trim().length === 0 || shape === null;
  }, [name, shape]);
  const shapes = React.useMemo(() => {
    return [
      createShape(EnginePlayerShape.circle, vars.color.blue),
      createShape(EnginePlayerShape.square, vars.color.green),
      createShape(EnginePlayerShape.triangle, vars.color.red),
    ];
  }, []);

  const onSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      if (disabled) return;
      console.log(name, shape);
    },
    [disabled, name, shape]
  );

  return (
    <Page>
      <HomeWrapper>
        <Container>
          <Title center>
            <h4>Player Icon</h4>
          </Title>
          <Flex align="center" justify="space-between">
            <HomeShape
              selected={shape === EnginePlayerShape.circle}
              onClick={() => setShape(EnginePlayerShape.circle)}
            >
              <img src={shapes[0]} alt="Circle" />
            </HomeShape>
            <HomeShape
              selected={shape === EnginePlayerShape.triangle}
              onClick={() => setShape(EnginePlayerShape.triangle)}
            >
              <img src={shapes[1]} alt="Triangle" />
            </HomeShape>
            <HomeShape
              selected={shape === EnginePlayerShape.square}
              onClick={() => setShape(EnginePlayerShape.square)}
            >
              <img src={shapes[2]} alt="Square" />
            </HomeShape>
          </Flex>

          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="name">Player Name</label>
              <br />
              <input
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <button type="submit" disabled={disabled}>
                Play
              </button>
            </div>
          </form>
        </Container>
      </HomeWrapper>
    </Page>
  );
}
