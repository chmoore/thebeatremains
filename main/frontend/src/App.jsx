import * as id3 from 'id3js';
import { ToastContainer } from 'react-toastify';
import { createRef, useEffect, useReducer, useRef } from 'react';
import AudioTrack from './components/Jukebox/AudioTrack.jsx';
import Dropzone from './components/Dropzone.jsx';
import Header from './components/Header.jsx';
import Controls from './components/Jukebox/Controls.jsx';
import DownloadMix from './components/DownloadMix.jsx';
import ModalMetaTag from './components/Jukebox/ModalMetaTag.jsx';
import { initialSelectedAudio } from './constants.js';
import audioReducer from './reducers/audioReducer.jsx';
import { generateKey } from './utility.js';

function App() {
  const [state, dispatch] = useReducer(audioReducer, {
    audios: [],
    selectedAudio: initialSelectedAudio,
    isPlaying: false,
  });

  const audioRefs = useRef([]);
  const editMetaTagModalRef = useRef();

  audioRefs.current = [
    ...state.audios.map((_, i) => audioRefs.current[i] || createRef()),
  ];

  useEffect(() => {
    const fetchAudioFile = async () => {
      try {
        const response = await fetch('/primary.mp3');
        const audioData = await response.arrayBuffer();
        const file = new File([audioData], 'primary.mp3', {
          type: 'audio/mpeg',
        });

        const metadata = await id3.fromFile(file);

        dispatch({
          type: 'loaded_primary_audio',
          payload: { id: generateKey(), file, metadata, primary: true },
        });
      } catch (error) {
        console.error('Error fetching audio file:', error);
      }
    };

    fetchAudioFile();
  }, []);

  useEffect(() => {
    if (!state.audios.length && state.isPlaying) {
      dispatch({ type: 'audio_paused' });
    }
  }, [state.audios, state.isPlaying]);

  const handleDropFiles = async acceptedFiles => {
    const filesWithMetaData = await Promise.all(
      acceptedFiles.map(async file => {
        try {
          const metadata = await id3.fromFile(file);
          return { id: generateKey(), file, metadata, primary: false };
        } catch (error) {
          return { error };
        }
      })
    );

    dispatch({ type: 'added_audios', payload: { files: filesWithMetaData } });
  };

  const handleClearFiles = () => {
    dispatch({ type: 'deleted_audios' });
  };

  const handlePlayMix = () => {
    if (state.audios.length) {
      dispatch({ type: 'audio_resumed' });
      audioRefs.current.forEach(audioRef => {
        audioRef.current.play();
      });
    }
  };

  const handlePauseMix = () => {
    dispatch({ type: 'audio_paused' });
    audioRefs.current.forEach(audioRef => {
      audioRef.current.pause();
    });
  };

  const handleEditMetaTags = audioId => {
    dispatch({ type: 'audio_selected', payload: { id: audioId } });
    editMetaTagModalRef.current.open();
  };

  const handleUpdateMetaTags = updatedAudio => {
    dispatch({ type: 'updated_audio_metatag', payload: { updatedAudio } });
    editMetaTagModalRef.current.close();
  };

  const handleCancelMetaTags = () => {
    dispatch({ type: 'audio_deselected' });
    editMetaTagModalRef.current.close();
  };

  return (
    <>
      <ModalMetaTag
        ref={editMetaTagModalRef}
        onUpdate={handleUpdateMetaTags}
        onCancel={handleCancelMetaTags}
        selectedAudio={state.selectedAudio}
      />
      <Header />
      <section className="sm:mb-14 space-y-10 sm:space-y-16">
        <Controls
          onClear={handleClearFiles}
          onPause={handlePauseMix}
          onPlay={handlePlayMix}
          playing={state.isPlaying}
        />
        {!!state.audios && (
          <div className="space-y-8">
            <p>Main Song</p>
            {state.audios.map((audio, index) => {
              if (audio.primary) {
                return (
                  <AudioTrack
                    key={audio.id}
                    ref={audioRefs.current[index]}
                    audio={audio}
                    onEditMetaTags={() => handleEditMetaTags(audio.id)}
                  />
                );
              }
            })}
          </div>
        )}
        {state.audios.length > 1 && (
          <div className="space-y-8">
            <p>Secondary Song (Upto 10)</p>
            <ul id="songs-list" className="grid gap-10">
              {state.audios.map((audio, index) => {
                if (!audio.primary) {
                  return (
                    <AudioTrack
                      key={audio.id}
                      ref={audioRefs.current[index]}
                      audio={audio}
                      onEditMetaTags={() => handleEditMetaTags(audio.id)}
                    />
                  );
                }
              })}
            </ul>
          </div>
        )}
        <Dropzone onDrop={handleDropFiles} />
        <DownloadMix files={state.audios} />
      </section>
      <ToastContainer />
    </>
  );
}

export default App;
