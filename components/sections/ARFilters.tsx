'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Share2, Download } from 'lucide-react';

interface ARFilter {
  id: number;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

const arFilters: ARFilter[] = [
  {
    id: 1,
    name: 'Romantic Hearts',
    emoji: '💕',
    description: 'Hearts floating around your face',
    color: 'from-pink-300 to-red-300',
  },
  {
    id: 2,
    name: 'Love Sparkles',
    emoji: '✨',
    description: 'Magical sparkles effect',
    color: 'from-yellow-300 to-pink-300',
  },
  {
    id: 3,
    name: 'Flower Crown',
    emoji: '🌸',
    description: 'Beautiful flower crown',
    color: 'from-purple-300 to-pink-300',
  },
  {
    id: 4,
    name: 'Angel Wings',
    emoji: '😇',
    description: 'Angelic wings effect',
    color: 'from-blue-300 to-cyan-300',
  },
  {
    id: 5,
    name: 'Star Dust',
    emoji: '⭐',
    description: 'Shimmering stars',
    color: 'from-indigo-300 to-blue-300',
  },
  {
    id: 6,
    name: 'Rainbow Aura',
    emoji: '🌈',
    description: 'Colorful rainbow effect',
    color: 'from-yellow-300 via-pink-300 to-blue-300',
  },
];

export default function ARFiltersSection() {
  const [selectedFilter, setSelectedFilter] = useState<ARFilter | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  return (
    <section id="ar-filters" className="py-24 px-4 bg-gradient-to-b from-cyan-50/20 to-blue-50/20">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-purple-700 mb-4">
            🎨 AR Filters & Stickers
          </h2>
          <p className="text-lg text-purple-600">Buat foto kamu lebih magical dengan AR filters</p>
        </motion.div>

        {/* Camera Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12 p-8 bg-white/70 backdrop-blur-md rounded-2xl border-2 border-purple-300 shadow-lg"
        >
          <div className="relative w-full aspect-video bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg overflow-hidden border-2 border-purple-400 flex items-center justify-center">
            {selectedFilter ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  {selectedFilter.emoji}
                </motion.div>
                <p className="text-xl font-bold text-purple-700">{selectedFilter.name}</p>
                <p className="text-sm text-purple-600 mt-2">{selectedFilter.description}</p>
              </motion.div>
            ) : (
              <div className="text-center">
                <Sparkles size={64} className="mx-auto text-purple-400 mb-4" />
                <p className="text-lg font-semibold text-purple-700">Pilih filter untuk preview</p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-4 mt-6 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCameraActive(!isCameraActive)}
              className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold rounded-full hover:shadow-lg transition"
            >
              {isCameraActive ? '🛑 Stop Camera' : '📷 Start Camera'}
            </motion.button>

            {selectedFilter && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 font-bold rounded-full hover:bg-purple-50 transition"
                >
                  <Share2 size={18} /> Share
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 font-bold rounded-full hover:bg-purple-50 transition"
                >
                  <Download size={18} /> Download
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Filters Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-purple-700 mb-6">Pilihan Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arFilters.map((filter, idx) => (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedFilter(filter)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition transform hover:scale-105 ${
                  selectedFilter?.id === filter.id
                    ? `bg-gradient-to-r ${filter.color} border-purple-500 shadow-lg`
                    : 'bg-white/60 border-purple-300 hover:border-purple-400'
                }`}
              >
                <div className="text-5xl mb-3 text-center">{filter.emoji}</div>
                <h4 className={`font-bold text-center mb-2 ${
                  selectedFilter?.id === filter.id ? 'text-white' : 'text-purple-700'
                }`}>
                  {filter.name}
                </h4>
                <p className={`text-sm text-center ${
                  selectedFilter?.id === filter.id ? 'text-white/90' : 'text-purple-600'
                }`}>
                  {filter.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300"
        >
          <h4 className="font-bold text-purple-900 mb-2">💡 Catatan</h4>
          <p className="text-purple-800 text-sm">
            Fitur AR filter ini menggunakan emoji & animasi untuk preview. Untuk full AR experience dengan face detection,
            diperlukan setup dengan library seperti <code className="bg-white px-2 py-1 rounded">face-api.js</code> atau
            <code className="bg-white px-2 py-1 rounded">mediapipe</code>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
