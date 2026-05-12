import { getSharedAudioContext } from './useSoundEffects';

const MUSIC_SRC = '/sounds/music.mp3';
const MUSIC_VOLUME = 0.3;

let backgroundBufferPromise: Promise<AudioBuffer | null> | null = null;
let backgroundSource: AudioBufferSourceNode | null = null;
let backgroundGain: GainNode | null = null;

export function preloadBackgroundMusic() {
  const context = getSharedAudioContext();

  if (!context) {
    return Promise.resolve(null);
  }

  if (backgroundBufferPromise) {
    return backgroundBufferPromise;
  }

  backgroundBufferPromise = fetch(MUSIC_SRC)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load background music: ${MUSIC_SRC}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return context.decodeAudioData(arrayBuffer.slice(0));
    })
    .catch(() => null);

  return backgroundBufferPromise;
}

export async function playBackgroundMusic() {
  const context = getSharedAudioContext();

  if (!context) {
    return false;
  }

  if (context.state === 'suspended') {
    await context.resume();
  }

  if (backgroundSource) {
    return true;
  }

  const buffer = await preloadBackgroundMusic();

  if (!buffer) {
    return false;
  }

  const source = context.createBufferSource();
  const gainNode = context.createGain();

  source.buffer = buffer;
  source.loop = true;
  gainNode.gain.value = MUSIC_VOLUME;

  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(0);
  source.onended = () => {
    if (backgroundSource === source) {
      backgroundSource = null;
      backgroundGain = null;
    }
  };

  backgroundSource = source;
  backgroundGain = gainNode;

  return true;
}

export function stopBackgroundMusic() {
  if (!backgroundSource) {
    return;
  }

  backgroundSource.onended = null;
  backgroundSource.stop();
  backgroundSource.disconnect();
  backgroundGain?.disconnect();
  backgroundSource = null;
  backgroundGain = null;
}
