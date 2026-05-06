export function waitForAnimationFrameDelay(duration: number) {
  return new Promise<void>((resolve) => {
    if (duration <= 0) {
      resolve();
      return;
    }

    const start = performance.now();

    const step = (now: number) => {
      if (now - start >= duration) {
        resolve();
        return;
      }

      window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  });
}
