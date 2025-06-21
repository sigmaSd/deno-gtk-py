import type { GLib2_ } from "../mod.ts";

export interface CustomEventLoopOptions {
  /**
   * Poll interval in milliseconds for checking GLib events.
   * Lower values provide better responsiveness but use more CPU.
   * @default 1
   */
  pollInterval?: number;
}

/**
 * Creates a custom event loop that integrates GLib's MainContext with Deno's event loop.
 *
 * By default, using `app.run()` blocks Deno's event loop because GLib's MainContext
 * takes control of the main thread. This custom event loop provides a workaround
 * by polling GLib events at regular intervals while allowing Deno's event loop
 * to continue running.
 *
 * Instead of using `app.run()`, use `app.register()` and `app.activate()` with this
 * custom event loop to maintain non-blocking behavior.
 *
 * @param GLib - The GLib module imported from gi.repository
 * @param options - Configuration options for the event loop
 * @returns An object with start() and stop() methods to control the event loop
 *
 * @example
 * ```ts
 * import { python, createCustomEventLoop } from "jsr:@sigma/gtk-py";
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
 * const eventLoop = createCustomEventLoop(GLib, { pollInterval: 1 });
 * eventLoop.start();
 *
 * // Your Deno code continues to work normally
 * setTimeout(() => {
 *   console.log("This will work!");
 * }, 1000);
 * ```
 */
export function createCustomEventLoop(
  GLib: GLib2_.GLib,
  options: CustomEventLoopOptions = {},
) {
  const { pollInterval = 1 } = options;

  let intervalId: number | null = null;
  let isRunning = false;

  const mainContext = GLib.MainContext.default();

  return {
    /**
     * Starts the custom event loop.
     * This will begin polling GLib events at the specified interval.
     */
    start() {
      if (isRunning) {
        return;
      }

      isRunning = true;
      intervalId = setInterval(() => {
        // Process all pending GLib events
        while (mainContext.pending().valueOf()) {
          mainContext.iteration(false);
        }
      }, pollInterval);
    },

    /**
     * Stops the custom event loop.
     * This will stop polling GLib events and clear the interval.
     */
    stop() {
      if (!isRunning || intervalId === null) {
        return;
      }

      clearInterval(intervalId);
      intervalId = null;
      isRunning = false;
    },

    /**
     * Returns whether the event loop is currently running.
     */
    get isRunning() {
      return isRunning;
    },

    /**
     * Returns the current poll interval in milliseconds.
     */
    get pollInterval() {
      return pollInterval;
    },
  };
}
