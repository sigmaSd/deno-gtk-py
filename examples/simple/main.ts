import {
  Adw1 as Adw,
  Gtk4 as Gtk,
  Gtk4_ as Gtk_,
  kw,
  NamedArgument,
  python,
} from "../../mod.ts";

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
