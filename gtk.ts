// deno-lint-ignore-file no-empty-interface
import type {
  Callback,
  NamedArgument,
  PythonConvertible,
} from "https://deno.land/x/python@0.4.1/mod.ts";
import * as Gdk from "./gdk.ts";
import * as Gio from "./gio.ts";
import * as Adw from "./adw.ts";

export interface Gtk {
  Builder(): Builder;
  GestureClick: GestureClick;
  DrawingArea(): DrawingArea;
  AboutDialog(): AboutDialog;
  MenuButton(): MenuButton;
  HeaderBar(): HeaderBar;
  Scale(): Scale;
  PopoverMenu(): PopoverMenu;
  Label(kwArg: NamedArgument): Label;
  Switch(): Switch;
  Box: (kwArg: NamedArgument) => Box;
  Button: (kwArg: NamedArgument) => Button;
  CheckButton(arg0: NamedArgument): CheckButton;
  Orientation: {
    HORIZONTAL: PythonConvertible;
    VERTICAL: PythonConvertible;
  };
  License: { GPL_3_0: never };
  FileFilter(): FileFilter;
  STYLE_PROVIDER_PRIORITY_APPLICATION: number;
  StyleContext: StyleContext;
  CssProvider(): CssProvider;
  ApplicationWindow: ApplicationWindowConstructor;
  FileDialog: FileDialog;
}

export interface FileFilter {
  set_name(name: string): void;
  add_mime_type(type: "image/jpeg" | "image/png" | string): void;
}

export interface StyleContext {
  add_provider_for_display(
    display: Gdk.Display,
    provider: CssProvider,
    proiority: number,
  ): unknown;
}

export interface CssProvider {
  load_from_path(path: string): void;
}
export interface ApplicationWindowConstructor {
  new (kwArg: NamedArgument): ApplicationWindow;
}
export interface ApplicationWindow {
  set_application(app: Adw.Application): void;
  set_child: (widget: Widget) => void;
  set_default_size: (width: number, height: number) => void;
  set_title: (name: string) => void;
  set_titlebar: (header: HeaderBar) => void;
  present: () => void;
  close: () => void;
  add_action(action: Gio.SimpleAction): void;
}

export interface Widget {
  set_css_classes(classes: string[]): void;
}
export interface FileDialog extends Widget {
  set_default_filter(f: FileFilter): void;
  set_filters(filters: Gio.ListStore): void;
  // deno-lint-ignore no-explicit-any
  open_finish(result: any): Gio.File;
  open(
    window: ApplicationWindow,
    // deno-lint-ignore no-explicit-any
    cancellable: any,
    callback: Callback,
  ): void;
  new: () => FileDialog;
  set_title(title: string): void;
}
export interface Builder {
  get_object<T>(object: string): T;
  add_from_file(file: string): void;
}
export interface GestureClick {
  connect(arg0: string, dw_click: Callback): void;
  new: () => GestureClick;
}
export interface AboutDialog extends Widget {
  set_visible(visible: boolean): void;
  set_logo_icon_name(name: string): void;
  set_version(version: string): void;
  set_website_label(label: string): void;
  set_website(site: string): void;
  set_license_type(license: never): void;
  set_copyright(copyright: string): void;
  set_authors(authors: string[]): void;
  set_modal(modal: ApplicationWindow): void;
  set_transient_for(window: ApplicationWindow): void;
}
export interface Box extends Widget {
  set_margin_end(margin: number): void;
  set_margin_start(margin: number): void;
  set_margin_bottom(margin: number): void;
  set_margin_top(margin: number): void;
  append(child: Widget): void;
  set_spacing(spacing: number): void;
}

export interface MenuButton extends Widget {
  set_popover(menu: PopoverMenu): void;
  set_icon_name(name: string): void;
}

export interface HeaderBar extends Widget {
  pack_start(widget: Widget): void;
}

export interface Switch extends Widget {
  set_active(state: boolean): void;
  connect(event: "state-set", callback: Callback): void;
}

export interface PopoverMenu extends Widget {
  set_menu_model(menu: Gio.Menu): void;
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
export interface DrawingArea extends Widget {
  queue_draw(): void;
  add_controller(evk: GestureClick): void;
  set_draw_func(callback: Callback): void;
  set_vexpand(arg0: boolean): void;
  set_hexpand(arg0: boolean): void;
}
