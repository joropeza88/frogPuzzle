const MUSIC_SRC = 'sounds/music.mp3';

const backgroundMusic =
  typeof Audio === 'undefined' ? null : new Audio(MUSIC_SRC);

if (backgroundMusic) {
  backgroundMusic.loop = true;
  backgroundMusic.preload = 'auto';
  backgroundMusic.volume = 0.3;
}

export function preloadBackgroundMusic() {
  if (!backgroundMusic) {
    return Promise.resolve();
  }

  if (backgroundMusic.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      backgroundMusic.oncanplaythrough = null;
      backgroundMusic.onerror = null;
      resolve();
    };

    backgroundMusic.oncanplaythrough = finish;
    backgroundMusic.onerror = finish;
    backgroundMusic.load();

    window.setTimeout(finish, 2400);
  });
}

export async function playBackgroundMusic() {
  if (!backgroundMusic) {
    return false;
  }

  if (!backgroundMusic.paused) {
    return true;
  }

  try {
    await backgroundMusic.play();
    return true;
  } catch {
    return false;
  }
}

export function stopBackgroundMusic() {
  if (!backgroundMusic) {
    return;
  }

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}
