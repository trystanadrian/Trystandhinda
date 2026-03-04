'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Check } from 'lucide-react';

const loveletters = [
  "Hari ini aku ingin bilang bahwa cinta aku ke kamu tidak terbatas oleh jarak. Setiap detik tanpa kamu, aku counting down sambil tersenyum karena aku tahu ada seorang yang amazing lagi waiting for me. Kamu adalah alasan kenapa jarak bukan masalah—karena hati kami terhubung ❤️",

  "You know what I love about us? We don't need to be together to feel connected. Your voice, your laugh, your random thoughts—semua itu enough to make my day complete. I'm so grateful for someone like you. I love you beyond distance 💕",

  "Jangan pernah ragu tentang kita. Kita sudah melewati everything dan kita masih standing strong bersama. I'm so proud of us. Can't wait to see you and hold you. You're worth every wait 🥰",

  "Setiap kali kita video call, adalah momen terbaik hari aku. Your smile makes everything better. Terima kasih untuk being patient, being supportive, dan for loving me the way you do. I'm the luckiest person alive 💗",

  "I wish I could freeze time whenever we're together. But knowing that we have forever—that makes it even better. You're my today dan my forever. I love you so much, sayang 💝",

  "Missing you is the price I pay for having you in my life. And honestly? I'd pay it a million times over. Because you're worth it. We're worth it. Always 🤍",

  "Aku selalu excited untuk hari pertemuan berikutnya. Tapi sebelum itu, aku enjoy every moment we have—even through the screen. Thank you for making LDR feel less lonely. You made it feel like adventure 🌟",

  "If forever lived as close to you always did, I'd be the happiest person in the world. But even from different cities, feeling you in my heart is enough. Sampe ketemu, sayang. I love you ❤️",
];

export default function LoveLetterGenerator() {
  const [todayLetter, setTodayLetter] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDate, setLastDate] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Get today's date to generate consistent letter
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('loveLetterDate');
    const savedIndex = localStorage.getItem('loveLetterIndex');

    if (savedDate === today && savedIndex) {
      setCurrentIndex(Number(savedIndex));
      setTodayLetter(loveletters[Number(savedIndex)]);
    } else {
      // Generate new letter for today
      const randomIndex = Math.floor(Math.random() * loveletters.length);
      setCurrentIndex(randomIndex);
      setTodayLetter(loveletters[randomIndex]);
      localStorage.setItem('loveLetterDate', today);
      localStorage.setItem('loveLetterIndex', String(randomIndex));
    }
    setLastDate(today);
  }, []);

  const handleCopy = () => {
    if (todayLetter) {
      navigator.clipboard.writeText(todayLetter);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Floating Hearts Animation Component
  const FloatingHearts = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '120%', opacity: 0, scale: 0.5 }}
          whileInView={{
            y: '-20%',
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.8],
            x: [0, Math.random() * 40 - 20, 0],
          }}
          viewport={{ once: false }} // Animate every time it comes into view
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
          className="absolute text-red-300/40"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 24 + 16}px`,
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );

  return (
    <section id="love-letter" className="py-24 px-6 md:px-12 bg-gradient-to-b from-transparent to-blue-50/20 relative overflow-hidden">
      <FloatingHearts />
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-amber-950 mb-4">
            💌 Today's Love Letter
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">Generate a new message every day (or refresh for testing)</p>
        </motion.div>

        {/* Letter Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mb-8"
        >
          <div className="p-12 bg-gradient-to-br from-white to-rose-50 rounded-2xl border-3 border-rose-300 shadow-2xl relative overflow-hidden">
            {/* Decorative hearts */}
            <div className="absolute top-4 right-4 text-4xl opacity-20 animate-float">💕</div>
            <div className="absolute bottom-4 left-4 text-4xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>
              💕
            </div>

            {/* Letter content */}
            <div className="relative z-10">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Today's Message</p>
              </div>

              <motion.p
                key={todayLetter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg md:text-xl text-gray-800 leading-relaxed font-playfair text-center mb-6 italic"
              >
                "{todayLetter}"
              </motion.p>

              <div className="text-center">
                <p className="text-sm text-rose-600">— Dari hati ♥️ untuk hatimu</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="flex items-center gap-2 px-8 py-4 bg-white/50 backdrop-blur-md border-2 border-rose-300 text-rose-600 font-semibold rounded-full hover:bg-white/70 transition"
            >
              {isCopied ? <Check size={20} /> : <Heart size={20} fill="currentColor" />} {isCopied ? 'Tersalin!' : 'Copy Pesan'}
            </motion.button>
          </div>
        </motion.div>

        {/* Info */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-600 max-w-md mx-auto"
        >
          💌 Satu surat cinta baru setiap hari! Setelah tengah malam, surat baru akan ter-generate secara otomatis.
        </motion.p>
      </div>
    </section>
  );
}
