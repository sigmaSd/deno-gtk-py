// port of https://github.com/Taiko2k/GTK4PythonTutorial

import {
  Adw1 as Adw,
  Gdk4 as Gdk,
  Gio2 as Gio,
  Gio2_ as Gio_,
  GLib2 as GLib,
  Gtk4 as Gtk,
  Gtk4_ as Gtk_,
  kw,
  NamedArgument,
  python,
} from "../../mod.ts";

const css_provider = Gtk.CssProvider();
css_provider.load_from_path(
  new URL(import.meta.resolve("./style.css")).pathname,
);
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
  #dw;
  // deno-lint-ignore no-explicit-any
  #blobs: any[][];
  // #about: Gtk_.AboutDialog | undefined;
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

    {
      // Create a new "Action"
      const action = Gio.SimpleAction.new("something", undefined);
      action.connect("activate", this.print_something);
      this.add_action(action); // Here the action is being added to the window, but you could add it to the
      // application or an "ActionGroup"
    }

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

    // Set app name
    GLib.set_application_name("My App");

    {
      // Create an action to run a *show about dialog* function we will create
      const action = Gio.SimpleAction.new("about");
      action.connect("activate", this.show_about);
      this.add_action(action);
    }

    menu.append("About", "win.about"); // Add it to the menu we created in previous section

    this.#dw = Gtk.DrawingArea();

    // Make it fill the available space (It will stretch with the window)
    this.#dw.set_hexpand(true);
    this.#dw.set_vexpand(true);

    // Instead, If we didn't want it to fill the available space but wanted a fixed size
    //this.#dw.set_content_width(100)
    //this.#dw.set_content_height(100)

    this.#dw.set_draw_func(this.draw);
    this.#box3.append(this.#dw);

    //FIXME clicking many times segfaults or errors with
    // TypeError: 'builtin_function_or_method' object does not support vectorcall
    const evk = Gtk.GestureClick.new();
    evk.connect("pressed", this.dw_click); // could be "released"
    this.#dw.add_controller(evk);

    this.#blobs = [];

    this.#box2.set_spacing(10);
    this.#box2.set_margin_top(10);
    this.#box2.set_margin_bottom(10);
    this.#box2.set_margin_start(10);
    this.#box2.set_margin_end(10);
  }

  draw = python.callback(
    (_kwargs, _area: Gtk_.DrawingArea, c, w, h, _data) => {
      // c is a Cairo context

      // Fill background with a colour
      c.set_source_rgb(0, 0, 0);
      c.paint();

      c.set_source_rgb(1, 0, 1);
      for (const [x, y] of this.#blobs) {
        c.arc(x, y, 10, 0, 2 * 3.1415926);
        c.fill();
      }

      // Draw a line
      c.set_source_rgb(0.5, 0.0, 0.5);
      c.set_line_width(3);
      c.move_to(10, 10);
      c.line_to(w - 10, h - 10);
      c.stroke();

      // Draw a rectangle
      c.set_source_rgb(0.8, 0.8, 0.0);
      c.rectangle(20, 20, 50, 20);
      c.fill();

      // Draw some text
      c.set_source_rgb(0.1, 0.1, 0.1);
      c.select_font_face("Sans");
      c.set_font_size(13);
      c.move_to(25, 35);
      c.show_text("Test");
    },
  );

  dw_click = python.callback(
    (_kwargs, _gesture: Gtk_.GestureClick, _data, x, y) => {
      this.#blobs.push([x, y]);
      this.#dw.queue_draw(); // Force a redraw
    },
  );

  show_about = python.callback(
    (_kwargs, _action: Gio_.SimpleAction, _param) => {
      // this.#about = Gtk.AboutDialog();
      // this.#about.set_transient_for(this); // Makes the dialog always appear in from of the parent window
      // this.#about.set_modal(this); // Makes the parent window unresponsive while dialog is showing

      // this.#about.set_authors(["Your Name"]);
      // this.#about.set_copyright("Copyright 2022 Your Full Name");
      // this.#about.set_license_type(Gtk.License.GPL_3_0);
      // this.#about.set_website("http://example.com");
      // this.#about.set_website_label("My Website");
      // this.#about.set_version("1.0");
      // this.#about.set_logo_icon_name("org.example.example"); // The icon will need to be added to appropriate location
      // // E.g. /usr/share/icons/hicolor/scalable/apps/org.example.example.svg

      // this.#about.set_visible(true);

      const dialog = Adw.AboutWindow(
        new NamedArgument("transient_for", app.get_active_window()),
      );
      dialog.set_application_name("App name");
      dialog.set_version("1.0");
      dialog.set_developer_name("Developer");
      //@ts-ignore: FIXME: License is used as a function *and* as a type
      dialog.set_license_type(Gtk.License(Gtk.License.GPL_3_0));
      dialog.set_comments("Adw about Window example");
      dialog.set_website("https://github.com/Tailko2k/GTK4PythonTutorial");
      dialog.set_issue_url(
        "https://github.com/Tailko2k/GTK4PythonTutorial/issues",
      );
      dialog.add_credit_section("Contributors", ["Name1 url"]);
      dialog.set_translator_credits("Name1 url");
      dialog.set_copyright("© 2022 developer");
      dialog.set_developers(["Developer"]);
      dialog.set_application_name("com.github.devname.appname"); // icon must be uploaded in ~/.local/share/icons or /usr/share/icons

      dialog.set_visible(true);
    },
  );

  print_something = python.callback(
    (_kwargs, _action: Gio_.SimpleAction, _param) => {
      console.log("Something!");
    },
  );

  show_open_dialog = python.callback(
    (_kwargs, _button: Gtk_.Button) => {
      this.#open_dialog.open(this, undefined, this.open_dialog_open_callback);
    },
  );

  open_dialog_open_callback = python.callback(
    (_kwargs, dialog: Gtk_.FileDialog, result) => {
      try {
        const file = dialog.open_finish(result);
        if (file !== undefined) {
          console.log(`File path is ${file.get_path().valueOf()}`);
        }
      } catch (error) {
        if ("message" in error) {
          console.error(`Error opening file: ${error.message}`);
        }
      }
    },
  );

  slider_changed = python.callback(
    (_kwargs, slider: Gtk_.Scale) => {
      console.log(slider.get_value().valueOf());
      //FIXME changing the slider many times creates an error:
      //TypeError: 'builtin_function_or_method' object does not support vectorcall
    },
  );

  switch_switched = python.callback(
    (_kwargs, _switch: Gtk_.Switch, state) => {
      console.log(`The switch has been switched ${state ? "on" : "off"}`);
    },
  );

  // radio_toggled = python.callback((_kwargs) => {
  //   console.log("toggle!");
  // });

  hello = python.callback((_kwargs, _button: Gtk_.Button) => {
    if (this.#check.get_active().valueOf()) {
      console.log("Goodbye world!");
      this.close();
    } else {
      console.log("Hello world!");
    }
  });
}

class MyApp extends Adw.Application {
  #win: MainWindow | undefined = undefined;
  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.connect("activate", this.onActivate);
  }

  onActivate = python.callback((_kwargs, app) => {
    this.#win = new MainWindow(new NamedArgument("application", app));
    this.#win.present();
  });
}

const app = new MyApp(new NamedArgument("application_id", "com.example.com"));

const signal = python.import("signal");
GLib.unix_signal_add(
  GLib.PRIORITY_HIGH,
  signal.SIGINT,
  python.callback(() => {
    app.quit();
  }),
);

app.run(Deno.args);
