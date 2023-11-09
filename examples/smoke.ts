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
  #box2;
  #box3;
  #check;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.set_default_size(600, 250);
    this.set_title("MyApp");

    this.#box1 = Gtk.Box(
      new NamedArgument("orientation", Gtk.Orientation.HORIZONTAL),
    );
    this.#box2 = Gtk.Box(
      new NamedArgument("orientation", Gtk.Orientation.VERTICAL),
    );
    this.#box3 = Gtk.Box(
      new NamedArgument("orientation", Gtk.Orientation.VERTICAL),
    );

    this.#button = Gtk.Button(new NamedArgument("label", "Hello"));
    this.#button.connect("clicked", this.hello);

    this.set_child(this.#box1);
    this.#box1.append(this.#box2);
    this.#box1.append(this.#box3);

    this.#box2.append(this.#button);

    this.#check = Gtk.CheckButton(new NamedArgument("label", "And goodbye?"));
    this.#box2.append(this.#check);
  }

  hello = python.callback((_kwargs, _button: Button): undefined => {
    console.log("hello");
    // FIXME: the obvious way didn't work
    // deno-python have asBoolean but I can't acces it
    if (this.#check.get_active().toString() === "True") {
      console.log("Goodbye world!");
      this.close();
    }
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
