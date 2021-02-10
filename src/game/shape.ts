import { Shape } from "./types";

function encode(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const shapes = {
  [Shape.triangle](color: string = "#ff0000"): string {
    return encode(
      `<svg height="575" viewBox="0 0 575 575" width="575" xmlns="http://www.w3.org/2000/svg"><path d="m288 38.625 287.344 497.75h-574.688z" fill="${color}" fill-rule="evenodd"/></svg>`
    );
  },
};

export default function shape(shape: Shape, color: string): string {
  // @ts-ignore
  return shapes[shape](color);
}
