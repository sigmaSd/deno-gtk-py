# Deno Gtk Py

Wrapper + types over Gtk using deno-python

## Usage

```ts
// should replace the commit with latest commmit
import {
  Adw,
  Gtk,
  Gtk_,
  kw,
  NamedArgument,
  python,
} from "https://raw.githubusercontent.com/sigmaSd/deno-gtk-py/13f3da6c4890d62e09312747c905fa85263f5ca8/mod.ts";

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
  onActivate = python.callback((_kwarg, app: Gtk_.Application): undefined => {
    this.#win = new MainWindow(new NamedArgument("application", app));
    this.#win.present();
  });
}

const app = new App(kw`application_id=${"com.example.com"}`);
app.run(Deno.args);
```

Check out the examples directory

![image](https://github.com/sigmaSd/deno-gtk-py/assets/22427111/8e1a9e3b-624f-4990-8402-fdc7e87ae514)

## Random apps made with it
- https://github.com/sigmaSd/gnome-nosleep
