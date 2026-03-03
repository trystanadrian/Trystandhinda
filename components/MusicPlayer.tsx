'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const playlist = [
  {
    title: 'Acoustic Breeze',
    src: '/sounds/acoustic-breeze.mp3',
  },
  {
    title: 'Just Relax',
    src: '/sounds/just-relax.mp3',
  },
  {
    title: 'Lofi Study',
    src: '/sounds/lofi-study.mp3',
  },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error("Audio play failed:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  }, []);

  const playPrev = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentTrackIndex].src;
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio play failed:", error);
          setIsPlaying(false);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Show player on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setIsPlayerVisible(true);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={playNext}
        onError={(e) => console.warn("Audio playback error. Ensure files exist in public/sounds/", e.currentTarget.error)}
        loop={false}
      />
      <AnimatePresence>
        {isPlayerVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border border-white/50 flex flex-col gap-3 w-80">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-spin-slow' : ''}`}>
                  <Music className="text-white" size={32} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-teal-900 truncate">{playlist[currentTrackIndex].title}</p>
                  <p className="text-xs text-gray-500">Romantic Instrumentals</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={playPrev} className="text-gray-600 hover:text-black transition"><SkipBack size={20} /></button>
                  <button onClick={togglePlayPause} className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 transition shadow-md">
                    {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
                  </button>
                  <button onClick={playNext} className="text-gray-600 hover:text-black transition"><SkipForward size={20} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsMuted(!isMuted)} className="text-gray-500 hover:text-black">{isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
                  <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); if (isMuted) setIsMuted(false); }} className="w-20 h-1 accent-teal-500" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}