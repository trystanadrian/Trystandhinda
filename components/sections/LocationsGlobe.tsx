'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Compass } from 'lucide-react';

export default function LocationsGlobe() {
  const [hoveredLocation, setHoveredLocation] = useState<'my' | 'partner' | null>(null);

  return (
    <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-cyan-50/20 to-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-amber-950 mb-4">
            🌍 Peta Dunia Kita
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">Despite the distance, we are one</p>
        </motion.div>

        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12 p-8 bg-white/50 backdrop-blur-md rounded-2xl border-2 border-blue-300 shadow-lg"
        >
          {/* SVG Map */}
          <div className="w-full bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl overflow-hidden">
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simplified Indonesia Map */}
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
                <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ff4757', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#ff6b81', stopOpacity: 0.6 }} />
                </linearGradient>
              </defs>

              {/* Water background */}
              <rect width="1000" height="600" fill="#e3f2fd" />

              {/* Simple Indonesia representation */}
              <g opacity="0.3">
                <path
                  d="M 200 200 Q 300 150 400 200 L 450 250 Q 400 300 350 280 Z"
                  fill="#4caf50"
                />
                <path
                  d="M 500 250 L 600 200 Q 650 220 650 280 L 550 300 Z"
                  fill="#4caf50"
                />
              </g>

              {/* Animated connecting line */}
              <motion.line
                x1="300"
                y1="250"
                x2="650"
                y2="300"
                stroke="url(#glowGradient)"
                strokeWidth="3"
                strokeDasharray="1000"
                initial={{ strokeDashoffset: 1000 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                filter="url(#shadow)"
              />

              {/* Animated dots along the line */}
              <motion.circle
                cx="300"
                cy="250"
                r="8"
                fill="#ff6b81"
                filter="url(#shadow)"
                animate={{
                  cx: [300, 650],
                  cy: [250, 300],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* My Location - Depok */}
              <motion.g
                onHoverStart={() => setHoveredLocation('my')}
                onHoverEnd={() => setHoveredLocation(null)}
              >
                <motion.circle
                  cx="300"
                  cy="250"
                  r="20"
                  fill="#ff6b81"
                  filter="url(#shadow)"
                  animate={hoveredLocation === 'my' ? { r: 30 } : { r: 20 }}
                  whileHover={{ scale: 1.2 }}
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x="300"
                  y="255"
                  textAnchor="middle"
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  👑
                </text>
              </motion.g>

              {/* Partner Location - Magetan */}
              <motion.g
                onHoverStart={() => setHoveredLocation('partner')}
                onHoverEnd={() => setHoveredLocation(null)}
              >
                <motion.circle
                  cx="650"
                  cy="300"
                  r="20"
                  fill="#ff6b81"
                  filter="url(#shadow)"
                  animate={hoveredLocation === 'partner' ? { r: 30 } : { r: 20 }}
                  whileHover={{ scale: 1.2 }}
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x="650"
                  y="305"
                  textAnchor="middle"
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  
                </text>
              </motion.g>

              {/* Labels */}
              <text
                x="300"
                y="310"
                textAnchor="middle"
                fill="#333"
                fontSize="16"
                fontWeight="bold"
              >
                Bojongsari Lama
              </text>
              <text
                x="300"
                y="330"
                textAnchor="middle"
                fill="#666"
                fontSize="12"
              >
                Depok
              </text>

              <text
                x="650"
                y="360"
                textAnchor="middle"
                fill="#333"
                fontSize="16"
                fontWeight="bold"
              >
                Kepolorejo
              </text>
              <text
                x="650"
                y="380"
                textAnchor="middle"
                fill="#666"
                fontSize="12"
              >
                Magetan
              </text>
            </svg>
          </div>
        </motion.div>

        {/* Locations Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* My Location */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredLocation('my')}
            onHoverEnd={() => setHoveredLocation(null)}
            className={`p-8 rounded-xl border-2 transition cursor-pointer transform ${
              hoveredLocation === 'my'
                ? 'border-red-400 bg-red-50 scale-105'
                : 'border-blue-200 bg-white/50 hover:border-red-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl">👑</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-amber-950 mb-2">Lokasi Ku</h3>
                <p className="text-lg text-gray-700 mb-2">Bojongsari Lama, Depok</p>
                <p className="text-sm text-gray-600">📍 -6.40°, 106.74°</p>
                <p className="text-sm text-gray-600 mt-3">
                  Tempat di mana aku menunggu dan memimpikan momen bersama kamu ❤️
                </p>
              </div>
            </div>
          </motion.div>

          {/* Partner Location */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredLocation('partner')}
            onHoverEnd={() => setHoveredLocation(null)}
            className={`p-8 rounded-xl border-2 transition cursor-pointer transform ${
              hoveredLocation === 'partner'
                ? 'border-red-400 bg-red-50 scale-105'
                : 'border-blue-200 bg-white/50 hover:border-red-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl"></div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-amber-950 mb-2">Lokasi Dia</h3>
                <p className="text-lg text-gray-700 mb-2">Kepolorejo, Magetan</p>
                <p className="text-sm text-gray-600">📍 -7.65°, 111.33°</p>
                <p className="text-sm text-gray-600 mt-3">
                  Lokasi sang penyeri hari-hariku, yang selalu ada di hati meski jauh 💕
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300"
        >
          <h3 className="text-2xl font-bold text-purple-900 mb-6">📊 Fun Distance Facts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600 mb-2">~450 km</p>
              <p className="text-gray-700">Jarak antar kota</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600 mb-2">~7 jam</p>
              <p className="text-gray-700">Waktu perjalanan</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600 mb-2">1❤️</p>
              <p className="text-gray-700">Satu hati kami</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
