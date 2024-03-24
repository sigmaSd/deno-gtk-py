import {
  type Adw1_ as Adw_,
  type Gtk4_ as Gtk_,
  kw,
  NamedArgument,
  python,
} from "../../mod.ts";

const gi = python.import("gi");
gi.require_version("Gtk", "4.0");
gi.require_version("Adw", "1");
const Gtk: Gtk_.Gtk = python.import("gi.repository.Gtk");
const Adw: Adw_.Adw = python.import("gi.repository.Adw");

class MainWindow extends Gtk.ApplicationWindow {
  #button;
  #state = false;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.set_default_size(300, 150);
    this.set_title("Awaker");

    this.#button = Gtk.ToggleButton(
      new NamedArgument("label", "OFF"),
    );
    this.#button.connect("clicked", this.onClick);
    this.set_child(this.#button);
  }

  onClick = python.callback((_, button: Gtk_.ToggleButton) => {
    this.#state = !this.#state;
    (this.#state) ? button.set_label("ON") : button.set_label("OFF");
  });
}

class App extends Adw.Application {
  #win: MainWindow | undefined;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.connect("activate", this.onActivate);
  }
  onActivate = python.callback((_kwarg, app: Gtk_.Application) => {
    this.#win = new MainWindow(new NamedArgument("application", app));
    this.#win.present();
  });
}

const app = new App(kw`application_id=${"com.example.com"}`);
app.run(Deno.args);
