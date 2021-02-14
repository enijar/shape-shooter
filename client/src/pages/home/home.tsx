import React from "react";
import { HomeShape, HomeWrapper } from "./styles";
import Page from "../../components/page/page";
import { Title } from "../../styles/typeography";
import { Container, Flex } from "../../styles/layout";
import { Shape } from "../../game/types";
import createShape from "../../game/shape";
import vars from "../../styles/vars";

export default function Home() {
  const [name, setName] = React.useState<string>("");
  const [shape, setShape] = React.useState<null | Shape>(null);
  const disabled = React.useMemo<boolean>(() => {
    return name.trim().length === 0 || shape === null;
  }, [name, shape]);
  const shapes = React.useMemo(() => {
    return [
      createShape(Shape.circle, vars.color.blue),
      createShape(Shape.square, vars.color.green),
      createShape(Shape.triangle, vars.color.red),
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
              selected={shape === Shape.circle}
              onClick={() => setShape(Shape.circle)}
            >
              <img src={shapes[0]} alt="Circle" />
            </HomeShape>
            <HomeShape
              selected={shape === Shape.triangle}
              onClick={() => setShape(Shape.triangle)}
            >
              <img src={shapes[1]} alt="Triangle" />
            </HomeShape>
            <HomeShape
              selected={shape === Shape.square}
              onClick={() => setShape(Shape.square)}
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
