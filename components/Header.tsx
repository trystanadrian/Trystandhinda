'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Heart, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: '📷 Album', href: '#album' },
  { name: '🎞️ Memory Lane', href: '#memorylane' },
  { name: '🕰️ Timeline', href: '#timeline' },
  { name: '✅ Wishlist', href: '#wishlist' },
  { name: '🖼️ Gallery', href: '#gallery' },
  { name: '📍 LDR Tracker', href: '#ldr-tracker' },
  { name: '🎤 Voice Notes', href: '#voicenotes' },
  { name: '📅 Mood Tracker', href: '#moodtracker' },
  { name: '⏰ Messages', href: '#messages' },
  { name: '💌 Love Letter', href: '#loveletter' },
  { name: '🎁 Surprise', href: '#surprise' },
];

const playlist = [
  {
    title: 'Sweet February',
    src: '/sounds/sweet february.mp3',
  },
  {
    title: 'Soft Hearts',
    src: '/sounds/soft hearts.mp3',
  },
  {
    title: 'Soft February',
    src: '/sounds/soft february.mp3',
  },
  {
    title: 'Love in Bloom',
    src: '/sounds/love in bloom.mp3',
  },
  {
    title: 'February Love',
    src: '/sounds/february love.mp3',
  },
];

export default function Header() {
  const [isMuted, setIsMuted] = useState(true); // Start muted due to autoplay policies
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  // Pindahkan state ke atas agar bisa diakses oleh playNext
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const consecutiveErrorCountRef = useRef(0); // To prevent infinite loops
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  }, []);

  // 1. Initialize audio element and set up event listeners (once on mount)
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = false; // Playlist handles looping
    audioRef.current.volume = 0.5;
    audioRef.current.muted = true; // Start muted, will be unmuted by user interaction or if autoplay succeeds
    audioRef.current.onended = playNext;

    // This event fires when a track has loaded enough to be played.
    // This is a good place to reset our error counter.
    audioRef.current.oncanplay = () => {
      consecutiveErrorCountRef.current = 0;
    };

    // This event fires when the browser can't load the audio file.
    audioRef.current.onerror = () => {
      if (!audioRef.current) return;

      console.warn(
        `Audio playback error on track: ${audioRef.current.src}. Skipping to next track.`
      );
      
      consecutiveErrorCountRef.current += 1;
      
      // If we've failed to load more tracks than exist in the playlist, stop trying.
      if (consecutiveErrorCountRef.current >= playlist.length) {
        console.error("All tracks in the playlist failed to load. Please check if files exist in public/sounds/.");
        audioRef.current.pause();
        setIsMuted(true); // Visually indicate that it's stopped
        return;
      }
      
      // Skip to the next track after a short delay
      setTimeout(playNext, 200);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.oncanplay = null;
        audioRef.current = null;
      }
    };
  }, [playNext]);

  // 2. Update track source and play when currentTrackIndex changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentTrackIndex].src;
      // Always try to play. The `onerror` handler will catch loading failures.
      audioRef.current.play().catch(error => {
        // This catch is for play() promise rejections (e.g., browser policy).
        if (error.name !== 'AbortError') { // AbortError is common and can be ignored.
            console.warn(`Audio play() was prevented for ${playlist[currentTrackIndex].src}:`, error.message);
        }
      });
    }
  }, [currentTrackIndex]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.muted = newMuted;
      if (!newMuted) {
        audioRef.current.play().catch((e) => {
          console.warn("Audio play failed on unmute:", e);
        });
      }
    }
  };

  // Active Section Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -50% 0px' }
    );

    navLinks.forEach((link) => {
      const section = document.getElementById(link.href.substring(1));
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    window.location.hash = href;
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'backdrop-blur-xl bg-white/80 border-b border-cyan-100 shadow-sm py-2' 
          : 'bg-transparent border-transparent py-4'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center transition-all duration-500">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
              isScrolled 
                ? 'bg-transparent' 
                : 'bg-white/40 backdrop-blur-md border border-white/50 shadow-sm'
            }`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="font-playfair font-bold text-xl text-teal-800 group-hover:text-pink-500 transition-colors duration-300">T</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={16} className="text-rose-500 fill-rose-500" />
            </motion.div>
            <span className="font-playfair font-bold text-xl text-teal-800 group-hover:text-pink-500 transition-colors duration-300">D</span>
          </motion.div>
          
          {/* Right Controls */}
          <div className="flex gap-3 md:gap-4 items-center">
            {/* Song Title Indicator */}
            <AnimatePresence mode="wait">
              {!isMuted && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="hidden md:flex flex-col items-end mr-2"
                >
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Now Playing</span>
                  <motion.span
                    key={currentTrackIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold text-teal-800 max-w-[150px] truncate"
                  >
                    {playlist[currentTrackIndex].title}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Music Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className={`p-2.5 rounded-full transition shadow-sm border ${!isMuted ? 'bg-cyan-100 border-cyan-300 text-cyan-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              title={!isMuted ? "Mute Music" : "Unmute Music"}
            >
              {!isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </motion.button>

            {/* Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md hover:shadow-lg transition z-50"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Full Screen Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/60 backdrop-blur-3xl pt-24 pb-10 px-6 overflow-y-auto border-l border-white/50 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-center text-gray-400 text-sm font-semibold tracking-widest uppercase mb-8">Menu Navigasi</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition group ${
                        isActive 
                          ? 'bg-cyan-50 border-cyan-200 shadow-sm' 
                          : 'hover:bg-cyan-50 border-transparent hover:border-cyan-200'
                      }`}
                    >
                      <span className={`text-lg font-bold transition ${isActive ? 'text-teal-700' : 'text-gray-700 group-hover:text-teal-700'}`}>{link.name}</span>
                      {isActive ? <Heart size={16} className="text-teal-500 fill-teal-500 ml-auto" /> : <Heart size={16} className="opacity-0 group-hover:opacity-100 text-red-400 transition-opacity ml-auto" fill="currentColor" />}
                    </motion.a>
                  );
                })}
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-400 text-sm">Created with 💕 for us</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
