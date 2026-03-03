'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function StarBackground() {
  const { scrollY } = useScroll();
  // Parallax effect: move background at 20% of scroll speed
  const y = useTransform(scrollY, (value) => value * 0.2);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
      style={{ y }}
    >
      {/* Stars are now always visible with a fixed opacity */}
      <div className="absolute inset-0 opacity-50">
        <div className="stars-static absolute inset-0"></div>
        <div className="stars-shooting absolute inset-0">
          <span className="shooting-star-1"></span>
          <span className="shooting-star-2"></span>
        </div>
      </div>
    </motion.div>
  );
}