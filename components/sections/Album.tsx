'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Heart, ChevronRight, ChevronLeft, Book, Sparkles, Star, X, ArrowRight, ArrowLeft, Plus, Palette, RotateCw, Maximize2 } from 'lucide-react';

interface Photo {
  id: number;
  image: string;
  story: string;
  date: string;
  emotion: string;
}

interface Album {
  id: number;
  title: string;
  cover: string;
  month: string;
  year: number;
  photos: Photo[];
}

// CARA NAMBAH FOTO LOCAL:
// 1. Masukkan foto ke folder 'public' (misal: public/images/foto1.jpg)
// 2. Gunakan path '/images/foto1.jpg' di properti cover atau image di bawah ini

const mockAlbums: Album[] = [
  {
    id: 5,
    title: 'Red String',
    cover: '/images/Album/3.webp',
    month: 'April',
    year: 2017,
    photos: [
      {
        id: 101,
        image: '/images/Album/3.webp',
        story: 'Awal mula benang merah kita terjalin. Takdir yang membawa kita sampai di titik ini.',
        date: 'April 2017',
        emotion: 'Destiny ❤️',
      },
    ],
  },
  {
    id: 1,
    title: 'First Date',
    cover: '/images/Album/4.webp',
    month: 'Desember',
    year: 2025,
    photos: [
      {
        id: 1,
        image: '/images/Album/4.webp',
        story: 'Our first date! I was so nervous karena lama ngga ketemuu. Bahagiaa koo meski agak gugup',
        date: '28 Desember 2025',
        emotion: 'happy but a lil nervous 💕',
      },
    ],
  },
  {
    id: 2,
    title: 'Valentine Special',
    cover: '/images/Album/5.mp4',
    month: 'Februari',
    year: 2026,
    photos: [
      {
        id: 1,
        image: '/images/Album/5.mp4',
        story: 'Valentine ini spesial... kita LDR,',
        date: '14 Februari 2026',
        emotion: 'My lovely Valentine Gift 🥰',
      },
    ],
  },
  {
    id: 4,
    title: 'Late Night Calls',
    cover: '/images/Album/12.webp',
    month: 'Februari - Maret',
    year: 2026,
    photos: [
      {
        id: 1,
        image: '/images/Album/12.webp',
        story: 'Screenshot pas kita video call sampe ketiduran.',
        date: '1 Maret 2026',
        emotion: 'Rindu itu berat 🥺',
      },
    ],
  },
];

// --- Layout Components ---

const renderMedia = (src: string, className: string, onClick?: () => void) => {
  const isVideo = src.toLowerCase().match(/\.(mp4|mov|webm)$/);
  if (isVideo) {
    // Special handling for 8.mp4 rotation
    const isRotated = src.includes('8.mp4');
    let finalClassName = className;
    
    if (isRotated) {
      finalClassName = className.replace('object-cover', 'object-contain') + ' rotate-[-90deg] scale-[1.7]';
    }

    return (
      <video
        src={src}
        className={finalClassName}
        onClick={onClick}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return <img src={src} alt="memory" className={className} onClick={onClick} />;
};

const PolaroidLayout = ({ data, onZoom }: { data: Photo; onZoom: (url: string) => void }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/crumple.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-2 md:p-6 bg-transparent relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <motion.div
        drag
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        onDragStart={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
        whileHover={{ scale: 1.05, rotate: Math.random() * 6 - 3, cursor: 'grab', zIndex: 20 }}
        whileDrag={{ scale: 1.1, rotate: 0, cursor: 'grabbing', zIndex: 20 }}
        className="bg-white p-2 pb-6 md:p-4 md:pb-12 shadow-xl rotate-2 relative max-w-[85%] md:max-w-[85%] w-full"
      >
        <div className="aspect-square md:aspect-square overflow-hidden bg-gray-100 mb-2 border border-gray-100 cursor-zoom-in" onClick={() => onZoom(data.image)}>
          {renderMedia(data.image, "w-full h-full object-contain md:object-cover filter contrast-110 pointer-events-none")}
        </div>
        <p className="font-playfair text-center text-gray-800 absolute bottom-2 md:bottom-4 left-0 right-0 italic text-[10px] md:text-sm pointer-events-none">{data.date}</p>
      </motion.div>
      <div className="mt-2 md:mt-8 relative z-10 bg-white/80 backdrop-blur-sm p-2 md:p-4 rounded-lg shadow-sm border border-gray-100 max-w-full pointer-events-none">
        <p className="text-center font-serif text-gray-700 italic text-[10px] md:text-sm leading-snug">"{data.story}"</p>
        <div className="mt-1 md:mt-2 flex justify-center items-center gap-1 md:gap-2 text-[10px] md:text-xs text-rose-500 font-semibold uppercase tracking-wider">
            <Heart size={10} className="md:w-3 md:h-3" fill="currentColor" /> {data.emotion}
        </div>
      </div>
    </div>
  );
};

const FullLayout = ({ data, onZoom }: { data: Photo; onZoom: (url: string) => void }) => (
  <div className="relative w-full h-full overflow-hidden bg-gray-900">
    {renderMedia(data.image, "w-full h-full object-cover cursor-zoom-in", () => onZoom(data.image))}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-10 text-white">
      <div className="border-l-2 md:border-l-4 border-teal-400 pl-3 md:pl-4 mb-2">
        <p className="font-playfair text-base md:text-3xl font-bold mb-1 md:mb-2">{data.date}</p>
        <p className="text-[10px] md:text-base opacity-90 italic leading-relaxed text-justify">"{data.story}"</p>
      </div>
      <div className="mt-2 md:mt-4 flex gap-2">
        <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-xs font-medium border border-white/30">
          {data.emotion}
        </span>
      </div>
    </div>
  </div>
);

const ScrapbookLayout = ({ data, onZoom }: { data: Photo; onZoom: (url: string) => void }) => {
  const [notes, setNotes] = useState<{ id: number; text: string; color: string; x: number; y: number; width: number; height: number; rotation: number }[]>([]);

  // Load notes from localStorage on mount or when data changes
  useEffect(() => {
    const storageKey = `scrapbook_notes_${data.image}`;
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        // Migration for old notes without size/rotation
        const migrated = parsed.map((n: any) => ({
          ...n,
          width: n.width || 150,
          height: n.height || 150,
          rotation: n.rotation !== undefined ? n.rotation : (Math.random() * 10 - 5)
        }));
        setNotes(migrated);
      } catch (e) {
        console.error('Error parsing notes:', e);
        setNotes([]);
      }
    } else {
      setNotes([]);
    }
  }, [data.image]);

  // Helper to save notes
  const saveNotes = (newNotes: typeof notes) => {
    setNotes(newNotes);
    const storageKey = `scrapbook_notes_${data.image}`;
    localStorage.setItem(storageKey, JSON.stringify(newNotes));
  };

  const addNote = (color: string) => {
    saveNotes([...notes, { id: Date.now(), text: '', color, x: 50, y: 50, width: 150, height: 150, rotation: Math.random() * 10 - 5 }]);
  };

  const deleteNote = (id: number) => {
    saveNotes(notes.filter((n) => n.id !== id));
  };

  const updateNoteText = (id: number, text: string) => {
    saveNotes(notes.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const updateNotePosition = (id: number, x: number, y: number) => {
    saveNotes(notes.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  const updateNoteSize = (id: number, width: number, height: number) => {
    saveNotes(notes.map((n) => (n.id === id ? { ...n, width, height } : n)));
  };

  const updateNoteRotation = (id: number, rotation: number) => {
    saveNotes(notes.map((n) => (n.id === id ? { ...n, rotation } : n)));
  };

  const handleResizeStart = (e: React.PointerEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = note.width;
    const startHeight = note.height;

    const onMove = (moveEvent: PointerEvent) => {
      const newWidth = Math.max(100, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(100, startHeight + (moveEvent.clientY - startY));
      updateNoteSize(id, newWidth, newHeight);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleRotateStart = (e: React.PointerEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    const handle = e.currentTarget as HTMLElement;
    const noteElement = handle.parentElement;
    if (!noteElement) return;
    
    const rect = noteElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const initialRotation = note.rotation;

    const onMove = (moveEvent: PointerEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
      const delta = currentAngle - startAngle;
      updateNoteRotation(id, initialRotation + delta);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className="w-full h-full p-2 md:p-6 relative overflow-hidden bg-[#fdfbf7] flex flex-col justify-center items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#444 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
      
      {/* Add Note Buttons */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-50 flex flex-col gap-1 md:gap-2">
        <button
          onClick={() => addNote('bg-yellow-200')}
          className="p-1.5 md:p-2 bg-yellow-300 text-yellow-900 rounded-full shadow-lg hover:bg-yellow-400 transition-colors"
          title="Catatan Kuning"
        >
          <Plus size={12} className="md:w-4 md:h-4" />
        </button>
        <button
          onClick={() => addNote('bg-pink-200')}
          className="p-1.5 md:p-2 bg-pink-300 text-pink-900 rounded-full shadow-lg hover:bg-pink-400 transition-colors"
          title="Catatan Pink"
        >
          <Plus size={12} className="md:w-4 md:h-4" />
        </button>
        <button
          onClick={() => addNote('bg-blue-200')}
          className="p-1.5 md:p-2 bg-blue-300 text-blue-900 rounded-full shadow-lg hover:bg-blue-400 transition-colors"
          title="Catatan Biru"
        >
          <Plus size={12} className="md:w-4 md:h-4" />
        </button>
      </div>

      {/* Decorations */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 text-yellow-400 opacity-80 animate-pulse"><Star size={20} className="md:w-8 md:h-8" fill="currentColor" /></div>
      <div className="absolute bottom-10 left-2 md:bottom-20 md:left-4 text-pink-400 opacity-60"><Heart size={16} className="md:w-6 md:h-6" fill="currentColor" /></div>
      <div className="absolute top-1/2 right-2 w-16 h-16 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      
      {/* Photo */}
      <div className="relative bg-white p-1 md:p-2 shadow-lg rotate-[-3deg] border-2 md:border-4 border-white max-w-[85%] md:max-w-[80%] mx-auto z-10 mt-0 md:mt-2">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-rose-200/80 rotate-1 shadow-sm z-10"></div>
          {renderMedia(data.image, "w-full aspect-[4/3] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500 cursor-zoom-in", () => onZoom(data.image))}
      </div>
      
      {/* Note */}
      <div className="mt-2 md:mt-4 bg-[#fff9c4] p-2 md:p-4 shadow-md rotate-1 border border-yellow-200 relative max-w-[90%] md:max-w-[85%] mx-auto transform hover:scale-105 transition-transform z-10">
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-200 rounded-full opacity-50"></div>
          <p className="font-playfair text-gray-800 font-bold text-sm md:text-lg mb-0.5 md:mb-1">Dear Diary,</p>
          <p className="font-serif text-gray-700 text-[10px] md:text-sm leading-tight md:leading-relaxed text-justify">{data.story}</p>
          <p className="text-[8px] md:text-xs text-gray-500 mt-1 md:mt-2 text-right font-mono">{data.date}</p>
      </div>

      {/* Sticky Notes */}
      {notes.map((note) => (
        <motion.div
          key={note.id}
          drag
          dragMomentum={false}
          initial={{ scale: 0, rotate: note.rotation }}
          animate={{ scale: 1, rotate: note.rotation, width: note.width, height: note.height }}
          style={{ x: note.x, y: note.y }}
          onPointerDown={(e) => e.stopPropagation()}
          onDragEnd={(e, info) => {
            updateNotePosition(note.id, note.x + info.offset.x, note.y + info.offset.y);
          }}
          whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 50 }}
          className={`absolute ${note.color} shadow-md p-3 z-40 group`}
        >
          <div className="w-full h-full relative">
            <textarea
              className="w-full h-full bg-transparent resize-none outline-none text-gray-800 font-serif text-sm placeholder-gray-500/50"
              placeholder="Tulis catatan..."
              value={note.text}
              onChange={(e) => updateNoteText(note.id, e.target.value)}
            />
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>

            {/* Resize Handle */}
            <div 
              className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center text-gray-500/50 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
              onPointerDown={(e) => handleResizeStart(e, note.id)}
            >
              <Maximize2 size={12} className="transform rotate-90" />
            </div>

            {/* Rotate Handle */}
            <div 
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 cursor-grab flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200 text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
              onPointerDown={(e) => handleRotateStart(e, note.id)}
            >
              <RotateCw size={12} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const ChapterLayout = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="w-full h-full flex items-center justify-center p-2 md:p-6">
    <div className="w-full h-full flex flex-col items-center justify-center bg-teal-50/30 p-4 md:p-8 border-2 md:border-4 border-double border-teal-100 rounded-lg text-center">
      <div className="mb-2 md:mb-4 inline-block p-2 md:p-3 bg-white rounded-full shadow-md">
        <Book size={20} className="md:w-8 md:h-8 text-teal-600" />
      </div>
      <h2 className="text-xl md:text-4xl font-playfair font-bold text-teal-900 mb-1 md:mb-2">{title}</h2>
      <div className="h-0.5 md:h-1 w-12 md:w-20 bg-teal-300 mx-auto mb-2 md:mb-4 rounded-full"></div>
      <p className="text-gray-600 font-serif italic text-xs md:text-base">{subtitle}</p>
    </div>
  </div>
);

const IntroLayout = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-[#fdfbf7] p-4 md:p-8 text-center">
    <h1 className="text-2xl md:text-5xl font-playfair font-bold text-amber-950 mb-2 md:mb-4">Our Story</h1>
    <p className="text-sm md:text-lg text-gray-600 font-serif italic mb-4 md:mb-8">"Every picture tells a story, but ours is my favorite."</p>
    <div className="flex gap-1 md:gap-2 text-rose-400">
      <Heart fill="currentColor" size={14} className="md:w-5 md:h-5" />
      <Heart fill="currentColor" size={14} className="md:w-5 md:h-5" />
      <Heart fill="currentColor" size={14} className="md:w-5 md:h-5" />
    </div>
    <p className="mt-6 md:mt-12 text-[10px] md:text-sm text-gray-400 uppercase tracking-widest">Volume 1 • 2017</p>
  </div>
);

const OverviewLayout = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-[#fdfbf7] p-2 md:p-8 relative border-2 md:border-8 border-double border-teal-50">
    <div className="absolute top-2 left-2 md:top-4 md:left-4 text-teal-200"><Sparkles size={16} className="md:w-6 md:h-6" /></div>
    <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-rose-200"><Heart size={16} className="md:w-6 md:h-6" /></div>
    
    <h2 className="text-lg md:text-4xl font-playfair font-bold text-teal-900 mb-4 md:mb-8 border-b md:border-b-2 border-teal-200 pb-1 md:pb-4">Our Journey</h2>
    
    <div className="space-y-2 md:space-y-6 w-full max-w-[200px] md:max-w-xs">
      <div className="flex items-center gap-2 md:gap-4 group">
        <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs md:text-base group-hover:scale-110 transition">1</div>
        <div>
          <p className="font-bold text-gray-800 text-xs md:text-base">2017</p>
          <p className="text-[10px] md:text-sm text-gray-500 italic">Where it all began</p>
        </div>
      </div>
      
      <div className="w-0.5 h-2 md:h-6 bg-gray-200 ml-3 md:ml-5"></div>
      
      <div className="flex items-center gap-2 md:gap-4 group">
        <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs md:text-base group-hover:scale-110 transition">2</div>
        <div>
          <p className="font-bold text-gray-800 text-xs md:text-base">2025</p>
          <p className="text-[10px] md:text-sm text-gray-500 italic">Reconnected</p>
        </div>
      </div>

      <div className="w-0.5 h-2 md:h-6 bg-gray-200 ml-3 md:ml-5"></div>

      <div className="flex items-center gap-2 md:gap-4 group">
        <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs md:text-base group-hover:scale-110 transition">3</div>
        <div>
          <p className="font-bold text-gray-800 text-xs md:text-base">2026</p>
          <p className="text-[10px] md:text-sm text-gray-500 italic">Building future</p>
        </div>
      </div>
    </div>
  </div>
);

const ConfessionLayout = ({ part }: { part: 1 | 2 }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-[#0f0f0f] text-white p-2 md:p-12 relative overflow-hidden border-2 md:border-4 border-double border-rose-900/40">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-rose-900/10 to-transparent pointer-events-none"></div>
    
    {part === 1 ? (
      <div className="relative z-10 max-w-md text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-2 md:mb-8 text-rose-400 opacity-90"
        >
            <Sparkles size={24} className="mx-auto animate-pulse md:w-10 md:h-10" />
        </motion.div>
        <h3 className="font-playfair text-sm md:text-3xl mb-2 md:mb-6 text-rose-200 tracking-[0.2em] uppercase border-b border-rose-800 pb-1 md:pb-4 inline-block">The Truth</h3>
        <p className="font-serif italic leading-snug md:leading-loose text-gray-300 text-[9px] md:text-lg">
          "Mungkin awalnya terasa seperti kamu yang memulai, tapi sebenarnya hati kita bergerak di frekuensi yang sama. Cinta ini bukan tentang siapa yang lebih dulu, tapi tentang kita yang saling menyambut..."
        </p>
      </div>
    ) : (
      <div className="relative z-10 max-w-md text-center">
        <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 text-rose-500/10 animate-spin-slow"><Star size={60} className="md:w-[120px] md:h-[120px]" /></div>
        <p className="font-playfair text-[10px] md:text-2xl mb-2 md:mb-8 leading-snug md:leading-relaxed text-white/90">
          "...bahwa seiring berjalannya waktu, rasa sayangku tumbuh jauh lebih besar. Makin lama, makin dalam, makin tak tergantikan. Aku makin sayang kamu."
        </p>
        <div className="mt-2 md:mt-8">
           <p className="text-rose-400 font-mono text-[10px] md:text-xs tracking-[0.3em]">10 FEBRUARI 2026</p>
        </div>
      </div>
    )}
  </div>
);

const CollageLayout = ({ text, subtext, variant, onZoom }: { text: string, subtext?: string, variant: 1 | 2, onZoom: (url: string) => void }) => {
  const photos1 = [
    '/images/Album/6.webp',
    '/images/Album/7.webp',
    '/images/Album/8.mp4',
  ];
  const photos2 = [
    '/images/Album/9.webp',
    '/images/Album/10.webp',
    '/images/Album/11.mov',
  ];

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#fdfbf7] p-2 md:p-4 flex flex-col items-center justify-center">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
      
      <div className="relative z-10 text-center mb-2 md:mb-6">
         <h3 className="text-lg md:text-3xl font-playfair font-bold text-teal-900 mb-1 md:mb-2 drop-shadow-sm">
            {text}
         </h3>
         {subtext && <p className="text-xs md:text-base text-rose-500 font-serif italic">{subtext}</p>}
      </div>

      <div className="w-full flex-1 grid gap-2 md:gap-4 grid-cols-2">
         {(variant === 1 ? photos1 : photos2).map((src, i) => (
             <div key={i} className={`relative rounded-lg overflow-hidden shadow-md transition duration-300 ${
                variant === 1 
                  ? 'border-4 border-white transform hover:scale-105 ' + (i === 2 ? 'col-span-2 aspect-[2/1]' : 'aspect-square')
                  : 'border-2 border-gray-200 hover:shadow-xl ' + (i === 0 ? 'col-span-2 aspect-[16/9]' : 'col-span-1 aspect-[4/3]')
             }`}>
                 {renderMedia(src, "w-full h-full object-cover cursor-zoom-in", () => onZoom(src))}
             </div>
         ))}
      </div>
    </div>
  );
};

const FutureLayout = ({ onZoom }: { onZoom: (url: string) => void }) => (
  <div className="w-full h-full flex flex-col items-center bg-gradient-to-b from-blue-50 to-pink-50 p-2 md:p-4 relative overflow-hidden">
    <div className="absolute top-4 left-4 text-blue-300"><Sparkles size={24} /></div>
    <div className="absolute bottom-4 right-4 text-pink-300"><Heart size={24} /></div>
    
    {/* Small Love Icon Top Right */}
    <div className="absolute top-4 right-4 text-rose-400"><Heart size={16} fill="currentColor" /></div>

    <div className="text-center mb-1 md:mb-2 mt-1 md:mt-2 z-10">
      <h2 className="text-lg md:text-3xl font-playfair font-bold text-gray-800 mb-0 md:mb-2">Our Future</h2>
      <p className="text-gray-600 font-serif italic text-[10px] md:text-base">"Katanya mau 2 anak, cowok sama cewek"</p>
    </div>

    <div className="flex-1 w-full flex flex-col items-center justify-center gap-1 md:gap-3 max-w-5xl z-10">
      <div className="flex flex-col items-center w-full max-w-[170px] md:max-w-[240px]">
        <div className="w-full aspect-[16/9] bg-white p-1 md:p-2 shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-300 rounded-sm border border-gray-100">
           {renderMedia("/images/Album/13.webp", "w-full h-full object-cover cursor-zoom-in", () => onZoom("/images/Album/13.webp"))}
        </div>
        <span className="mt-1 md:mt-2 text-blue-600 font-bold text-[10px] md:text-sm bg-white/80 px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-sm backdrop-blur-sm">Boy 👦</span>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-[170px] md:max-w-[240px]">
        <div className="w-full aspect-[16/9] bg-white p-1 md:p-2 shadow-xl rotate-[2deg] hover:rotate-0 transition-transform duration-300 rounded-sm border border-gray-100">
           {renderMedia("/images/Album/14.webp", "w-full h-full object-cover cursor-zoom-in", () => onZoom("/images/Album/14.webp"))}
        </div>
        <span className="mt-1 md:mt-2 text-pink-600 font-bold text-[10px] md:text-sm bg-white/80 px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-sm backdrop-blur-sm">Girl 👧</span>
      </div>
    </div>
  </div>
);

// --- Helper to generate pages ---

const generatePages = (albums: Album[]) => {
  const pages: any[] = [];
  
  // Page 0: Intro (Left side usually blank or inner cover, but let's make it Intro)
  pages.push({ type: 'intro' });

  // Page 1: Overview
  pages.push({ type: 'overview' });

  // Page 2: Trystan's Photo
  pages.push({ 
    type: 'full', 
    data: {
      id: 998,
      image: '/images/Album/1.webp',
      story: 'Trystan Adrian Hanggara Wibawa',
      date: 'The King',
      emotion: '👑',
    }
  });

  // Page 3: Dhinda's Photo
  pages.push({ 
    type: 'full', 
    data: {
      id: 999,
      image: '/images/Album/2.webp',
      story: 'Dhinda Aura Sukma',
      date: 'The Queen',
      emotion: '👸',
    }
  });
  
  albums.forEach((album, idx) => {
    // Insert Confessions before Valentine Special (id 2)
    if (album.id === 2) {
      pages.push({ type: 'confession', part: 1 });
      pages.push({ type: 'confession', part: 2 });
    }

    // Chapter Page
    pages.push({ 
      type: 'chapter', 
      title: album.title, 
      subtitle: `${album.month} ${album.year}` 
    });
    
    // Photos
    album.photos.forEach((photo, pIdx) => {
      // Cycle through layouts for variety
      const layoutType = ['polaroid', 'scrapbook', 'full'][(idx + pIdx) % 3];
      pages.push({ type: layoutType, data: photo });
    });

    // Insert Collage Pages after Valentine Special (id 2)
    if (album.id === 2) {
      pages.push({ type: 'collage', text: "Tapii ngga beneran LDR koo", variant: 1 });
      pages.push({ type: 'collage', text: "15-16 Februari 2026", subtext: "Our Special Days", variant: 2 });
    }
  });

  // Add Future Page
  pages.push({ type: 'future' });

  // Ensure even number of pages for spreads
  if (pages.length % 2 !== 0) {
    pages.push({ type: 'chapter', title: 'To Be Continued...', subtitle: 'More memories coming soon' });
  }

  return pages;
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Album() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0 means spread 0 (Page 0 & Page 1)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const pages = useMemo(() => generatePages(mockAlbums), []);
  const totalSpreads = Math.ceil(pages.length / 2);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [coverColor, setCoverColor] = useState('#8b5a2b');

  // Motion values for drag effect
  const x = useMotionValue(0);
  const leftPageShadow = useTransform(x, [0, 200], [0, 0.4]);
  const rightPageShadow = useTransform(x, [0, -200], [0, 0.4]);

  useEffect(() => {
    const savedColor = localStorage.getItem('albumCoverColor');
    if (savedColor) setCoverColor(savedColor);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio('/paper-flip.mp3');
  }, []);

  const playFlipSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const nextPage = () => {
    if (currentPage < totalSpreads - 1) {
      playFlipSound();
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      playFlipSound();
      setCurrentPage(prev => prev - 1);
    }
  };

  const renderPageContent = (page: any, onZoom: (url: string) => void) => {
    if (!page) return <div className="w-full h-full bg-[#fdfbf7]"></div>;
    
    switch (page.type) {
      case 'intro': return <IntroLayout />;
      case 'overview': return <OverviewLayout />;
      case 'confession': return <ConfessionLayout part={page.part} />;
      case 'collage': return <CollageLayout text={page.text} subtext={page.subtext} variant={page.variant} onZoom={onZoom} />;
      case 'future': return <FutureLayout onZoom={onZoom} />;
      case 'chapter': return <ChapterLayout title={page.title} subtitle={page.subtitle} />;
      case 'polaroid': return <PolaroidLayout data={page.data} onZoom={onZoom} />;
      case 'full': return <FullLayout data={page.data} onZoom={onZoom} />;
      case 'scrapbook': return <ScrapbookLayout data={page.data} onZoom={onZoom} />;
      default: return null;
    }
  };

  const leatherStyle = {
    backgroundColor: coverColor,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.5)'
  };

  return (
    <section id="album" className="py-24 px-4 md:px-12 bg-gradient-to-b from-transparent to-cyan-50/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            📷 Album Kebersamaan
          </h2>
          <p className="text-lg text-teal-700 leading-relaxed">Buku kenangan kita dalam setiap halaman</p>
        </motion.div>

        {/* Color Picker Control */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-wrap justify-center items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-teal-100 shadow-sm">
            <Palette size={18} className="text-teal-700" />
            <span className="text-sm text-teal-800 font-medium">Warna Cover:</span>
            <input 
              type="color" 
              value={coverColor}
              onChange={(e) => {
                setCoverColor(e.target.value);
                localStorage.setItem('albumCoverColor', e.target.value);
              }}
              className="w-8 h-8 rounded-full cursor-pointer border-0 bg-transparent p-0"
            />
          </div>
        </motion.div>

        {/* Book Container */}
        <div className="flex justify-center items-center py-10 perspective-[2000px]">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              // Closed Book (Cover)
              <motion.div
                key="cover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                onClick={() => {
                  playFlipSound();
                  setIsOpen(true);
                }}
                className="relative w-[70vw] max-w-[300px] md:w-[400px] aspect-[3/4] cursor-pointer group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Book Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-amber-900 rounded-l-lg transform -translate-x-6 translate-z-[-20px] rotate-y-[-90deg]"></div>
                
                {/* Cover Design */}
                <div className="absolute inset-0 rounded-r-lg rounded-l-sm shadow-2xl flex flex-col items-center justify-center p-8 border-l-8 border-[#5c3a1b] transform transition-transform group-hover:-translate-y-2 group-hover:rotate-y-[-5deg]" style={leatherStyle}>
                  <div className="absolute inset-0 border-2 border-[#a67c52] m-4 rounded-r-md rounded-l-sm"></div>
                  <div className="absolute top-10 text-[#d4b483] opacity-50"><Sparkles size={40} /></div>
                  
                  <h1 className="text-5xl md:text-6xl font-playfair font-bold text-[#f3e5ab] text-center mb-4 drop-shadow-md">
                    Our<br/>Album
                  </h1>
                  <div className="h-1 w-20 bg-[#d4b483] mb-4"></div>
                  <p className="text-[#d4b483] font-serif italic text-lg">Trystan & Dhinda</p>
                  
                  <div className="absolute bottom-10 text-[#d4b483] text-sm font-serif">EST. 2017</div>
                </div>
                
                {/* Pages Edge Effect */}
                <div className="absolute top-2 bottom-2 right-0 w-4 bg-white rounded-r-sm transform translate-x-2 translate-z-[-10px] shadow-inner" style={{ background: 'linear-gradient(to right, #eee 1px, transparent 1px)', backgroundSize: '2px 100%' }}></div>
                
                <div className="absolute -bottom-12 left-0 right-0 text-center text-teal-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Klik untuk membuka ✨
                </div>
              </motion.div>
            ) : (
              // Open Book (Spread)
              <motion.div
                key="open-book"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ x }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    nextPage();
                  } else if (swipe > swipeConfidenceThreshold) {
                    prevPage();
                  }
                }}
                className="relative w-full md:max-w-[1000px] aspect-square md:aspect-[3/2] flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                {/* Book Wrapper */}
                <div className="relative w-full h-full rounded-xl shadow-2xl p-2 md:p-4 flex" style={leatherStyle}>
                  {/* Left Page */}
                  <div className="flex-1 bg-[#fdfbf7] rounded-l-lg shadow-inner relative overflow-hidden border-r border-gray-200" style={{ perspective: '1000px' }}>
                    <div className="absolute inset-0 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.1)] pointer-events-none z-10"></div>
                    
                    {/* Dynamic Drag Shadow */}
                    <motion.div 
                      style={{ opacity: leftPageShadow }}
                      className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-30"
                    />

                    <div className="w-full h-full">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`left-${currentPage}`}
                          initial={{ rotateY: 90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          exit={{ rotateY: 90, opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          style={{ transformOrigin: 'right center' }}
                          className="w-full h-full"
                        >
                          {renderPageContent(pages[currentPage * 2], setZoomedImage)}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="absolute bottom-4 left-6 text-gray-400 text-xs font-mono z-20">{currentPage * 2 + 1}</div>
                  </div>

                  {/* Spine/Gutter */}
                  <div className="w-0 md:w-12 bg-gradient-to-r from-[#e0e0e0] via-[#f5f5f5] to-[#e0e0e0] relative z-20 shadow-inner opacity-50"></div>

                  {/* Bookmark Ribbon */}
                  <motion.div 
                    key={currentPage}
                    animate={{ rotate: [0, -8, 6, -4, 2, 0] }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-[110%] z-30 pointer-events-none filter drop-shadow-md origin-top"
                  >
                    <div className="w-full h-full bg-red-700 relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent"></div>
                    </div>
                  </motion.div>

                  {/* Right Page */}
                  <div className="flex-1 bg-[#fdfbf7] rounded-r-lg shadow-inner relative overflow-hidden border-l border-gray-200" style={{ perspective: '1000px' }}>
                    <div className="absolute inset-0 shadow-[inset_10px_0_20px_rgba(0,0,0,0.1)] pointer-events-none z-10"></div>
                    
                    {/* Dynamic Drag Shadow */}
                    <motion.div 
                      style={{ opacity: rightPageShadow }}
                      className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-30"
                    />

                    <div className="w-full h-full">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`right-${currentPage}`}
                          initial={{ rotateY: -90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          exit={{ rotateY: -90, opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          style={{ transformOrigin: 'left center' }}
                          className="w-full h-full"
                        >
                          {renderPageContent(pages[currentPage * 2 + 1], setZoomedImage)}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="absolute bottom-4 right-6 text-gray-400 text-xs font-mono z-20">{currentPage * 2 + 2}</div>
                  </div>

                  {/* Navigation Instructions */}
                  <div className="absolute -bottom-16 md:-bottom-12 left-0 right-0 text-center text-teal-700 font-medium opacity-70 text-sm md:text-base">
                    Geser halaman untuk membalik ↔️
                  </div>

                  {/* Close Button */}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-4 -right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition hover:scale-110 z-50"
                    title="Tutup Buku"
                  >
                    <X size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={zoomedImage} alt="Zoomed memory" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
              {zoomedImage.toLowerCase().match(/\.(mp4|mov|webm)$/) ? (
                <video src={zoomedImage} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" controls autoPlay />
              ) : (
                <img src={zoomedImage} alt="Zoomed memory" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
              )}
              <button 
                onClick={() => setZoomedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
              >
                <X size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
