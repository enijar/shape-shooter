import React from "react";
import { Html as ThreeHtml } from "@react-three/drei";

type Props = {
  children: any;
  center?: boolean;
  position?: [x: number, y: number, z: number];
  visible?: boolean;
  style?: object;
};

export default function Html({
  children,
  visible = true,
  style = {},
  ...props
}: Props) {
  return (
    <ThreeHtml
      {...props}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        opacity: visible ? 1 : 0,
        ...style,
      }}
    >
      {children}
    </ThreeHtml>
  );
}
