import type { Gio2_, GLib2_ } from "../mod.ts";

export interface DenoGLibEventLoopOptions {
  /**
   * Maximum sleep interval in milliseconds when no events are pending.
   * When events are actively being processed, the loop will check again
   * immediately using microtasks for sub-millisecond latency.
   * @default 16
   */
  pollInterval?: number;
}

/**
 * Event loop that integrates GLib's MainContext with Deno's event loop.
 *
 * By default, using `app.run()` blocks Deno's event loop because GLib's MainContext
 * takes control of the main thread. This event loop provides a workaround by
 * intelligently processing GLib events: using microtasks for immediate response
 * when events are flowing, and sleeping to conserve CPU when idle.
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
 * const eventLoop = new DenoGLibEventLoop(GLib, { pollInterval: 16 });
 * await eventLoop.start();
 *
 * // Your Deno code continues to work normally
 * setTimeout(() => {
 *   console.log("This will work!");
 * }, 1000);
 * ```
 */
export class DenoGLibEventLoop {
  private _isRunning = false;
  private readonly mainContext: GLib2_.MainContext;
  private readonly _pollInterval: number;
  #app?: Gio2_.Application;

  constructor(GLib: GLib2_.GLib, options: DenoGLibEventLoopOptions = {}) {
    this._pollInterval = options.pollInterval ?? 16;
    this.mainContext = GLib.MainContext.default();
  }

  /**
   * Starts the Deno-GLib event loop.
   * Uses a hybrid approach: sub-millisecond latency when events are active,
   * and sleeps when idle to conserve CPU.
   */
  async start(app?: Gio2_.Application): Promise<void> {
    if (this._isRunning) {
      return;
    }
    this.#app = app;
    this.#app?.register();
    this.#app?.activate();

    this._isRunning = true;

    // Hybrid event loop: fast when busy, efficient when idle
    while (this._isRunning) {
      // Check if there are pending events before processing
      const hadEvents = this.mainContext.pending().valueOf();

      // Process all currently pending events
      while (this.mainContext.pending().valueOf()) {
        this.mainContext.iteration(false);
      }

      // Adapt sleep strategy based on event activity
      if (hadEvents) {
        // Events were processed - check again immediately with minimal delay
        // This gives sub-millisecond response time during active periods
        await new Promise((resolve) =>
          queueMicrotask(() => resolve(undefined))
        );
      } else {
        // No events - sleep for the full interval to save CPU
        await new Promise((resolve) => setTimeout(resolve, this._pollInterval));
      }
    }
  }

  /**
   * Stops the Deno-GLib event loop.
   * This will stop processing GLib events and exit the event loop.
   */
  stop(): void {
    if (!this._isRunning) {
      return;
    }
    this.#app?.quit();
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
