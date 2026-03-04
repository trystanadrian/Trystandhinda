'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

// Komponen Efek Ketikan
const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayText}</span>;
};

// Komponen Kartu Tilt 3D
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [15, -15]);
  const rotateY = useTransform(x, [0, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`h-full w-full ${className}`}
      >
        <div style={{ transform: "translateZ(20px)" }} className="h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const CardSparkles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1.5, 0],
          }}
          transition={{ 
            duration: Math.random() * 2 + 1, 
            repeat: Infinity, 
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        >
          <Sparkles size={Math.random() * 10 + 5} className="text-yellow-400/70" />
        </motion.div>
      ))}
    </div>
  );
};

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 md:px-12 relative overflow-hidden">
      {/* Side Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -left-40 -translate-y-1/2 w-[500px] h-[800px] bg-purple-200/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 -translate-y-1/2 w-[500px] h-[800px] bg-cyan-200/20 rounded-full blur-[120px]" />
      </div>

      {/* Soft background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-300 rounded-full"
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative top element */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-2 mb-6"
        >
          <Heart className="text-red-400 animate-pulse" size={24} fill="currentColor" />
          <Sparkles className="text-amber-300 animate-spin" size={24} style={{ animationDuration: '3s' }} />
          <Heart className="text-red-400 animate-pulse" size={24} fill="currentColor" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-9xl font-playfair font-bold bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-6 drop-shadow-sm tracking-tight"
        >
          trystandhinda
        </motion.h1>

        {/* Subtitle */}
        <motion.div variants={itemVariants} className="mb-10">
          <span className="inline-block py-2 px-6 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 text-lg md:text-xl text-teal-800 font-light tracking-[0.2em] uppercase">
            <TypewriterText text="Our Digital Time Capsule" />
          </span>
        </motion.div>

        {/* Main motto */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="inline-block mb-12 shadow-xl rounded-full"
        >
          <div className="px-8 py-5 rounded-full bg-white/90 backdrop-blur-xl">
            <p className="text-xl md:text-4xl font-playfair font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              "No Distance Can Downgrade Us"
            </p>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 text-center max-w-4xl mx-auto"
        >
          {[
            { icon: "👑", name: "Trystan Adrian Hanggara Wibawa", role: "The King of Her Heart" },
            { icon: "👸", name: "Dhinda Aura Sukma", role: "The Queen of His World" },
          ].map((item, idx) => (
            <TiltCard
              key={idx}
              className="p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:border-white/90 transition-all duration-500 cursor-default relative"
            >
              <CardSparkles />
              <div className="relative z-10">
                <motion.div
                  className="text-5xl mb-4 inline-block filter drop-shadow-md"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="font-bold text-teal-900 text-xl mb-2 font-playfair">{item.name}</h3>
                <p className="text-sm text-teal-700/80 leading-snug italic">"{item.role}"</p>
              </div>
            </TiltCard>
          ))}
        </motion.div>

        {/* Unique Text */}
        <motion.p variants={itemVariants} className="text-center text-teal-700/90 text-lg mt-16 max-w-2xl mx-auto italic">
          "Two souls, one heartbeat, separated by distance but united by a love that knows no bounds."
        </motion.p>
      </motion.div>

    </section>
  );
}
