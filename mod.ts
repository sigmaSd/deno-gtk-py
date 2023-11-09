// deno-lint-ignore-file no-empty-interface
import type { NamedArgument } from "https://deno.land/x/python@0.4.1/mod.ts";
import type {
  Callback,
  PythonConvertible,
} from "https://deno.land/x/python@0.4.1/src/python.ts";

export interface GLib {
  set_application_name(name: string): void;
}

export interface Gio {
  Menu: Menu;
  SimpleAction: SimpleAction;
  ListStore: ListStore;
}

export interface Menu {
  new: () => Menu;
  append(arg0: string, arg1: string): unknown;
}
export interface SimpleAction {
  // deno-lint-ignore no-explicit-any
  new: (name: string, arg?: any) => SimpleAction;
  connect(signal: "activate", callback: Callback): void;
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
  AboutWindow(kwArg: NamedArgument): AboutWindow;
  Application: ApplicationConstructor;
  run: () => void;
}

export interface AboutWindow {
  set_visible(visible: boolean): void;
  set_developers(developers: string[]): void;
  set_copyright(copyright: string): void;
  set_translator_credits(credits: string): void;
  add_credit_section(arg0: string, arg1: string[]): void;
  set_issue_url(url: string): void;
  set_website(website: string): void;
  set_comments(comments: string): void;
  set_license_type(license: never): void;
  set_developer_name(name: string): void;
  set_version(version: string): void;
  set_application_name(name: string): void;
}

export interface Gtk {
  License: { GPL_3_0: never };
  FileFilter(): FileFilter;
  STYLE_PROVIDER_PRIORITY_APPLICATION: number;
  StyleContext: StyleContext;
  CssProvider(): StyleProvider;
  ApplicationWindow: ApplicationWindowConstructor;
  FileDialog: FileDialog;

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
  //FIXME: PythonConvertible should not be needed
  // it should be ApplicaitonWindow
  get_active_window: () => PythonConvertible;
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
  add_action(action: SimpleAction): void;
}

export interface Widget {
  set_css_classes(classes: string[]): void;
}

export interface Box extends Widget {
  append(child: Widget): void;
  set_spacing(spacing: number): void;
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
  set_menu_model(menu: Menu): void;
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
