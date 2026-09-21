// One clock for every relative time on the page: it ticks once a minute, only while something is
// showing a time, and catches up when the tab comes back from the background
const listeners = new Set<() => void>();
let now = Date.now();
let interval: ReturnType<typeof setInterval> | undefined;

const tick = () => {
  now = Date.now();
  listeners.forEach((listener) => listener());
};

const onVisibilityChange = () => {
  if (document.visibilityState === "visible") tick();
};

export const minuteClock = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);

    if (listeners.size === 1) {
      now = Date.now();
      interval = setInterval(tick, 60_000);
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    return () => {
      listeners.delete(listener);

      if (!listeners.size) {
        clearInterval(interval);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
    };
  },
  getSnapshot: () => now,
  // Each render on the server reads its own clock
  getServerSnapshot: () => Date.now(),
};
