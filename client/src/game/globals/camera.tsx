import React from "react";
import { OrthographicCamera } from "@react-three/drei";

export default function Camera() {
  return (
    <>
      <OrthographicCamera makeDefault />
    </>
  );
}
