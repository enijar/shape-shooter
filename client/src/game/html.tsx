import React from "react";
import { Html as ThreeHtml } from "@react-three/drei";

type Props = {
  children: any;
  center?: boolean;
  position?: [x: number, y: number, z: number];
  visible?: boolean;
};

export default function Html({ children, visible = true, ...props }: Props) {
  return (
    <ThreeHtml
      {...props}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </ThreeHtml>
  );
}
