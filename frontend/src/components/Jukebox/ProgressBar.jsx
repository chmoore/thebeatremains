import PropTypes from 'prop-types';
import { forwardRef, useEffect, useMemo, useState } from 'react';

const calculateTime = secs => {
  const safeSeconds = Number.isFinite(secs) ? secs : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = Math.floor(safeSeconds % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

const ProgressBar = forwardRef(function ProgressBar(
  { audio, transportPosition = 0 },
  ref
) {
  const [duration, setDuration] = useState(0);
  const audioUrl = useMemo(() => URL.createObjectURL(audio), [audio]);
  const currentProgress =
    duration > 0
      ? Math.min(100, (Math.min(transportPosition, duration) / duration) * 100)
      : 0;

  useEffect(() => () => URL.revokeObjectURL(audioUrl), [audioUrl]);

  useEffect(() => {
    const audioElement = ref.current;
    if (!audioElement) return undefined;

    const handleDuration = () => {
      if (Number.isFinite(audioElement.duration)) {
        setDuration(audioElement.duration);
      }
    };

    audioElement.addEventListener('loadedmetadata', handleDuration);
    if (audioElement.readyState >= 1) handleDuration();

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleDuration);
    };
  }, [audioUrl, ref]);

  return (
    <>
      <progress
        className="w-full flex-1"
        max="100"
        value={currentProgress}
        aria-label={`Mix position ${calculateTime(transportPosition)} of ${calculateTime(duration)}`}
      />
      <audio ref={ref} preload="metadata" className="hidden">
        <source src={audioUrl} type={audio.type} />
        Your browser does not support the audio element.
      </audio>
      <span className="text-xs sm:text-sm lg:text-lg flex-none shrink-0">
        {calculateTime(duration)}
      </span>
    </>
  );
});

ProgressBar.propTypes = {
  audio: PropTypes.instanceOf(File),
  transportPosition: PropTypes.number,
};

export default ProgressBar;
