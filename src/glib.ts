import type { Callback } from "../mod.ts";

export interface GLib {
  timeout_add(
    milliseconds: number,
    callback: Callback,
  ): { valueOf: () => number };
  set_application_name(name: string): void;
}
