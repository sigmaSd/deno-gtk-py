import {
  Adw1_ as Adw_,
  Gtk4_ as Gtk_,
  kw,
  NamedArgument,
  python,
} from "../../mod.ts";

const gi = python.import("gi");
gi.require_version("Gtk", "4.0");
gi.require_version("Adw", "1");
const Gtk: Gtk_.Gtk = python.import("gi.repository.Gtk");
const Adw: Adw_.Adw = python.import("gi.repository.Adw");

class MyApp extends Adw.Application {
  #win: Gtk_.ApplicationWindow | undefined;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.connect("activate", this.onActivate);
  }

  onActivate = python.callback((_kwarg, _app) => {
    const builder = Gtk.Builder();
    builder.add_from_file("./examples/builder/ui.xml");

    // Obtain the button widget and connect it to a function
    const button = builder.get_object<Gtk_.Button>("button1");
    button.connect("clicked", this.hello);

    // Obtain and show the main window
    this.#win = builder.get_object<Gtk_.ApplicationWindow>("main_window");
    this.#win.set_application(this); // Application will close once it no longer has active windows attached to it
    this.#win.present();
  });

  hello = python.callback((_kwarg, _button: Gtk_.Button) => {
    console.log("Hello");
  });
}

const app = new MyApp(kw`application_id=${"com.example.GtkApplicaiton"}`);
app.run(Deno.args);
