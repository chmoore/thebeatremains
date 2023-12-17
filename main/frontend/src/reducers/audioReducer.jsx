import { initialSelectedAudio } from '../constants';
import { generateKey } from '../utility';

const audioReducer = function audioReducer(state, action) {
  if (action.type === 'loaded_primary_audio') {
    return {
      ...state,
      audios: [action.payload],
    };
  } else if (action.type === 'audio_paused') {
    return {
      ...state,
      isPlaying: false,
    };
  } else if (action.type === 'audio_resumed') {
    return {
      ...state,
      isPlaying: true,
    };
  } else if (action.type === 'added_audios') {
    const [defaultPrimaryAudio] = state.audios;
    defaultPrimaryAudio.id = generateKey();

    return {
      ...state,
      audios: [defaultPrimaryAudio, ...action.payload.files],
      isPlaying: false,
    };
  } else if (action.type === 'deleted_audios') {
    const [defaultPrimaryAudio] = state.audios;
    defaultPrimaryAudio.id = generateKey();

    return {
      ...state,
      audios: [defaultPrimaryAudio],
      selectedAudio: initialSelectedAudio,
      isPlaying: false,
    };
  } else if (action.type === 'audio_selected') {
    const audio = state.audios.find(item => item.id === action.payload.id);
    return {
      ...state,
      selectedAudio: { ...audio },
    };
  } else if (action.type === 'audio_deselected') {
    return {
      ...state,
      selectedAudio: { ...initialSelectedAudio },
    };
  } else if (action.type === 'updated_audio_metatag') {
    const audios = [...state.audios];

    const updatedIndex = state.audios.findIndex(
      audio => audio.id === action.payload.updatedAudio.id
    );

    if (updatedIndex === -1) {
      return {
        ...state,
        selectedAudio: { ...initialSelectedAudio },
      };
    }

    audios[updatedIndex] = action.payload.updatedAudio;

    return {
      ...state,
      audios,
      selectedAudio: { ...initialSelectedAudio },
    };
  }

  throw Error('Unknown action.');
};

export default audioReducer;
