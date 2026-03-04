'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Clock } from 'lucide-react';

interface LocationInfo {
  name: string;
  coordinates: [number, number]; // [lat, lng]
  timezone: string;
}

const myLocation: LocationInfo = {
  name: 'Bojongsari Lama, Depok',
  coordinates: [-6.4024, 106.7448],
  timezone: 'Asia/Jakarta',
};

const partnerLocation: LocationInfo = {
  name: 'Kepolorejo, Magetan',
  coordinates: [-7.6465, 111.3265],
  timezone: 'Asia/Jakarta',
};

interface CountdownTimes {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function LDRTracker() {
  const [countdown, setCountdown] = useState<CountdownTimes>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [currentMyLocation, setCurrentMyLocation] = useState(myLocation);
  const [currentPartnerLocation, setCurrentPartnerLocation] = useState(partnerLocation);

  const [timeInfo, setTimeInfo] = useState({ myTime: '', partnerTime: '', diff: 0 });

  const [ldrDays, setLdrDays] = useState(0);

  useEffect(() => {
    const savedLocations = localStorage.getItem('map_locations');
    if (savedLocations) {
      try {
        const parsed = JSON.parse(savedLocations);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          setCurrentMyLocation(prev => ({ ...prev, name: parsed[0].name, coordinates: parsed[0].coords }));
          setCurrentPartnerLocation(prev => ({ ...prev, name: parsed[1].name, coordinates: parsed[1].coords }));
        }
      } catch (e) {
        console.error("Failed to parse map_locations", e);
      }
    }
  }, []);

  const distance = calculateDistance(
    currentMyLocation.coordinates[0],
    currentMyLocation.coordinates[1],
    currentPartnerLocation.coordinates[0],
    currentPartnerLocation.coordinates[1]
  );

  // LDR start date (example: 2024-01-15)
  const ldrStartDate = new Date('2026-02-16');
  
  // Next meeting date (18 Maret 2026 / March 18, 2026)
  const nextMeetingDate = new Date('2026-03-18');

  useEffect(() => {
    // Calculate LDR days
    const now = new Date();
    const diffMs = now.getTime() - ldrStartDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    setLdrDays(diffDays);

    // Calculate Time
    const updateTime = () => {
      const now = new Date();
      const myTimeStr = now.toLocaleTimeString('id-ID', { timeZone: currentMyLocation.timezone, hour: '2-digit', minute: '2-digit' });
      const partnerTimeStr = now.toLocaleTimeString('id-ID', { timeZone: currentPartnerLocation.timezone, hour: '2-digit', minute: '2-digit' });
      
      // Simple diff calculation (assuming same date for simplicity in this context, or use UTC offsets for precision)
      // Since both are usually in Indonesia (WIB/WITA/WIT), we can just check hours.
      // For now, let's assume 0 if same timezone string.
      const diff = currentMyLocation.timezone === currentPartnerLocation.timezone ? 0 : 0; // Logic can be expanded for cross-timezone
      setTimeInfo({ myTime: myTimeStr, partnerTime: partnerTimeStr, diff });
    };
    updateTime();

    // Calculate countdown to next meeting
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = nextMeetingDate.getTime() - currentTime;

      if (distance <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
      updateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [currentMyLocation, currentPartnerLocation]);

  const countdownItems = [
    { label: 'Hari', value: countdown.days },
    { label: 'Jam', value: countdown.hours },
    { label: 'Menit', value: countdown.minutes },
    { label: 'Detik', value: countdown.seconds },
  ];

  return (
    <section id="ldr-tracker" className="py-24 px-6 md:px-12 bg-gradient-to-b from-blue-50/30 to-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-amber-950 mb-4">
            📍 LDR Distance Tracker
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">Jarak yang memisahkan tapi tidak memandulkan</p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Distance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-300 shadow-lg"
          >
            <div className="flex flex-col items-center text-center gap-4 mb-4">
              <div className="p-4 bg-blue-500 rounded-full">
                <MapPin size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">Jarak Antar Kota</h3>
            </div>
            <motion.div className="text-5xl font-bold text-blue-600 mb-2">
              {distance.toFixed(0)} <span className="text-2xl">km</span>
            </motion.div>
            <p className="text-sm text-blue-800 text-center">
              {currentMyLocation.name} → {currentPartnerLocation.name}
            </p>
          </motion.div>

          {/* LDR Days Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300 shadow-lg"
          >
            <div className="flex flex-col items-center text-center gap-4 mb-4">
              <div className="p-4 bg-purple-500 rounded-full">
                <Heart size={32} className="text-white" fill="white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900">Sudah LDR</h3>
            </div>
            <motion.div className="text-5xl font-bold text-purple-600 mb-2">
              {ldrDays} <span className="text-2xl">hari</span>
            </motion.div>
            <p className="text-sm text-purple-800 text-center">
              Sejak {ldrStartDate.toLocaleDateString('id-ID', { dateStyle: 'long' })}
            </p>
          </motion.div>

          {/* Time Difference Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl border-2 border-amber-300 shadow-lg"
          >
            <div className="flex flex-col items-center text-center gap-4 mb-4">
              <div className="p-4 bg-amber-500 rounded-full">
                <Clock size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900">Waktu</h3>
            </div>
            <div className="flex justify-between w-full px-2 text-amber-900 font-bold text-lg">
              <div className="text-center">👑<br/>{timeInfo.myTime}</div>
              <div className="flex items-center text-sm font-normal text-amber-700">{timeInfo.diff === 0 ? 'Sama' : `${timeInfo.diff > 0 ? '+' : ''}${timeInfo.diff} Jam`}</div>
              <div className="text-center">👸<br/>{timeInfo.partnerTime}</div>
            </div>
          </motion.div>

          {/* "No Distance Can Downgrade Us" Motto Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl border-2 border-red-300 shadow-lg flex items-center justify-center"
          >
            <p className="text-2xl font-playfair font-bold text-center text-red-600 animate-glow">
              "No Distance Can Downgrade Us" ❤️
            </p>
          </motion.div>
        </div>

        {/* Countdown to Next Meeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 bg-gradient-to-r from-amber-100/50 to-orange-100/50 backdrop-blur-md rounded-2xl border-2 border-amber-300 shadow-lg mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-amber-950 mb-2">
              ⏰ Hitung Mundur Pertemuan
            </h3>
            <p className="text-lg text-gray-700">
              Menuju {nextMeetingDate.toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countdownItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white/60 backdrop-blur-md rounded-xl border-2 border-amber-200 text-center"
              >
                <motion.div
                  key={item.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl md:text-5xl font-bold text-amber-900 mb-2"
                >
                  {String(item.value).padStart(2, '0')}
                </motion.div>
                <p className="text-sm font-semibold text-gray-700">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Locations Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { location: currentMyLocation, emoji: '👑', label: 'Lokasi Ku' },
            { location: currentPartnerLocation, emoji: '👸', label: 'Lokasi Dia' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-white/50 backdrop-blur-md rounded-xl border-2 border-amber-200 text-center"
            >
              <h4 className="text-2xl font-bold text-amber-950 mb-2">
                {item.emoji} {item.label}
              </h4>
              <p className="text-lg text-gray-700">{item.location.name}</p>
              <p className="text-sm text-gray-600 mt-2">
                📍 {item.location.coordinates[0].toFixed(2)}°, {item.location.coordinates[1].toFixed(2)}°
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
