type SoundEffectOptions = {
  volume?: number;
  offset?: number;
};

const AudioContextCtor =
  typeof window === 'undefined'
    ? null
    : window.AudioContext ||
      // Safari legacy prefix.
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext ||
      null;

let audioContext: AudioContext | null = null;
const soundBufferCache = new Map<string, Promise<AudioBuffer | null>>();

function getAudioContext() {
  if (!AudioContextCtor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextCtor();
  }

  return audioContext;
}

export function getSharedAudioContext() {
  return getAudioContext();
}

export async function resumeSoundEffects() {
  const context = getAudioContext();

  if (!context) {
    return false;
  }

  if (context.state === 'suspended') {
    await context.resume();
  }

  return true;
}

export function preloadSoundEffect(src: string) {
  const context = getAudioContext();

  if (!context) {
    return Promise.resolve(null);
  }

  const cachedBuffer = soundBufferCache.get(src);

  if (cachedBuffer) {
    return cachedBuffer;
  }

  const nextBuffer = fetch(src)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load sound effect: ${src}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return context.decodeAudioData(arrayBuffer.slice(0));
    })
    .catch(() => null);

  soundBufferCache.set(src, nextBuffer);
  return nextBuffer;
}

export async function playSoundEffect(
  src: string,
  { volume = 1, offset = 0 }: SoundEffectOptions = {}
) {
  const context = getAudioContext();

  if (!context) {
    return false;
  }

  if (context.state === 'suspended') {
    await context.resume();
  }

  const buffer = await preloadSoundEffect(src);

  if (!buffer) {
    return false;
  }

  const source = context.createBufferSource();
  const gainNode = context.createGain();
  const safeOffset = Math.min(Math.max(offset, 0), Math.max(buffer.duration - 0.01, 0));

  source.buffer = buffer;
  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(0, safeOffset);

  return true;
}
