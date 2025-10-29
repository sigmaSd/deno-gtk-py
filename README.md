# JS Gtk Py

Wrapper + types over Gtk using javascript python bindings

## Usage

```ts
#!/usr/bin/env -S JS -A
import {
  type Adw1_ as Adw_,
  type GLib2_ as GLib_,
  type Gtk4_ as Gtk_,
  JSGLibEventLoop,
  kw,
  NamedArgument,
  python,
} from "jsr:@sigma/gtk-py";

const gi = python.import("gi");
gi.require_version("Gtk", "4.0");
gi.require_version("Adw", "1");
const Gtk: Gtk_.Gtk = python.import("gi.repository.Gtk");
const Adw: Adw_.Adw = python.import("gi.repository.Adw");
const GLib: GLib_.GLib = python.import("gi.repository.GLib");
// Use JSGLibEventLoop to keep JS's event loop running
// This allows setTimeout, fetch, and other JS APIs to work normally
const eventLoop = new JSGLibEventLoop(GLib);

class MainWindow extends Gtk.ApplicationWindow {
  #button;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.set_title("Demo");
    this.connect("close-request", () => {
      eventLoop.stop();
    });
    this.#button = Gtk.Button(kw`label=${"Click Me"}`);
    this.#button.connect(
      "clicked",
      python.callback(() => {
        const dialog = Adw.MessageDialog(
          new NamedArgument("transient_for", this),
          new NamedArgument("heading", "JS GTK PY"),
          new NamedArgument("body", "Hello World"),
        );
        dialog.present();
        setTimeout(() => {
          dialog.close();
        }, 1000);
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

await eventLoop.start(app);
```

Check out the examples directory

![image](https://github.com/sigmaSd/0.6.3/22427111/cd8a4a23-4ef2-4185-b57a-94de1494cbdb)

## Tips

- The `JSGLibEventLoop` is the recommended way to run GTK apps. It integrates
  GLib's event loop with Javascript, allowing `setTimeout`, `fetch`, and other
  APIs to work normally alongside your GTK UI.
- **Alternative**: Use `app.run()` for the traditional blocking GTK event loop.
  Note that javascript APIs like `setTimeout` won't work in this mode. You'll
  need to use GLib primitives like `GLib.timeout_add` instead.
- For running async subprocesses, check out `Gio.Subprocess`

## Random apps made with it

- https://github.com/sigmaSd/Stimulator
- https://github.com/sigmaSd/chrono

## References

- python gtk4 docs: http://lazka.github.io/pgi-docs/
- gtk4 docs: https://docs.gtk.org/gtk4/
