'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Layers, RotateCcw, X } from 'lucide-react';

const memories = [
  {
    id: 1,
    src: '/images/MemoryLane/a.png',
    caption: '',
    rotate: -5,
  },
  {
    id: 2,
    src: '/images/MemoryLane/b.png',
    caption: '',
    rotate: 3,
  },
  {
    id: 3,
    src: '/images/MemoryLane/c.png',
    caption: '',
    rotate: -2,
  },
  {
    id: 4,
    src: '/images/MemoryLane/d.png',
    caption: '',
    rotate: 4,
  },
  {
    id: 5,
    src: '/images/MemoryLane/e.png',
    caption: '',
    rotate: -3,
  },
  {
    id: 6,
    src: '/images/MemoryLane/f.png',
    caption: '',
    rotate: 2,
  },
  {
    id: 7,
    src: '/images/MemoryLane/g.png',
    caption: '',
    rotate: -4,
  },
  {
    id: 8,
    src: '/images/MemoryLane/h.png',
    caption: '',
    rotate: 5,
  },
  {
    id: 9,
    src: '/images/MemoryLane/i.png',
    caption: '',
    rotate: -1,
  },
];

export default function MemoryLane() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [items, setItems] = useState(memories.map((m, i) => ({
    ...m,
    x: (i - 1.5) * 40,
    y: i * 10,
    rotate: m.rotate,
    zIndex: i + 1
  })));

  const bringToFront = (id: number) => {
    setItems(prev => {
      const maxZ = Math.max(...prev.map(p => p.zIndex));
      return prev.map(item => item.id === id ? { ...item, zIndex: maxZ + 1 } : item);
    });
  };

  const handleDragEnd = (id: number, offset: { x: number; y: number }) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, x: item.x + offset.x, y: item.y + offset.y } 
        : item
    ));
  };

  const handleScatter = () => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const padding = 150;
    
    setItems(prev => prev.map(item => ({
      ...item,
      x: (Math.random() - 0.5) * (width - padding),
      y: (Math.random() - 0.5) * (height - padding),
      rotate: (Math.random() - 0.5) * 60,
      zIndex: Math.floor(Math.random() * 10)
    })));
  };

  const handleStack = () => {
    setItems(prev => prev.map((item, i) => ({
      ...item,
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      rotate: (Math.random() - 0.5) * 10,
      zIndex: i + 1
    })));
  };

  const handleReset = () => {
     setItems(memories.map((m, i) => ({
      ...m,
      x: (i - 1.5) * 40,
      y: i * 10,
      rotate: m.rotate,
      zIndex: i + 1
    })));
  };

  return (
    <section id="memory-lane" className="py-24 px-6 md:px-12 bg-gradient-to-b from-cyan-50/30 to-blue-50/30 overflow-hidden relative">
      <div className="max-w-6xl mx-auto flex flex-col items-center">

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
            <button onClick={handleScatter} className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/80 rounded-full text-teal-800 font-semibold transition shadow-sm">
                <Shuffle size={18} /> Acak
            </button>
            <button onClick={handleStack} className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/80 rounded-full text-teal-800 font-semibold transition shadow-sm">
                <Layers size={18} /> Tumpuk
            </button>
             <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/80 rounded-full text-teal-800 font-semibold transition shadow-sm">
                <RotateCcw size={18} /> Reset
            </button>
        </div>

        <div ref={containerRef} className="relative h-[600px] w-full bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-white/50 shadow-inner flex items-center justify-center">
          {items.map((memory) => (
            <motion.div
              key={memory.id}
              drag
              dragMomentum={false}
              onDragStart={() => bringToFront(memory.id)}
              onDoubleClick={() => setSelectedId(memory.id)}
              onDragEnd={(e, info) => handleDragEnd(memory.id, info.offset)}
              animate={{ x: memory.x, y: memory.y, rotate: memory.rotate, zIndex: memory.zIndex, opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, cursor: 'grab' }}
              whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
              initial={{ opacity: 0, scale: 0.8 }}
              viewport={{ once: true }}
              className="absolute w-48 h-48 md:w-64 md:h-64 transform"
            >
              <img
                src={memory.src}
                alt={memory.caption}
                className="w-full h-full object-contain select-none pointer-events-none filter drop-shadow-lg"
                draggable={false}
              />
            </motion.div>
          ))}
          <AnimatePresence>
            {selectedId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8"
                onClick={() => setSelectedId(null)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative max-w-lg w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => setSelectedId(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors z-10">
                    <X size={20} />
                  </button>
                  <img src={memories.find(m => m.id === selectedId)?.src} alt="Zoomed memory" className="w-full max-h-[80vh] object-contain filter drop-shadow-2xl" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}