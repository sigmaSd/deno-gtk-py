// deno-lint-ignore-file no-empty-interface
import type { NamedArgument } from "https://deno.land/x/python@0.4.1/mod.ts";
import type {
  Callback,
  PythonConvertible,
} from "https://deno.land/x/python@0.4.1/src/python.ts";

export interface Gdk {
  Display: Display;
}

export interface Display {
  get_default(): Display;
}

export interface Adw {
  Application: ApplicationConstructor;
  run: () => void;
}

export interface Gtk {
  STYLE_PROVIDER_PRIORITY_APPLICATION: number;
  StyleContext: StyleContext;
  CssProvider(): StyleProvider;
  ApplicationWindow: ApplicationWindowConstructor;
  HeaderBar(): HeaderBar;
  Scale(): Scale;
  Label(kwArg: NamedArgument): Label;
  Switch(): Switch;
  Box: (kwArg: NamedArgument) => Box;
  Button: (kwArg: NamedArgument) => Button;
  CheckButton(arg0: NamedArgument): CheckButton;
  Orientation: {
    HORIZONTAL: PythonConvertible;
    VERTICAL: PythonConvertible;
  };
}

export interface StyleContext {
  add_provider_for_display(
    display: Display,
    provider: StyleProvider,
    proiority: number,
  ): unknown;
}

export interface StyleProvider {
  load_from_path(path: string): void;
}

export interface ApplicationConstructor {
  new (kwArg: NamedArgument): Application;
}
export interface Application extends Widget {
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
  set_titlebar: (header: HeaderBar) => void;
  present: () => void;
  close: () => void;
}

export interface Widget {
  set_css_classes(classes: string[]): void;
}

export interface Box extends Widget {
  append(child: Widget): void;
  set_spacing(spacing: number): void;
}

export interface HeaderBar extends Widget {
  pack_start(widget: Widget): void;
}

export interface Switch extends Widget {
  set_active(state: boolean): void;
  connect(event: "state-set", callback: Callback): void;
}

export interface Scale extends Widget {
  connect(signal: "value-changed", callback: Callback): void;
  set_value(value: number): void;
  set_draw_value(show: boolean): void;
  set_range(start: number, end: number): void;
  set_digits(digits: number): void;
  get_value(): number;
}

export interface Label extends Widget {
}

export interface Button extends Widget {
  set_icon_name(name: string): void;
  connect(event: "clicked", callback: Callback): void;
}

export interface CheckButton extends Widget {
  get_active(): boolean;
  set_group(group: CheckButton): void;
  connect: (signal: "toggled", callback: Callback) => void;
}
