import PropTypes from 'prop-types';
import { forwardRef, useCallback, useEffect, useState } from 'react';

const calculateTime = secs => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

const ProgressBar = forwardRef(function ProgressBar({ audio }, ref) {
  const [duration, setDuration] = useState('00:00');
  const [currentProgress, setCurrentProgress] = useState(0);
  const audioUrl = URL.createObjectURL(audio);
  const formattedDuration = calculateTime(duration);

  const handleDuration = useCallback(function handleDuration(audioElement) {
    setDuration(audioElement.duration);
  }, []);

  const handleProgressBar = useCallback(
    function handleProgressBar(audioElement) {
      let currentTime = audioElement.currentTime;
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
      setCurrentProgress(progress);
    },
    [duration]
  );

  useEffect(() => {
    const audioElementRef = ref.current;
    const handleDurationFn = () => handleDuration(audioElementRef);
    const handleProgressBarFn = () => handleProgressBar(audioElementRef);

    audioElementRef.addEventListener('loadedmetadata', handleDurationFn);
    audioElementRef.addEventListener('timeupdate', handleProgressBarFn);

    return () => {
      audioElementRef.removeEventListener('loadedmetadata', handleDurationFn);
      audioElementRef.removeEventListener('timeupdate', handleProgressBarFn);
    };
  }, [handleDuration, handleProgressBar, ref]);

  return (
    <>
      <progress className="w-full flex-1" max="100" value={currentProgress} />
      <audio ref={ref} preload="metadata" controls className="hidden">
        <source src={audioUrl} type={audio.type} />
        Your browser does not support the audio element.
      </audio>
      <span className="text-xs sm:text-sm lg:text-lg flex-none shrink-0">
        {formattedDuration}
      </span>
    </>
  );
});

ProgressBar.propTypes = {
  audio: PropTypes.object,
};

export default ProgressBar;
