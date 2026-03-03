'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

export default function Surprise() {
  const [isClicked, setIsClicked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="surprise" className="py-24 px-6 md:px-12 relative overflow-hidden bg-gradient-to-b from-transparent to-teal-50/20">
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            🎁 Surprise Section
          </h2>
          <p className="text-lg text-teal-700 leading-relaxed">Ada sesuatu untuk kamu...</p>
        </motion.div>

        {/* Secret Button */}
        <div className="flex justify-center mb-16">
          <motion.button
            onClick={() => setIsClicked(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"/>
            <span className="relative block px-10 py-5 bg-gray-900 text-white font-bold rounded-lg text-lg hover:bg-gray-800 transition">
              Don't click this.
            </span>
          </motion.button>
        </div>

        {/* Message after click */}
        <AnimatePresence>
          {isClicked && !showVideo && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300 shadow-lg"
              >
                <h3 className="text-3xl font-bold text-purple-900 mb-4">
                  ✨ Secret Message ✨
                </h3>
                <p className="text-gray-800 text-lg leading-relaxed mb-6">
                  Kamu berani klik tombol yang aku bilang jangan diklik? 😏
                  <br />
                  <br />
                  Berarti kamu penasaran... atau mungkin kamu suka petualangan? 😄
                  <br />
                  <br />
                  Apapun alasannya, aku siap kasih hadiah special untuk kamu.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVideo(true)}
                  className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:shadow-lg transition"
                >
                  <Play size={20} fill="white" /> Tonton Video
                </motion.button>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-sm text-gray-600 italic"
              >
                (Ini adalah video spesial yang aku buat untuk kamu 💕)
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Modal */}
        <AnimatePresence>
          {showVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVideo(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition z-50"
                >
                  <X size={32} />
                </button>

                {/* Video Container */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                  {/* Placeholder for video */}
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="mb-4"
                    >
                      <div className="text-6xl">🎬</div>
                    </motion.div>
                    <p className="text-white text-center">
                      <span className="block text-2xl font-bold mb-2">🎥 Personal Video</span>
                      <span className="block text-sm">Ganti URL ini dengan video link kamu</span>
                    </p>

                    {/* Embed Video Example (uncomment to use) */}
                    {/* <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      frameBorder="0"
                      allowFullScreen
                    /> */}
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-white mt-6 text-sm"
                >
                  Ini adalah momen spesial untuk kamu. I love you so much ❤️
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
