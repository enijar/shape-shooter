import styled from "styled-components";

type FlexProps = {
  direction?: "column" | "column-reverse" | "row" | "row-reverse";
  align?: "flex-start" | "center" | "flex-end";
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-around"
    | "space-between";
};
export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction = "row" }) => direction};
  align-items: ${({ align = "flex-start" }) => align};
  justify-content: ${({ justify = "flex-start" }) => justify};
`;

type ContainerProps = {
  width?: number | string;
};
export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: ${({ width = "600px" }) => width};
  margin-left: auto;
  margin-right: auto;
`;
