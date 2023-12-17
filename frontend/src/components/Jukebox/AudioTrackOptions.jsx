import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import ChevronDown from '../Icons/ChevronDown';
import EllipsesVertical from '../Icons/EllipsesVertical';
import ChevronUp from '../Icons/ChevronUp';
import { AudioFormatEnum } from '../../constants';

const AudioTrackOptions = function AudioTrackOptions({
  onEditMetaTags,
  onDownload,
}) {
  const [dropdown, setDropdown] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = e => {
      const clickedInsideDropdown = dropdownRef.current.contains(e.target);
      const clickedOnButton = buttonRef.current.contains(e.target);

      if (clickedOnButton) {
        return;
      } else if (!clickedInsideDropdown && !clickedOnButton) {
        setDropdown(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleDropdown = () => {
    setDropdown(prevState => {
      return !prevState;
    });
  };

  const handleEditMetaTags = () => {
    onEditMetaTags();
    setDropdown(prevState => !prevState);
  };

  return (
    <>
      <div className="flex items-center justify-end sm:justify-center gap-x-2 sm:gap-x-5 text-xs sm:text-sm md:text-base">
        <button
          type="button"
          className="hidden sm:block"
          onClick={() => onDownload(AudioFormatEnum.MP3)}
        >
          Download MP3
        </button>
        <button type="button" onClick={handleDropdown} ref={buttonRef}>
          <EllipsesVertical
            className={`text-slate-600 h-5 sm:h-7 w-5 sm:w-7 ${
              dropdown ? 'sm:hidden' : 'sm:hidden'
            }`}
          />
          <ChevronDown
            className={`bg-slate-300 rounded-full p-1 h-4 sm:h-7 w-4 sm:w-7 ${
              dropdown ? 'hidden' : 'hidden sm:block'
            }`}
          />
          <ChevronUp
            className={`h-6 w-6 ${!dropdown ? 'hidden' : 'hidden sm:block'}`}
          />
        </button>
      </div>
      <div
        ref={dropdownRef}
        className={`absolute mt-2 shadow-xl z-10 transition-all duration-150 right-0  ${
          !dropdown ? 'hidden' : ''
        }`}
      >
        <ul className="rounded-md bg-slate-200 w-52 text-xs sm:text-sm md:text-base">
          <li className="hover:bg-slate-300 transition-all duration-150">
            <button
              type="buttton"
              className="w-full text-left px-5 py-2 sm:py-3"
              onClick={() => onDownload(AudioFormatEnum.MP3)}
            >
              Download MP3
            </button>
          </li>
          <li className="hover:bg-slate-300 transition-all duration-150">
            <button
              type="buttton"
              className="w-full text-left px-5 py-2 sm:py-3"
              onClick={() => onDownload(AudioFormatEnum.WAV)}
            >
              Download WAV
            </button>
          </li>
          <li className="hover:bg-slate-300 transition-all duration-150">
            <button
              type="buttton"
              className="w-full text-left px-5 py-2 sm:py-3"
              onClick={handleEditMetaTags}
            >
              Edit Metatags
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

AudioTrackOptions.propTypes = {
  onEditMetaTags: PropTypes.func,
  onDownload: PropTypes.func,
};

export default AudioTrackOptions;
