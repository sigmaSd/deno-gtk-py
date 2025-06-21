# Custom Event Loop Example

This example demonstrates how to use the custom event loop utility to integrate GLib's MainContext with Deno's event loop without blocking.

## The Problem

By default, when you use `app.run()` with GTK applications, GLib's MainContext blocks Deno's event loop. This means:

- `setTimeout()` and `setInterval()` won't work
- `fetch()` and other async operations won't work
- Promise-based code won't execute properly
- Deno's event loop is completely blocked

## The Solution

The `createCustomEventLoop()` function provides a workaround by:

1. Using `app.register()` and `app.activate()` instead of `app.run()`
2. Polling GLib events at regular intervals using `setInterval()`
3. Processing pending GLib events with `MainContext.iteration()`
4. Allowing Deno's event loop to continue running normally

## Running the Example

```bash
deno run --allow-ffi --allow-env=DENO_PYTHON_PATH --allow-net --unstable-ffi main.ts
```

## What This Example Demonstrates

1. **GTK Application**: A simple window with a button and counter
2. **Deno Timers**: Console output every 2 seconds showing Deno's event loop is working
3. **Async Operations**: An HTTP request to GitHub's API after 5 seconds
4. **Graceful Shutdown**: Proper cleanup when pressing Ctrl+C

## Key Differences from Standard GTK Apps

### Instead of:
```ts
const app = new App(kw`application_id=${"com.example.app"}`);
app.run(Deno.args); // This blocks Deno's event loop
```

### Use:
```ts
const app = new App(kw`application_id=${"com.example.app"}`);
app.register();
app.activate();

const eventLoop = createCustomEventLoop(GLib, { pollInterval: 1 });
eventLoop.start();
```

## Configuration Options

- `pollInterval`: How often to check for GLib events (in milliseconds)
  - Lower values = better responsiveness, higher CPU usage
  - Higher values = lower CPU usage, potentially less responsive
  - Default: 1ms

## When to Use This

Use the custom event loop when your application needs:

- Deno's `setTimeout()` or `setInterval()`
- HTTP requests with `fetch()`
- File system operations
- WebSocket connections
- Any other async Deno APIs

For simple GTK applications that don't need Deno's event loop, you can always use Deno sync apis and the standard `app.run()` approach is simpler and more efficient.
