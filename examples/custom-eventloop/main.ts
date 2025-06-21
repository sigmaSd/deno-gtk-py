#!/usr/bin/env -S deno run --allow-ffi --allow-env=DENO_PYTHON_PATH --unstable-ffi

import {
  type Adw1_ as Adw_,
  DenoGLibEventLoop,
  type GLib2_ as GLib_,
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
const GLib: GLib_.GLib = python.import("gi.repository.GLib");

class MainWindow extends Gtk.ApplicationWindow {
  #button;
  #counter = 0;

  constructor(kwArg: NamedArgument) {
    super(kwArg);
    this.set_default_size(400, 200);
    this.set_title("Custom Event Loop Demo");

    // Create a vertical box to hold our widgets
    const box = Gtk.Box(
      new NamedArgument("orientation", Gtk.Orientation.VERTICAL),
    );
    box.set_spacing(10);

    // Create a label to show the counter
    const label = Gtk.Label(kw`label=${"Counter: 0"}`);

    // Create a button
    this.#button = Gtk.Button(kw`label=${"Click me!"}`);
    this.#button.connect(
      "clicked",
      python.callback(() => {
        this.#counter++;
        label.set_text(`Counter: ${this.#counter}`);
      }),
    );

    // Add widgets to the box
    box.append(label);
    box.append(this.#button);

    this.set_child(box);
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

const app = new App(kw`application_id=${"com.example.custom-eventloop"}`);

// Instead of using app.run(Deno.args) which blocks Deno's event loop,
// we use app.register() + app.activate() with a custom event loop
app.register();
app.activate();

// Create and start the Deno-GLib event loop
const eventLoop = new DenoGLibEventLoop(GLib, { pollInterval: 1 });
eventLoop.start();

// Now Deno's event loop is not blocked, so we can use setTimeout, setInterval, etc.
console.log("Application started with Deno-GLib event loop integration");

// Demonstrate that Deno's event loop is working
let denoCounter = 0;
const denoInterval = setInterval(() => {
  denoCounter++;
  console.log(`Deno timer tick: ${denoCounter}`);

  // Stop after 20 ticks to demonstrate cleanup
  if (denoCounter >= 20) {
    clearInterval(denoInterval);
    console.log("Deno interval stopped");
  }
}, 2000);

// Demonstrate async/await works too
async function asyncDemo() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Async operation completed after 5 seconds!");

  // You can also make HTTP requests, file operations, etc.
  try {
    const response = await fetch("https://api.github.com/zen");
    const zen = await response.text();
    console.log(`GitHub Zen: ${zen}`);
  } catch (error) {
    console.log(
      "Failed to fetch GitHub Zen:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

asyncDemo();

// Handle process termination gracefully
Deno.addSignalListener("SIGINT", () => {
  console.log("\nReceived SIGINT, shutting down gracefully...");
  eventLoop.stop();
  Deno.exit(0);
});

console.log("Try clicking the button in the GTK window!");
console.log(
  "Notice how both GTK events and Deno timers work simultaneously with Deno-GLib integration.",
);
console.log("Press Ctrl+C to exit gracefully.");
