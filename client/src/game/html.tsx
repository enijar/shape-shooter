import React from "react";
import { Html as ThreeHtml } from "@react-three/drei";

type Props = {
  children: any;
  center?: boolean;
  position?: [x: number, y: number, z: number];
};

export default function Html({ children, ...props }: Props) {
  return (
    <ThreeHtml {...props} style={{ pointerEvents: "none", userSelect: "none" }}>
      {children}
    </ThreeHtml>
  );
}
