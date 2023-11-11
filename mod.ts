import { python } from "./deps.ts";
import * as Gtk_ from "./gtk.ts";
import * as Adw_ from "./adw.ts";
import * as Gdk_ from "./gdk.ts";
import * as Gio_ from "./gio.ts";
import * as GLib_ from "./glib.ts";

const gi = python.import("gi");
gi.require_version("Gtk", "4.0");
gi.require_version("Adw", "1");

export * as Gtk_ from "./gtk.ts";
export * as Adw_ from "./adw.ts";
export * as Gdk_ from "./gdk.ts";
export * as Gio_ from "./gio.ts";
export * as GLib_ from "./glib.ts";

export const Gtk: Gtk_.Gtk = python.import("gi.repository.Gtk");
export const Adw: Adw_.Adw = python.import("gi.repository.Adw");
export const Gdk: Gdk_.Gdk = python.import("gi.repository.Gdk");
export const Gio: Gio_.Gio = python.import("gi.repository.Gio");
export const GLib: GLib_.GLib = python.import("gi.repository.GLib");
export { kw, NamedArgument, python } from "./deps.ts";
