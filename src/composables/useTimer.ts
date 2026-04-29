import { computed, onBeforeUnmount, ref } from 'vue';

type TimerOptions = {
  onExpire: () => void;
  onTenSecondsLeft?: () => void;
};

export function useTimer({ onExpire, onTenSecondsLeft }: TimerOptions) {
  const secondsLeft = ref(0);
  const isRunning = ref(false);
  let intervalId: number | null = null;
  let hasTriggeredTenSecondWarning = false;

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

    if (secondsLeft.value === 10 && !hasTriggeredTenSecondWarning) {
      hasTriggeredTenSecondWarning = true;
      onTenSecondsLeft?.();
    }

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
    hasTriggeredTenSecondWarning = nextSeconds <= 10;
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
    secondsLeft,
    isRunning,
    formattedTime,
    start,
    stop,
    reset
  };
}
