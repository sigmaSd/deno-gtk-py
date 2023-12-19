# Deno Gtk Py

Wrapper + types over Gtk using deno-python

## Usage

```ts
import {
  Adw,
  Gtk,
  Gtk_,
  kw,
  NamedArgument,
  python,
} from "https://raw.githubusercontent.com/sigmaSd/deno-gtk-py/0.1.2/mod.ts";

class MainWindow extends Gtk.ApplicationWindow {
  #label;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.#label = Gtk.Label(kw`label=${"Gtk 4"}`);
    this.set_child(this.#label);
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

- https://github.com/sigmaSd/gnome-nosleep
- https://github.com/sigmaSd/chrono

### TODO

- More types, reference http://lazka.github.io/pgi-docs/
  https://docs.gtk.org/gtk4/
