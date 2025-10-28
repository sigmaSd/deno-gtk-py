import type { Gio2_, GLib2_ } from "../mod.ts";

export interface DenoGLibEventLoopOptions {
  /**
   * Poll interval in milliseconds for checking GLib events.
   * Lower values provide better responsiveness but use more CPU.
   * @default 1
   */
  pollInterval?: number;
}

/**
 * Event loop that integrates GLib's MainContext with Deno's event loop.
 *
 * By default, using `app.run()` blocks Deno's event loop because GLib's MainContext
 * takes control of the main thread. This event loop provides a workaround
 * by polling GLib events at regular intervals while allowing Deno's event loop
 * to continue running.
 *
 * Instead of using `app.run()`, use `app.register()` and `app.activate()` with this
 * event loop to maintain non-blocking behavior.
 *
 * @example
 * ```ts
 * import { python, DenoGLibEventLoop } from "jsr:@sigma/gtk-py";
 *
 * const gi = python.import("gi");
 * gi.require_version("Gtk", "4.0");
 * const GLib = python.import("gi.repository.GLib");
 * const Gtk = python.import("gi.repository.Gtk");
 *
 * const app = new Gtk.Application({ application_id: "com.example.App" });
 *
 * // Instead of app.run(Deno.args), use:
 * app.register();
 * app.activate();
 *
 * const eventLoop = new DenoGLibEventLoop(GLib, { pollInterval: 1 });
 * eventLoop.start();
 *
 * // Your Deno code continues to work normally
 * setTimeout(() => {
 *   console.log("This will work!");
 * }, 1000);
 * ```
 */
export class DenoGLibEventLoop {
  private intervalId: number | null = null;
  private _isRunning = false;
  private readonly mainContext: GLib2_.MainContext;
  private readonly _pollInterval: number;
  #app?: Gio2_.Application;

  constructor(GLib: GLib2_.GLib, options: DenoGLibEventLoopOptions = {}) {
    this._pollInterval = options.pollInterval ?? 1;
    this.mainContext = GLib.MainContext.default();
  }

  /**
   * Starts the Deno-GLib event loop.
   * This will begin polling GLib events at the specified interval.
   */
  start(app?: Gio2_.Application): void {
    if (this._isRunning) {
      return;
    }
    this.#app = app;
    this.#app?.register();
    this.#app?.activate();

    this._isRunning = true;
    this.intervalId = setInterval(() => {
      // Process all pending GLib events
      while (this.mainContext.pending().valueOf()) {
        this.mainContext.iteration(false);
      }
    }, this._pollInterval);
  }

  /**
   * Stops the Deno-GLib event loop.
   * This will stop polling GLib events and clear the interval.
   */
  stop(): void {
    if (!this._isRunning || this.intervalId === null) {
      return;
    }
    this.#app?.quit();

    clearInterval(this.intervalId);
    this.intervalId = null;
    this._isRunning = false;
  }

  /**
   * Returns whether the event loop is currently running.
   */
  get isRunning(): boolean {
    return this._isRunning;
  }

  /**
   * Returns the current poll interval in milliseconds.
   */
  get pollInterval(): number {
    return this._pollInterval;
  }
}
