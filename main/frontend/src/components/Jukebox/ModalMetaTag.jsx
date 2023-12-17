import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useState } from 'react';
import Modal from '../UI/Modal';
import { toast } from 'react-toastify';
import { fromFile } from 'id3js';
import { BASE_API_URL, initialSelectedAudio } from '../../constants';

const ModalMetaTag = forwardRef(function ModalMetaTag(
  { selectedAudio, onUpdate, onCancel },
  ref
) {
  const controller = new AbortController();
  const formRef = useRef();
  const [downloading, setDownloading] = useState(false);
  const [formInputs, setFormInputs] = useState(initialSelectedAudio.metadata);

  useEffect(() => {
    setFormInputs({
      title: selectedAudio.metadata?.title || '',
      artist: selectedAudio.metadata?.artist || '',
      album: selectedAudio.metadata?.album || '',
      year: selectedAudio.metadata?.year || '',
    });
  }, [selectedAudio]);

  const handleInputChange = (fieldName, value) => {
    setFormInputs(prevInputs => ({
      ...prevInputs,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    const signal = controller.signal;

    try {
      setDownloading(true);

      const formData = new FormData();
      formData.append('audioFile', selectedAudio.file, selectedAudio.file.name);

      Object.entries(formInputs).forEach(([fieldName, value]) => {
        formData.append(fieldName, value);
      });

      const response = await fetch(`${BASE_API_URL}/audio/meta-tags/edit`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
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
        const updatedAudioFile = new File([blob], selectedAudio.file.name, {
          type: selectedAudio.file.type,
        });
        const metadata = await fromFile(updatedAudioFile);

        onUpdate({
          ...selectedAudio,
          file: updatedAudioFile,
          metadata,
        });

        formRef.current.reset();

        toast.success('Track metatag updated successfully!', {
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

  return (
    <Modal ref={ref}>
      <h2 className="text-center text-xl">Edit Metatags</h2>
      <form
        ref={formRef}
        className="flex flex-col justify-center items-center space-y-6"
      >
        <div className="w-full space-y-2">
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-2 py-1 border border-slate-400 rounded"
            value={formInputs.title}
            onChange={e => handleInputChange('title', e.target.value)}
          />
        </div>
        <div className="w-full space-y-2">
          <label htmlFor="artist" className="block">
            Artist
          </label>
          <input
            type="text"
            id="artist"
            className="w-full px-2 py-1 border border-slate-400 rounded"
            value={formInputs.artist}
            onChange={e => handleInputChange('artist', e.target.value)}
          />
        </div>
        <div className="w-full space-y-2">
          <label htmlFor="album" className="block">
            Album
          </label>
          <input
            type="text"
            id="album"
            className="w-full px-2 py-1 border border-slate-400 rounded"
            value={formInputs.album}
            onChange={e => handleInputChange('album', e.target.value)}
          />
        </div>
        <div className="w-full space-y-2">
          <label htmlFor="year" className="block">
            Publish Date
          </label>
          <input
            type="date"
            id="year"
            className="w-full px-2 py-1 border border-slate-400 rounded"
            value={formInputs.year}
            onChange={e => handleInputChange('year', e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-5">
          <button
            type="button"
            className={`px-4 py-2 bg-green-400 hover:bg-green-500 transition duration-200 rounded-lg text-white font-semibold ${
              downloading && 'disabled:bg-green-200'
            }`}
            onClick={handleSubmit}
            disabled={downloading}
          >
            Submit
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-400 hover:bg-red-500 transition duration-200 rounded-lg text-white font-semibold"
            onClick={onCancel}
          >
            Close
          </button>
        </div>
      </form>
    </Modal>
  );
});

ModalMetaTag.propTypes = {
  selectedAudio: PropTypes.shape({
    file: PropTypes.instanceOf(File),
    metadata: PropTypes.shape({
      title: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,

      year: PropTypes.string,
    }),
  }),
  onUpdate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ModalMetaTag;
