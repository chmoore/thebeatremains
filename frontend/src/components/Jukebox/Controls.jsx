import * as PropTypes from 'prop-types';
import Pause from '../Icons/Pause';
import Play from '../Icons/Play';
import Stop from '../Icons/Stop';

const Controls = function Controls({ onClear, onPlay, onPause, playing }) {
  return (
    <div className="flex items-center justify-around sm:justify-start sm:space-x-10 pb-8 sm:pb-14 border-b border-slate-300">
      <div className="text-center sm:text-left">
        <p className="mb-5 uppercase text-xs sm:text-sm lg:text-xl">play mix</p>
        <button
          className="p-3 sm:p-5 text-stone-800 bg-slate-200 rounded-md hover:bg-slate-300 duration-150 transition-all"
          onClick={playing ? onPause : onPlay}
        >
          {playing && <Pause />}
          {!playing && <Play />}
        </button>
      </div>
      <div className="text-center sm:text-left">
        <p className="mb-5 uppercase text-xs sm:text-sm lg:text-xl">
          clear all songs
        </p>
        <button
          className="p-3 sm:p-5 text-stone-800 bg-slate-200 rounded-md hover:bg-slate-300 duration-150 transition-all"
          onClick={onClear}
        >
          <Stop />
        </button>
      </div>
    </div>
  );
};

Controls.propTypes = {
  onClear: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  playing: PropTypes.bool,
};

export default Controls;
