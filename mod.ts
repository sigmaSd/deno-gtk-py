// deno-lint-ignore-file no-empty-interface
import type { NamedArgument } from "https://deno.land/x/python@0.4.1/mod.ts";
import type {
  Callback,
  PythonConvertible,
} from "https://deno.land/x/python@0.4.1/src/python.ts";

export interface Adw {
  Application: ApplicationConstructor;
  run: () => void;
}

export interface Gtk {
  ApplicationWindow: ApplicationWindowConstructor;
  Box: (kwArg: NamedArgument) => Box;
  Button: (kwArg: NamedArgument) => Button;
  CheckButton(arg0: NamedArgument): CheckButton;
  Orientation: {
    HORIZONTAL: PythonConvertible;
    VERTICAL: PythonConvertible;
  };
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
  set_default_size: (width: number, height: number) => void;
  set_title: (name: string) => void;
  present: () => void;
  close: () => void;
}

export interface Widget {
}

export interface Box extends Widget {
  append(child: Widget): void;
}

export interface Button extends Widget {
  connect(event: "clicked", hello: Callback): void;
}

export interface CheckButton extends Widget {
  get_active(): boolean;
}
