import React from "react";
import { OrthographicCamera, TrackballControls } from "@react-three/drei";
import config from "../../config";

export default function Camera() {
  return (
    <>
      <OrthographicCamera makeDefault />
      {config.debug && <TrackballControls />}
    </>
  );
}
