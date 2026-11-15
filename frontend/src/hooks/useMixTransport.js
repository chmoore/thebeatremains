import { useCallback, useEffect, useRef } from 'react';

const START_LEAD_SECONDS = 0.04;

export default function useMixTransport() {
  const contextRef = useRef(null);
  const buffersRef = useRef(new Map());
  const sourcesRef = useRef([]);
  const positionRef = useRef(0);
  const startedAtRef = useRef(0);
  const durationRef = useRef(0);
  const playingRef = useRef(false);
  const generationRef = useRef(0);

  const getContext = useCallback(() => {
    if (!contextRef.current) {
      const AudioContextCtor =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) {
        throw new Error('Web Audio is not supported in this browser.');
      }
      contextRef.current = new AudioContextCtor();
    }
    return contextRef.current;
  }, []);

  const stopSources = useCallback(() => {
    generationRef.current += 1;
    for (const entry of sourcesRef.current) {
      try {
        entry.source.onended = null;
        entry.source.stop();
      } catch {
        // Source may already have ended.
      }
      try {
        entry.source.disconnect();
        entry.gain.disconnect();
      } catch {
        // Disconnect is best-effort during cleanup.
      }
    }
    sourcesRef.current = [];
  }, []);

  const getPosition = useCallback(() => {
    if (!playingRef.current || !contextRef.current) {
      return positionRef.current;
    }

    const elapsed = Math.max(
      0,
      contextRef.current.currentTime - startedAtRef.current
    );
    return Math.min(
      durationRef.current || Number.POSITIVE_INFINITY,
      positionRef.current + elapsed
    );
  }, []);

  const ensureBuffers = useCallback(
    async audios => {
      const context = getContext();

      await Promise.all(
        audios.map(async audio => {
          if (buffersRef.current.has(audio.id)) return;

          const bytes = await audio.file.arrayBuffer();
          const buffer = await context.decodeAudioData(bytes.slice(0));
          buffersRef.current.set(audio.id, buffer);
        })
      );

      const currentIds = new Set(audios.map(audio => audio.id));
      for (const id of buffersRef.current.keys()) {
        if (!currentIds.has(id)) buffersRef.current.delete(id);
      }
    },
    [getContext]
  );

  const play = useCallback(
    async audios => {
      if (!audios.length) return false;

      const context = getContext();
      await context.resume();
      await ensureBuffers(audios);

      const primary =
        audios.find(audio => audio.primary) || audios[0];
      const primaryBuffer = buffersRef.current.get(primary.id);
      if (!primaryBuffer) return false;

      durationRef.current = primaryBuffer.duration;

      if (positionRef.current >= durationRef.current - 0.01) {
        positionRef.current = 0;
      }

      stopSources();
      const generation = generationRef.current;
      const when = context.currentTime + START_LEAD_SECONDS;
      const offset = positionRef.current;

      for (const audio of audios) {
        const buffer = buffersRef.current.get(audio.id);
        if (!buffer || offset >= buffer.duration) continue;

        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(context.destination);
        source.start(when, offset);
        sourcesRef.current.push({ source, gain, id: audio.id });

        if (audio.id === primary.id) {
          source.onended = () => {
            if (
              generationRef.current === generation &&
              playingRef.current
            ) {
              playingRef.current = false;
              positionRef.current = 0;
            }
          };
        }
      }

      startedAtRef.current = when;
      playingRef.current = true;
      return true;
    },
    [ensureBuffers, getContext, stopSources]
  );

  const pause = useCallback(() => {
    if (playingRef.current) {
      positionRef.current = getPosition();
    }
    playingRef.current = false;
    stopSources();
    return positionRef.current;
  }, [getPosition, stopSources]);

  const reset = useCallback(() => {
    playingRef.current = false;
    positionRef.current = 0;
    durationRef.current = 0;
    stopSources();
  }, [stopSources]);

  useEffect(
    () => () => {
      reset();
      const context = contextRef.current;
      contextRef.current = null;
      if (context && context.state !== 'closed') {
        context.close().catch(() => {});
      }
    },
    [reset]
  );

  return {
    play,
    pause,
    reset,
    getPosition,
    getDuration: () => durationRef.current,
  };
}
