import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import Dropbox from './Icons/Dropbox.jsx';
import CloudUpload from './Icons/CloudUpload.jsx';

const audioFormats = {
  'audio/mpeg': ['.mp4'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'audio/aac': ['.aac'],
  'audio/flac': ['.flac'],
  'audio/midi': ['.midi', '.mid'],
  'audio/amr': ['.amr'],
  'audio/webm': ['.webm'],
  'audio/3gpp': ['.3gp', '.3gpp'],
  'audio/x-aiff': ['.aiff', '.aif'],
};

function Dropzone({ onDrop }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: audioFormats,
    onDropAccepted: onDrop,
  });

  return (
    <div
      className="text-xs sm:text-sm md:text-base border-dashed border-2 border-slate-300 p-5 sm:p-10 flex flex-col items-center justify-center w-full sm:w-8/12 lg:w-6/12 mx-auto"
      {...getRootProps()}
    >
      <div className="flex gap-x-5 mb-10">
        <Dropbox fill="#64748B" className="h-4 sm:h-7 w-4 sm:w-7" />
        <CloudUpload fill="#64748B" className="h-4 sm:h-7 w-4 sm:w-7" />
      </div>
      <input {...getInputProps()} />
      <p className="text-slate-500">Drag files here, or click to import</p>
    </div>
  );
}

Dropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
};

export default Dropzone;
