# Deno Gtk Py

Wrapper + types over Gtk using deno-python

## Usage

```ts
import {
  Adw1_ as Adw_,
  Gtk4_ as Gtk_,
  kw,
  NamedArgument,
  python,
} from "https://raw.githubusercontent.com/sigmaSd/0.4.0/mod.ts";

const gi = python.import("gi");
gi.require_version("Gtk", "4.0");
gi.require_version("Adw", "1");
const Gtk: Gtk_.Gtk = python.import("gi.repository.Gtk");
const Adw: Adw_.Adw = python.import("gi.repository.Adw");

class MainWindow extends Gtk.ApplicationWindow {
  #button;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.set_title("Demo");
    this.#button = Gtk.Button(kw`label=${"Click Me"}`);
    this.#button.connect(
      "clicked",
      python.callback(() => {
        Adw.MessageDialog(
          //@ts-ignore it is a window
          new NamedArgument("transient_for", this),
          new NamedArgument("heading", "Deno GTK PY"),
          new NamedArgument(
            "body",
            "Hello World",
          ),
        ).present();
      }),
    );
    this.set_child(this.#button);
  }
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
```

Check out the examples directory

![image](https://github.com/sigmaSd/deno-gtk-py/assets/22427111/8e1a9e3b-624f-4990-8402-fdc7e87ae514)

## Tips

- Gtk have its own loop, somethings that you expect to work might not do to
  this, for example `setTimeout` wont work in a python.callback after running
  Gtk.Applicaiton. The solution is to use the primitives that GLib provides, for
  example instead of `setTimeout`, use `GLib.add_timeout`
- For running async subprocess checkout `Gio.Subprocess`

## Random apps made with it

- https://github.com/sigmaSd/Stimulator
- https://github.com/sigmaSd/chrono

## References
  - python gtk4 docs: http://lazka.github.io/pgi-docs/
  - gtk4 docs: https://docs.gtk.org/gtk4/
