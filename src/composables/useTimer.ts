import { computed, onBeforeUnmount, ref } from 'vue';

export function useTimer(onExpire: () => void) {
  const secondsLeft = ref(0);
  const isRunning = ref(false);
  let intervalId: number | null = null;

  function stop() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }

    isRunning.value = false;
  }

  function tick() {
    if (secondsLeft.value <= 0) {
      stop();
      onExpire();
      return;
    }

    secondsLeft.value -= 1;

    if (secondsLeft.value <= 0) {
      stop();
      onExpire();
    }
  }

  function start() {
    if (isRunning.value || secondsLeft.value <= 0) {
      return;
    }

    isRunning.value = true;
    intervalId = window.setInterval(tick, 1000);
  }

  function reset(nextSeconds: number) {
    stop();
    secondsLeft.value = nextSeconds;
  }

  const formattedTime = computed(() => {
    const minutes = Math.floor(secondsLeft.value / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secondsLeft.value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  onBeforeUnmount(stop);

  return {
    isRunning,
    formattedTime,
    start,
    stop,
    reset
  };
}
