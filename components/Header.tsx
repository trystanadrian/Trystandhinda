'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, Menu, X, Heart } from 'lucide-react';
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

export default function Header() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Inisialisasi Audio (Pastikan file 'music.mp3' ada di folder public)
    audioRef.current = new Audio('/music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch(() => setIsMusicPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

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
            {/* Music Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMusicPlaying(!isMusicPlaying)}
              className={`p-2.5 rounded-full transition shadow-sm border ${isMusicPlaying ? 'bg-cyan-100 border-cyan-300 text-cyan-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              title="Toggle Music"
            >
              <Music size={20} />
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
