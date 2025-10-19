import type { Callback } from "../mod.ts";
import type { Callback2 } from "./internal_types.ts";

export interface MainContext {
  pending(): { valueOf(): boolean };
  iteration(may_block: boolean): boolean;
}

export interface GLib {
  PRIORITY_HIGH: number;
  PRIORITY_DEFAULT: number;
  set_application_name(name: string): void;
  unix_signal_add(
    priority: number,
    signal: string,
    callback: Callback | Callback2,
  ): void;
  timeout_add(
    milliseconds: number,
    callback: Callback | Callback2,
  ): { valueOf: () => number };
  timeout_add_seconds(
    seconds: number,
    callback: Callback | Callback2,
  ): { valueOf: () => number };
  source_remove(source_id: number): void;
  idle_add(callback: Callback | Callback2): void;
  MainContext: {
    default(): MainContext;
  };
  Bytes: {
    new (data: number[]): Bytes;
  };
}

export interface Bytes {
  get_data(): { decode(encoding: "utf-8"): string };
}
