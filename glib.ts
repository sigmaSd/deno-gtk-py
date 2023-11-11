import { Callback } from "https://deno.land/x/python@0.4.1/src/python.ts";

export interface GLib {
  timeout_add(milliseconds: number, callback: Callback): number;
  set_application_name(name: string): void;
}
