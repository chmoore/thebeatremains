export const initialSelectedAudio = {
  id: null,
  metadata: {
    title: '',
    artist: '',
    album: '',
    year: '',
  },
};

export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const AudioFormatEnum = Object.freeze({
  MP3: 'mp3',
  WAV: 'wav',
});
