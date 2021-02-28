import { deserialize, serialize } from "bson";

export default class Transport {
  static encode(data: any): any {
    return serialize(data);
  }

  static decode(data: any): any {
    return deserialize(data);
  }
}
