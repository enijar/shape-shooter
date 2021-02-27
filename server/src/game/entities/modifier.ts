import { ModifierStatus } from "@shape-shooter/shared";

export default class Modifier {
  x: number = 0;
  y: number = 0;
  status: ModifierStatus = ModifierStatus.empty;
  value: number = 0;

  encode(): object {
    return {
      x: this.x,
      y: this.y,
      status: this.status,
    };
  }

  update() {
    //
  }
}
