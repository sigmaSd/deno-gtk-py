import { type NamedArgument } from "https://deno.land/x/python@0.4.1/mod.ts";
import { type Callback } from "https://deno.land/x/python@0.4.1/src/python.ts";

export interface Adw {
  Application: ApplicationConstructor;
  run: () => void;
}

export interface Gtk {
  ApplicationWindow: ApplicationWindowConstructor;
  Box: (kwArg: NamedArgument) => Box;
  Button: (kwArg: NamedArgument) => Button;
  Orientation: { VERTICAL: never };
}

export interface ApplicationConstructor {
  new (kwArg: NamedArgument): Application;
}
export interface Application {
  //FIXME: args type
  run: (args: string[]) => void;
  connect: (signal: "activate", callback: Callback) => void;
}
export interface ApplicationWindowConstructor {
  new (kwArg: NamedArgument): ApplicationWindow;
}
export interface ApplicationWindow {
  set_child: (widget: Widget) => void;
  present: () => void;
}

// deno-lint-ignore no-empty-interface
export interface Widget {
}

export interface Box extends Widget {
  append(child: Widget): void;
}

export interface Button extends Widget {
  connect(event: "clicked", hello: Callback): void;
}
