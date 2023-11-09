import {
  kw,
  NamedArgument,
  python,
} from "https://deno.land/x/python@0.4.1/mod.ts";
import type {
  Adw,
  Button,
  FileDialog,
  Gdk,
  Gio,
  Gtk,
  Scale,
  SimpleAction,
  Switch,
} from "../mod.ts";

const gi = python.import("gi");
gi.require_version("Gtk", "4.0");
gi.require_version("Adw", "1");

const Gtk: Gtk = python.import("gi.repository.Gtk");
const Adw: Adw = python.import("gi.repository.Adw");
const Gdk: Gdk = python.import("gi.repository.Gdk");
const Gio: Gio = python.import("gi.repository.Gio");

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
  #open_dialog;
  #popover;
  #hamburger;
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
    this.#open_button.connect("clicked", this.show_open_dialog);

    this.#open_dialog = Gtk.FileDialog.new();
    this.#open_dialog.set_title("Select a File");

    const f = Gtk.FileFilter();
    f.set_name("Image files");
    f.add_mime_type("image/jpeg");
    f.add_mime_type("image/png");

    const filters = Gio.ListStore.new(Gtk.FileFilter); // Create a ListStore with the type Gtk.FileFilter
    filters.append(f); // Add the file filter to the ListStore. You could add more.

    this.#open_dialog.set_filters(filters); // Set the filters for the open dialog
    this.#open_dialog.set_default_filter(f);

    // Create a new "Action"
    const action = Gio.SimpleAction.new("something", undefined);
    action.connect("activate", this.print_something);
    this.add_action(action); // Here the action is being added to the window, but you could add it to the
    // application or an "ActionGroup"

    // Create a new menu, containing that action
    const menu = Gio.Menu.new();
    menu.append("Do Something", "win.something"); // Or you would do app.something if you had attached the
    // action to the application

    // Create a popover
    this.#popover = Gtk.PopoverMenu(); // Create a new popover menu
    this.#popover.set_menu_model(menu);

    // Create a menu button
    this.#hamburger = Gtk.MenuButton();
    this.#hamburger.set_popover(this.#popover);
    this.#hamburger.set_icon_name("open-menu-symbolic"); // Give it a nice icon

    // Add menu button to the header bar
    this.#header.pack_start(this.#hamburger);
  }

  print_something = python.callback(
    (_kwargs, _action: SimpleAction, _param): undefined => {
      console.log("Something!");
    },
  );

  show_open_dialog = python.callback(
    (_kwargs, _button: Button): undefined => {
      this.#open_dialog.open(this, undefined, this.open_dialog_open_callback);
    },
  );

  open_dialog_open_callback = python.callback(
    (_kwargs, dialog: FileDialog, result): undefined => {
      try {
        const file = dialog.open_finish(result);
        if (file !== undefined) {
          console.log(`File path is ${file.get_path()}`);
        }
      } catch (error) {
        if ("message" in error) {
          console.error(`Error opening file: ${error.message}`);
        }
      }
    },
  );

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
