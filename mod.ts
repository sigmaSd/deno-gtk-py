// deno-lint-ignore-file no-empty-interface
import type { NamedArgument } from "https://deno.land/x/python@0.4.1/mod.ts";
import type {
  Callback,
  PythonConvertible,
} from "https://deno.land/x/python@0.4.1/src/python.ts";

export interface Gio {
  ListStore: ListStore;
}

export interface ListStore {
  //FIXME: Gio.ListStore.new(Gtk.FileFilter)
  // takes a type instead of a value
  // deno-lint-ignore no-explicit-any
  new: (filter: any) => ListStore;
  append(f: FileFilter): void;
}

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
  FileFilter(): FileFilter;
  STYLE_PROVIDER_PRIORITY_APPLICATION: number;
  StyleContext: StyleContext;
  CssProvider(): StyleProvider;
  ApplicationWindow: ApplicationWindowConstructor;
  FileDialog: FileDialog;
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

export interface FileDialog extends Widget {
  set_default_filter(f: FileFilter): void;
  set_filters(filters: ListStore): void;
  // deno-lint-ignore no-explicit-any
  open_finish(result: any): GFile;
  open(
    window: ApplicationWindow,
    // deno-lint-ignore no-explicit-any
    cancellable: any,
    callback: Callback,
  ): void;
  new: () => FileDialog;
  set_title(title: string): void;
}

export interface GFile {
  get_path(): string;
}

export interface FileFilter {
  set_name(name: string): void;
  add_mime_type(type: "image/jpeg" | "image/png" | string): void;
}

export interface CheckButton extends Widget {
  get_active(): boolean;
  set_group(group: CheckButton): void;
  connect: (signal: "toggled", callback: Callback) => void;
}
