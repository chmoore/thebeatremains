import PropTypes from 'prop-types';
import SoundWave from '../Icons/SoundWave.jsx';
import { forwardRef } from 'react';
import ProgressBar from './ProgressBar.jsx';
import AudioTrackOptions from './AudioTrackOptions.jsx';
import { BASE_API_URL } from '../../constants.js';
import { toast } from 'react-toastify';
import { downloadFile, readFileFromHeaders } from '../../utility.js';

const AudioTrack = forwardRef(function AudioTrack(
  { audio, onEditMetaTags },
  ref
) {
  let controller = new AbortController();
  const { metadata, file } = audio;
  const title = metadata?.title || 'Unknown';
  const artist = metadata?.artist || 'Unknown Artist';

  const handleDownload = async format => {
    const signal = controller.signal;

    try {
      const formData = new FormData();
      formData.append('audioFile', audio.file);

      const response = await fetch(
        `${BASE_API_URL}/audio/download?format=${format}`,
        {
          method: 'POST',
          body: formData,
          signal,
        }
      );

      if (!signal.aborted) {
        if (!response.ok) {
          return toast.error('Oops! Something went wrong!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        }

        const filename = readFileFromHeaders(response);

        const blob = await response.blob();

        downloadFile(blob, filename);

        return toast.success('Audio track downloaded successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    } catch (error) {
      if (!signal.aborted) {
        return toast.error(error.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-12 gap-3 sm:gap-5 items-center relative">
      <div className="col-span-1 flex items-center">
        <div className="p-1 sm:p-3 bg-slate-300 inline-block rounded-sm sm:rounded-md">
          <SoundWave className="h-3 sm:h-10 w-3 sm:w-10 fill-slate-600" />
        </div>
      </div>
      <div className="col-span-3">
        <p className="font-semibold text-xs lg:text-lg">{title}</p>
        <p className="text-xs lg:text-base">{artist}</p>
      </div>
      <div className="col-span-7 sm:col-span-7 lg:col-span-6">
        <div className="flex items-center gap-x-2 sm:gap-x-10 text-slate-500">
          <ProgressBar ref={ref} audio={file} />
        </div>
      </div>
      <div className="col-span-1 sm:col-span-2 lg:col-span-2">
        <AudioTrackOptions
          onEditMetaTags={onEditMetaTags}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
});

AudioTrack.propTypes = {
  onEditMetaTags: PropTypes.func,
  audio: PropTypes.shape({
    id: PropTypes.string,
    file: PropTypes.instanceOf(File),
    metadata: PropTypes.objectOf(PropTypes.any),
  }),
};

export default AudioTrack;
