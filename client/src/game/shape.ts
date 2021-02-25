import { Shape } from "../shared/types";

function encode(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const shapes = {
  [Shape.circle](color: string = "#ff0000", id: string = ""): string {
    return encode(
      `<svg id="${id}" height="575" viewBox="0 0 575 575" width="575" xmlns="http://www.w3.org/2000/svg"><circle cx="287.5" cy="287.5" r="250" fill="${color}" fill-rule="evenodd"/></svg>`
    );
  },
  [Shape.triangle](color: string = "#ff0000", id: string = ""): string {
    return encode(
      `<svg id="${id}" height="575" viewBox="0 0 575 575" width="575" xmlns="http://www.w3.org/2000/svg"><path d="m288 38.625 287.344 497.75h-574.688z" fill="${color}" fill-rule="evenodd"/></svg>`
    );
  },
  [Shape.square](color: string = "#ff0000", id: string = ""): string {
    return encode(
      `<svg id="${id}" height="575" viewBox="0 0 575 575" width="575" xmlns="http://www.w3.org/2000/svg"><rect width="534" height="534" x="20.5" fill="${color}" fill-rule="evenodd"/></svg>`
    );
  },
};

export default function createShape(
  shape: Shape,
  color: string,
  id: string = ""
): string {
  return shapes[shape](color, id);
}
