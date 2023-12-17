import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { BASE_API_URL } from '../constants';
import { downloadFile } from '../utility';

const DownloadMix = function DownloadMix({ files }) {
  const controller = new AbortController();
  const [isDownloading, setDownloading] = useState(false);

  const handleDownloadClick = async () => {
    const signal = controller.signal;

    try {
      setDownloading(true);

      const formData = new FormData();

      files.forEach(({ file }) => {
        formData.append('audioFiles', file, file.name);
      });

      const response = await fetch(`${BASE_API_URL}/audio/mix`, {
        method: 'POST',
        body: formData,
        signal,
      });

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

        const blob = await response.blob();

        downloadFile(blob, 'mix.mp3');

        return toast.success('Your mix is downloaded! Enjoy!', {
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
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <button
      className="flex-none sm:flex w-full text-center sm:text-left sm:w-auto sm:px-10 py-3 sm:py-5 bg-indigo-500 rounded-lg font-semibold text-white transition-all duration-150 hover:bg-indigo-600 mx-auto"
      onClick={handleDownloadClick}
      disabled={isDownloading}
    >
      {isDownloading ? 'Downloading...' : 'Download Mix'}
    </button>
  );
};

DownloadMix.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
};

export default DownloadMix;
