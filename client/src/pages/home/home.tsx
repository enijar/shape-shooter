import React from "react";
import { useHistory } from "react-router-dom";
import { HomeShape, HomeWrapper } from "./styles";
import Page from "../../components/page/page";
import { Title } from "../../styles/typeography";
import { Container, Flex } from "../../styles/layout";
import { Shape } from "../../shared/types";
import createShape from "../../game/shape";
import vars from "../../styles/vars";
import { useGame } from "../../game/state";

export default function Home() {
  const history = useHistory();
  const { name, setName, shape, setShape } = useGame();
  const disabled = React.useMemo<boolean>(() => {
    return name.trim().length === 0 || shape === null;
  }, [name, shape]);
  const shapes = React.useMemo(() => {
    return [
      createShape(Shape.circle, vars.color.blue, "circle"),
      createShape(Shape.square, vars.color.green, "square"),
      createShape(Shape.triangle, vars.color.red, "triangle"),
    ];
  }, []);

  const onSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      if (disabled) return;
      history.push("/play");
    },
    [disabled, history]
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
              disabled
              selected={shape === Shape.circle}
              onClick={() => setShape(Shape.circle)}
            >
              <img src={shapes[0]} alt="Circle" style={{ opacity: 0 }} />
            </HomeShape>
            <HomeShape
              selected={shape === Shape.triangle}
              onClick={() => setShape(Shape.triangle)}
            >
              <img src={shapes[2]} alt="Square" />
            </HomeShape>
            <HomeShape
              disabled
              selected={shape === Shape.square}
              onClick={() => setShape(Shape.square)}
            >
              <img src={shapes[1]} alt="Triangle" style={{ opacity: 0 }} />
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
