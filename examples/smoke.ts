import {
  kw,
  NamedArgument,
  python,
} from "https://deno.land/x/python@0.4.1/mod.ts";
import type { Adw, Button, Gdk, Gtk, Scale, Switch } from "../mod.ts";

const gi = python.import("gi");
gi.require_version("Gtk", "4.0");
gi.require_version("Adw", "1");

const Gtk: Gtk = python.import("gi.repository.Gtk");
const Adw: Adw = python.import("gi.repository.Adw");
const Gdk: Gdk = python.import("gi.repository.Gdk");

const css_provider = Gtk.CssProvider();
css_provider.load_from_path("./examples/style.css");
Gtk.StyleContext.add_provider_for_display(
  Gdk.Display.get_default(),
  css_provider,
  Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION,
);

class MainWindow extends Gtk.ApplicationWindow {
  #box1;
  #button;
  #box2;
  #box3;
  #check;
  #switch_box;
  #switch;
  #label;
  #slider;
  #header;
  #open_button;
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

    // Extra Tip: Radio Buttons
    // const radio1 = Gtk.CheckButton(kw`label = ${"test"}`);
    // const radio2 = Gtk.CheckButton(kw`label = ${"test"}`);
    // const radio3 = Gtk.CheckButton(kw`label = ${"test"}`);
    // radio2.set_group(radio1);
    // radio3.set_group(radio1);
    // radio1.connect("toggled", this.radio_toggled);
    // // you can pass extra arguments like so
    // // radio1.connect("toggled", self.radio_toggled, "test")
    // this.#box2.append(radio1);
    // this.#box2.append(radio2);
    // this.#box2.append(radio3);

    this.#switch_box = Gtk.Box(
      new NamedArgument("orientation", Gtk.Orientation.HORIZONTAL),
    );

    this.#switch = Gtk.Switch();
    this.#switch.set_active(true);
    this.#switch.connect("state-set", this.switch_switched);

    this.#switch_box.append(this.#switch);
    this.#box2.append(this.#switch_box);

    this.#label = Gtk.Label(kw`label=${"A switch"}`);
    this.#switch_box.append(this.#label);
    this.#switch_box.set_spacing(5);

    this.#label.set_css_classes(["title"]);

    this.#slider = Gtk.Scale();
    this.#slider.set_digits(0); // Number of decimal places to use
    this.#slider.set_range(0, 10);
    this.#slider.set_draw_value(true); // Show a label with current value
    this.#slider.set_value(5); // Sets the current value/position
    this.#slider.connect("value-changed", this.slider_changed);
    this.#box2.append(this.#slider);

    this.#header = Gtk.HeaderBar();
    this.set_titlebar(this.#header);

    this.#open_button = Gtk.Button(kw`label=${"Open"}`);
    this.#header.pack_start(this.#open_button);
    this.#open_button.set_icon_name("document-open-symbolic");
  }

  slider_changed = python.callback(
    (_kwargs, slider: Scale): undefined => {
      console.log(slider.get_value());
      //FIXME typeof slider.get_value() is not a number
      //FIXME changing the slider many times creates an error:
      //TypeError: 'builtin_function_or_method' object does not support vectorcall
    },
  );

  switch_switched = python.callback(
    (_kwargs, _switch: Switch, state): undefined => {
      console.log(`The switch has been switched ${state ? "on" : "off"}`);
    },
  );

  // radio_toggled = python.callback((_kwargs): undefined => {
  //   console.log("toggle!");
  // });

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
