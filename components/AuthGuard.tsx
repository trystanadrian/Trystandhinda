 'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Heart, Sparkles, Fingerprint } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const auth = localStorage.getItem('trystandhinda_auth');
    // Simple check for auth, can be improved for production
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);

    // Initialize Audio (Pastikan file heartbeat.mp3 ada di folder public)
    audioRef.current = new Audio('/heartbeat.mp3');
    audioRef.current.loop = true;
  }, []);

  const handleStartScan = () => {
    if (isAuthenticated) return;
    setIsScanning(true);

    // Play Audio & Start Haptic
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = 1.0;
      audioRef.current.play().catch(() => {}); // Ignore autoplay errors
    }
    
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;

        // Update Audio Speed (Meningkat dari 1x ke 2.5x)
        if (audioRef.current) {
          audioRef.current.playbackRate = 1.0 + (next / 70);
        }

        // Haptic Feedback (Efek getar continuous saat scanning)
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(30); 
        }

        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (audioRef.current) audioRef.current.pause();
          return 100;
        }
        return next;
      });
    }, 20);
  };

  const handleStopScan = () => {
    if (progress < 100) {
      setIsScanning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(0);

      // Stop Audio & Vibration
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(0);
      }
    }
  };

  useEffect(() => {
    if (progress === 100) {
      localStorage.setItem('trystandhinda_auth', 'true');
      
      // Success Haptic Pattern (Getar 2 kali tanda sukses)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      setTimeout(() => setIsAuthenticated(true), 800);
    }
  }, [progress]);

  const handleLogout = () => {
    localStorage.removeItem('trystandhinda_auth');
    setIsAuthenticated(false);
    setProgress(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Heart size={56} className="text-teal-500" fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  // --- New Falling Hearts Component ---
  const FallingHearts = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-400"
          initial={{ top: '-10%', opacity: 0 }}
          animate={{ top: '110%', opacity: [0, 0.8, 0] }}
          transition={{
            duration: Math.random() * 5 + 7, // 7 to 12 seconds
            delay: Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 1.2 + 0.5}rem`, // 0.5rem to 1.7rem
            transform: `rotate(${Math.random() * 60 - 30}deg)`,
          }}
        >
          <Heart size="100%" fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-teal-50">
        {/* --- Render Falling Hearts --- */}
        <FallingHearts />

        {/* Background Animation */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-20 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28 }}
          className="relative w-full max-w-md p-4 z-20"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/50 border border-white/60">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-8 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 bg-white/5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
              />
              <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-3">
                ❤️
              </motion.div>
              <h1 className="text-3xl font-playfair font-bold text-white mb-1 tracking-wide">trystandhinda</h1>
              <p className="text-white/95 text-lg font-light">Our Love's Private Space</p>
            </div>

            <div className="p-6 text-center">
              <p className="text-teal-800 font-semibold mb-6">
                {progress === 100 ? "Access Granted ❤️" : 
                 progress > 60 ? "Syncing Heartbeats..." :
                 progress > 20 ? "Verifying Soulmate..." :
                 "Touch & Hold to Connect"}
              </p>
              
              <div className="relative flex justify-center items-center mb-4">
                {/* Scanner Container */}
                <div className="relative w-24 h-24">
                  {/* Background Ring */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="46"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-100"
                    />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="46"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-rose-500"
                      strokeDasharray="289"
                      strokeDashoffset={289 - (289 * progress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Fingerprint Button */}
                  <motion.button
                    onMouseDown={handleStartScan}
                    onMouseUp={handleStopScan}
                    onMouseLeave={handleStopScan}
                    onTouchStart={handleStartScan}
                    onTouchEnd={handleStopScan}
                    onContextMenu={(e) => e.preventDefault()}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute inset-2 rounded-full flex items-center justify-center transition-colors duration-500 ${
                      progress === 100 ? 'bg-rose-500 text-white' : 
                      isScanning ? 'bg-rose-50 text-rose-500' : 'bg-white text-gray-400 border-2 border-gray-100'
                    }`}
                  >
                    <Fingerprint size={48} className={isScanning ? "animate-pulse" : ""} />
                  </motion.button>
                </div>
              </div>

              <p className="text-xs text-gray-400 h-4">
                {isScanning && progress < 100 ? `${Math.round(progress)}%` : ""}
              </p>
            </div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-teal-800/70 text-sm mt-6 font-medium">
            "Even under different skies, we see the same moon." ✨
          </motion.p>
        </motion.div>
      </div>
    );
  }


  return (
    <>
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </>
  );
}
