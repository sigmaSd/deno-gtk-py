import type { Callback } from "../mod.ts";
import type { Callback2 } from "./internal_types.ts";

export interface Object extends MyPyObject {
  connect(signal: string, callback: Callback | Callback2): void;
  TYPE_NONE: GType;
}

// deno-lint-ignore no-empty-enum
export enum GType {
}

export interface MyPyObject {
  __eq__(other: MyPyObject): { valueOf: () => boolean };
}
