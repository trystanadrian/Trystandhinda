'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo, AnimatePresence, useAnimation } from 'framer-motion';
import { Mail, Heart, Gift, Sparkles, X, Lock } from 'lucide-react';

import Header from '@/components/Header';
import StarBackground from '@/components/StarBackground';

import Hero from '@/components/sections/Hero';
// Sections
import Timeline from '@/components/sections/Timeline';
import Surprise from '@/components/sections/Surprise';
import Globe3D from '@/components/sections/Globe3D';
import LoveLetter from '@/components/sections/LoveLetter';
import Album from '@/components/sections/Album';
import MemoryLane from '@/components/sections/MemoryLane';
import Wishlist from '@/components/sections/Wishlist';
import PhotoGallery from '@/components/sections/PhotoGallery';
import VoiceNotes from '@/components/sections/VoiceNotes';
import MoodTracker from '@/components/sections/MoodTracker';
import MessageScheduler from '@/components/sections/MessageScheduler';

// Daftar Section yang akan ditampilkan di Carousel (13 existing components)
const sections = [
  { id: 'album', icon: '📷', component: <Album />, title: 'Album', gradient: 'linear-gradient(to bottom right, #fff1f2, #ffe4e6, #fecdd3)' },
  { id: 'memorylane', icon: '🎞️', component: <MemoryLane />, title: 'Memory Lane', gradient: 'linear-gradient(to bottom right, #fffbeb, #fef3c7, #fde68a)' },
  { id: 'timeline', icon: '🕰️', component: <Timeline />, title: 'Timeline', gradient: 'linear-gradient(to bottom right, #eff6ff, #dbeafe, #bfdbfe)' },
  { id: 'wishlist', icon: '✅', component: <Wishlist />, title: 'Wishlist', gradient: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7, #bbf7d0)' },
  { id: 'gallery', icon: '🖼️', component: <PhotoGallery />, title: 'Gallery', gradient: 'linear-gradient(to bottom right, #faf5ff, #f3e8ff, #d8b4fe)' },
  { id: 'ldr-tracker', icon: '📍', component: <Globe3D />, title: 'LDR Tracker', gradient: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe, #bae6fd)' },
  { id: 'voicenotes', icon: '🎤', component: <VoiceNotes />, title: 'Voice Notes', gradient: 'linear-gradient(to bottom right, #fdf4ff, #fae8ff, #f0abfc)' },
  { id: 'moodtracker', icon: '📅', component: <MoodTracker />, title: 'Mood Tracker', gradient: 'linear-gradient(to bottom right, #f5f3ff, #ede9fe, #ddd6fe)' },
  { id: 'messages', icon: '⏰', component: <MessageScheduler />, title: 'Messages', gradient: 'linear-gradient(to bottom right, #ecfeff, #cffafe, #a5f3fc)' },
  { id: 'loveletter', icon: '💌', component: <LoveLetter />, title: 'Love Letter', gradient: 'linear-gradient(to bottom right, #fff1f2, #ffe4e6, #fda4af)' },
  { id: 'surprise', icon: '🎁', component: <Surprise />, title: 'Surprise', gradient: 'linear-gradient(to bottom right, #fff7ed, #ffedd5, #fed7aa)' },
];

// Set to true to unlock all sections
const ALL_SECTIONS_UNLOCKED = false;
const lockedByDefault = ['timeline', 'gallery', 'messages', 'loveletter'];

function LockedContent({ sectionId }: { sectionId: string }) {
  return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
              <Lock size={64} className="text-teal-300 mb-6" />
          </motion.div>
          <h3 className="text-3xl font-playfair font-bold text-teal-800 mb-2">Coming Soon</h3>
          <p className="text-teal-600">Fitur ini sedang dalam pengembangan dan akan segera hadir!</p>
      </div>
  );
}


function BirthdayOverlay({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'mailbox' | 'envelope' | 'letter'>('mailbox');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-center items-start pt-20 md:pt-32 bg-black/95 backdrop-blur-md p-4 overflow-y-auto"
    >
      <motion.button 
        onClick={onComplete}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-50 bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/20"
      >
        <X size={32} />
      </motion.button>

      <AnimatePresence mode="wait">
        {stage === 'mailbox' && (
          <motion.div
            key="mailbox"
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            whileHover={{ 
              scale: 1.05, 
              rotate: [0, -5, 5, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
            className="relative cursor-pointer group flex flex-col items-center"
            onClick={() => setStage('envelope')}
          >
            <div className="relative">
              {/* Post Pole */}
              <div className="w-4 h-32 bg-gray-800 mx-auto translate-y-[-10px]"></div>
              {/* Mailbox Body */}
              <div className="relative w-48 h-32 bg-red-600 rounded-t-full rounded-b-md border-4 border-red-800 shadow-xl z-10 flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500 to-red-700"></div>
                <Mail className="absolute top-2 right-2 text-white/20" size={40} />
                <div className="relative z-10 text-white font-bold text-2xl tracking-widest opacity-80">MAIL</div>
                {/* Slot */}
                <div className="absolute bottom-6 w-32 h-2 bg-black/30 rounded-full"></div>
              </div>
              {/* Flag */}
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                className="absolute top-10 right-[-10px] w-2 h-20 bg-gray-400 origin-bottom z-0"
                style={{ transform: 'rotate(20deg)' }}
              >
                <div className="w-8 h-5 bg-red-600 absolute top-0 -right-6 rounded-sm"></div>
              </motion.div>
            </div>
            
            <div className="mt-8 bg-white px-6 py-3 rounded-full shadow-lg whitespace-nowrap animate-bounce text-center">
              <span className="text-red-500 font-bold text-lg">Ada surat buat kamu! 📬</span>
              <p className="text-xs text-gray-400">(Klik kotaknya)</p>
            </div>
          </motion.div>
        )}

        {stage === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            onClick={() => setStage('letter')}
            className="cursor-pointer relative transform scale-110 md:scale-125"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-80 h-56 bg-rose-100 rounded-lg shadow-[0_0_50px_rgba(244,63,94,0.4)] flex items-center justify-center border-4 border-rose-200 relative overflow-hidden hover:shadow-[0_0_70px_rgba(244,63,94,0.6)] transition-shadow"
            >
              {/* Envelope Flap */}
              <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-0 h-0 border-l-[160px] border-l-transparent border-t-[110px] border-t-rose-300 border-r-[160px] border-r-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[160px] border-l-rose-200 border-b-[110px] border-b-rose-200 border-r-[160px] border-r-transparent"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[160px] border-r-rose-200 border-b-[110px] border-b-rose-200 border-l-[160px] border-l-transparent"></div>
              
              {/* Seal */}
              <div className="absolute top-[90px] left-1/2 -translate-x-1/2 z-20 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-4 border-red-600">
                <Heart size={30} fill="white" className="text-white" />
              </div>
            </motion.div>
            <div className="mt-10 text-center">
              <p className="text-white text-2xl md:text-3xl font-bold animate-pulse drop-shadow-lg">Untuk: Dhinda ❤️</p>
              <p className="text-white/80 text-base md:text-lg mt-2">(Klik untuk buka)</p>
            </div>
          </motion.div>
        )}

        {stage === 'letter' && (
          <motion.div
            key="letter"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="bg-[#fff1f2] p-8 md:p-14 rounded-2xl shadow-[0_0_60px_rgba(255,255,255,0.3)] max-w-2xl w-full relative text-center border-8 border-double border-rose-300 mx-4"
          >
            {/* Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 600, opacity: [0, 1, 0], rotate: 360 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: Math.random() * 4 + 3, 
                    delay: Math.random() * 5,
                    ease: "linear" 
                  }}
                  className="absolute top-0"
                  style={{ 
                    left: `${Math.random() * 100}%`,
                    color: ['#f43f5e', '#fbbf24', '#3b82f6', '#10b981'][Math.floor(Math.random() * 4)]
                  }}
                >
                  {i % 2 === 0 ? <Sparkles size={Math.random() * 15 + 10} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </motion.div>
              ))}
            </div>

            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }} 
              className="absolute -top-6 -left-6 text-yellow-400"
            >
              <Sparkles size={48} />
            </motion.div>
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }} 
              className="absolute -bottom-6 -right-6 text-yellow-400"
            >
              <Sparkles size={48} />
            </motion.div>

            <div className="relative z-10">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center shadow-inner">
                  <Gift size={40} className="text-rose-500" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-rose-600 mb-6">
                Happy 24th Birthday! 🎉
              </h2>
              
              <div className="space-y-4 text-gray-700 font-serif leading-relaxed text-lg">
                <p>Selamat ulang tahun yang ke-24, sayang! ❤️</p>
                <p>Semoga di usia yang baru ini, kamu semakin bahagia, semakin dewasa, dan semua impianmu tercapai.</p>
                <p>Maaf cuma bisa kasih website ini sebagai hadiah, tapi percayalah doa dan cintaku buat kamu jauh lebih besar dari apapun.</p>
                <p className="font-bold text-rose-500 pt-4 text-xl">I Love You Forever! 💑</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2 mx-auto"
              >
                <Heart fill="white" size={20} /> Terima Kasih Sayang
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Home() {
  const [showBirthday, setShowBirthday] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [radius, setRadius] = useState(450);
  const [isPaused, setIsPaused] = useState(false);
  const carouselControls = useAnimation();

  // Konfigurasi 3D Carousel
  const theta = 360 / sections.length; // Sudut antar item

  const unlockedSections = ALL_SECTIONS_UNLOCKED
    ? sections.map(s => s.id)
    : sections.map(s => s.id).filter(id => !lockedByDefault.includes(id));

  // Helper untuk mendapatkan index yang valid (0 - length-1) dari activeIndex yang bisa minus/lebih besar
  const getNormalizedIndex = (index: number) => ((index % sections.length) + sections.length) % sections.length;

  // Sync active section with URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const index = sections.findIndex((s) => s.id === hash);
    if (index !== -1) {
      setActiveIndex(index);
    }
    setIsLoaded(true);

    // Listen for hash changes (navigation clicks)
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const index = sections.findIndex((s) => s.id === hash);
      if (index !== -1) {
        setActiveIndex(index);
        // Scroll to content container
        setTimeout(() => {
          const element = document.getElementById('feature-content');
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Responsive Radius Configuration
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(160); // Mobile: radius lebih kecil agar tidak melebar
      } else if (window.innerWidth < 1024) {
        setRadius(300); // Tablet
      } else {
        setRadius(450); // Desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update URL hash when activeIndex changes
  useEffect(() => {
    if (isLoaded) {
      const currentSection = sections[getNormalizedIndex(activeIndex)];
      window.history.replaceState(null, '', `#${currentSection.id}`);
    }
  }, [activeIndex, isLoaded]);

  // Sync rotation animation with activeIndex
  useEffect(() => {
    carouselControls.start({ rotateY: activeIndex * -theta });
  }, [activeIndex, carouselControls, theta]);

  // Auto-rotate effect
  useEffect(() => {
    if (showBirthday || isDragging || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [showBirthday, isDragging, isPaused]);

  const nextSlide = () => {
    setActiveIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => prev - 1);
  };

  // Handle Swipe Gesture
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipeThreshold = 50;
    const velocityThreshold = 400; // Deteksi flick cepat

    if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      nextSlide();
    } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      prevSlide();
    }
  };

  return (
      <motion.div 
        className="min-h-screen flex flex-col overflow-y-auto overflow-x-hidden"
        animate={{ background: sections[getNormalizedIndex(activeIndex)].gradient }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <StarBackground />
        <Header />

        <main className="flex-grow relative flex flex-col justify-center items-center py-10">
          
          {/* Hero Section */}
          <Hero />
          
          {/* 3D Viewport Container */}
          <div 
            className="relative w-full h-[50vh] perspective-[2500px] flex items-center justify-center overflow-visible"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            
            {/* Rotating Container (Cylinder) */}
            <motion.div
              className="relative w-full h-full preserve-3d"
              animate={carouselControls}
              transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }}
              drag="x"
              dragElastic={0.2}
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(e, info) => { setIsDragging(false); handleDragEnd(e, info); }}
              style={{ 
                transformStyle: "preserve-3d",
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {sections.map((section, index) => {
                const angle = index * theta;
                const isActive = getNormalizedIndex(activeIndex) === index;
                const isLocked = !unlockedSections.includes(section.id);
                
                return (
                  <motion.div
                    key={section.id}
                    className="absolute flex flex-col items-center justify-center cursor-pointer w-24 h-24 md:w-36 md:h-36"
                    style={{
                      // Posisikan item melingkar berdasarkan sudut dan radius
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      // Sembunyikan item yang ada di belakang agar tidak berantakan
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                    onClick={() => {
                      if (isLocked && !isActive) {
                        carouselControls.start({ rotateY: (activeIndex * -theta) + (Math.random() > 0.5 ? 2 : -2), transition: { type: 'spring', stiffness: 500, damping: 5 } })
                          .then(() => carouselControls.start({ rotateY: activeIndex * -theta }));
                      }
                      // Calculate shortest path to clicked item
                      const currentNormalized = getNormalizedIndex(activeIndex);
                      let diff = index - currentNormalized;
                      if (diff > sections.length / 2) diff -= sections.length;
                      else if (diff < -sections.length / 2) diff += sections.length;
                      setActiveIndex(activeIndex + diff);
                    }}
                  >
                    {/* Card Container */}
                    <div 
                      className={`
                        relative w-full h-full aspect-square overflow-hidden rounded-3xl carousel-card
                        transition-all duration-500 ease-out flex flex-col items-center justify-center
                        ${
                          isActive 
                            ? 'opacity-100 scale-110 shadow-[0_10px_30px_rgba(6,182,212,0.3)] z-20 bg-white/60 backdrop-blur-xl border-white/80 ring-4 ring-white/30' 
                            : isLocked
                              ? 'opacity-50 grayscale-[80%] blur-[2px] z-10 bg-white/20 border-white/20 cursor-not-allowed'
                              : 'opacity-60 scale-75 grayscale-[60%] blur-[2px] z-10 bg-white/20 border-white/20 hover:opacity-90 hover:scale-90 hover:bg-white/30 hover:blur-none'
                        }
                        border-[1px]
                      `}
                    >
                      {/* Animated Gradient Background for Active */}
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 rounded-3xl">
                            <Lock size={isActive ? 40 : 32} className={isActive ? "text-white/70" : "text-white/50"} />
                        </div>
                      )}
                      {isActive && (
                        <>
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-100/50 to-rose-100/50 opacity-70" />
                          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />
                          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-rose-400/20 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                        </>
                      )}

                      {/* Icon + Title only */}
                      <span className={`relative z-10 text-4xl md:text-5xl select-none pointer-events-none transition-transform duration-500 ${isActive ? 'scale-110 drop-shadow-md' : ''}`}>{section.icon}</span>
                      <span className={`relative z-10 mt-2 text-xs md:text-sm font-bold text-teal-900 select-none pointer-events-none transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>{section.title}</span>
                    </div>

                    {/* Reflection/Shadow Effect */}
                    <div 
                      className={`
                        absolute -bottom-10 w-20 h-4 bg-black/20 blur-xl rounded-[100%] 
                        transition-all duration-500 ease-out
                        ${isActive ? 'opacity-40 scale-125' : 'opacity-0 scale-50'}
                      `}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

          </div>



          {/* Section content panel updates with active card */}
          <div 
            id="feature-content"
            className="relative w-full max-w-7xl mt-8 md:mt-12 px-2 md:px-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-gradient-to-r from-teal-200/30 via-cyan-200/30 to-blue-200/30 blur-[80px] -z-10 rounded-full opacity-60" />

            {/* Glass Container */}
            <div className="relative w-full bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden min-h-[500px] transition-all duration-500">
              
              {/* Decorative Top Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-70" />

              <div className="p-4 md:p-10">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={getNormalizedIndex(activeIndex)}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    {unlockedSections.includes(sections[getNormalizedIndex(activeIndex)].id) ? (
                      sections[getNormalizedIndex(activeIndex)].component
                    ) : (
                      <LockedContent sectionId={sections[getNormalizedIndex(activeIndex)].id} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </main>
      </motion.div>
  );
}
