import { NamedArgument, python } from "https://deno.land/x/python@0.4.1/mod.ts";
import type { Adw, Button, Gtk } from "../mod.ts";

const gi = python.import("gi");
gi.require_version("Gtk", "4.0");
gi.require_version("Adw", "1");

const Gtk: Gtk = python.import("gi.repository.Gtk");
const Adw: Adw = python.import("gi.repository.Adw");

class MainWindow extends Gtk.ApplicationWindow {
  #box1;
  #button;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.#box1 = Gtk.Box(
      new NamedArgument("orientation", Gtk.Orientation.VERTICAL),
    );
    this.set_child(this.#box1);
    this.#button = Gtk.Button(new NamedArgument("label", "Hello"));
    this.#box1.append(this.#button);
    this.#button.connect("clicked", this.hello);
  }

  hello = python.callback((_kwargs, _button: Button): undefined => {
    console.log("hello");
  });
}

class MyApp extends Adw.Application {
  #win: MainWindow | undefined = undefined;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.connect("activate", this.onActivate);
  }

  onActivate = python.callback((_kwargs, app): undefined => {
    this.#win = new MainWindow(new NamedArgument("application", app));
    this.#win.present();
  });
}

const app = new MyApp(new NamedArgument("application_id", "com.example.com"));
app.run(Deno.args);
