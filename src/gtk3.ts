import type { Callback, NamedArgument } from "@denosaurs/python";

export interface Gtk {
  MenuItem(kwArg: NamedArgument): MenuItem;
  Menu(): Menu;
  main(): void;
  main_quit(): void;
}

export interface Widget {
  show(): void;
  connect(signal: string, callback: Callback): void;
}

export interface MenuShell extends Widget {
}

export interface Menu extends MenuShell {
  show_all(): void;
  get_children(): Widget[];
  prepend(item: MenuItem): void;
  append(item: MenuItem): void;
  remove(item: Widget): void;
}

export interface MenuItem extends Widget {
}
