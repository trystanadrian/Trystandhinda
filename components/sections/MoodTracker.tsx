'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Star, Lock, Award, TrendingUp } from 'lucide-react';

const moods = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 border-yellow-300' },
  { emoji: '🥰', label: 'Loved', color: 'bg-pink-100 border-pink-300' },
  { emoji: '😢', label: 'Sad', color: 'bg-blue-100 border-blue-300' },
  { emoji: '😡', label: 'Angry', color: 'bg-red-100 border-red-300' },
  { emoji: '😴', label: 'Tired', color: 'bg-purple-100 border-purple-300' },
  { emoji: '🤩', label: 'Excited', color: 'bg-orange-100 border-orange-300' },
];

interface Achievement {
  id: string;
  label: string;
  icon: string;
  description: string;
  condition: (history: Record<string, string>, streak: number) => boolean;
}

const achievementsList: Achievement[] = [
  { 
    id: 'first_log', 
    label: 'First Step', 
    icon: '🌱', 
    description: 'Log mood pertamamu', 
    condition: (h) => Object.keys(h).length >= 1 
  },
  { 
    id: '3_streak', 
    label: 'On Fire', 
    icon: '🔥', 
    description: '3 hari streak', 
    condition: (_, s) => s >= 3 
  },
  { 
    id: '7_streak', 
    label: 'Week Warrior', 
    icon: '⚡', 
    description: '7 hari streak', 
    condition: (_, s) => s >= 7 
  },
  { 
    id: '10_logs', 
    label: 'Consistent', 
    icon: '📅', 
    description: '10 hari total logging', 
    condition: (h) => Object.keys(h).length >= 10 
  },
  { 
    id: '30_logs', 
    label: 'Mood Master', 
    icon: '👑', 
    description: '30 hari total logging', 
    condition: (h) => Object.keys(h).length >= 30 
  },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<Record<string, string>>({});
  const [currentDate] = useState(new Date());
  
  // Gamification State
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('moodHistory');
    const savedXp = localStorage.getItem('moodXp');
    const savedAchievements = localStorage.getItem('moodAchievements');

    if (saved) {
      const parsedHistory = JSON.parse(saved);
      setMoodHistory(parsedHistory);
      setStreak(calculateStreak(parsedHistory));
    }
    if (savedXp) setXp(parseInt(savedXp));
    if (savedAchievements) setUnlockedAchievements(JSON.parse(savedAchievements));
  }, []);

  const handleSelectMood = (emoji: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isNewEntry = !moodHistory[todayStr];
    
    const newHistory = { ...moodHistory, [todayStr]: emoji };
    setMoodHistory(newHistory);
    setSelectedMood(emoji);
    localStorage.setItem('moodHistory', JSON.stringify(newHistory));

    if (isNewEntry) {
      // Add XP
      const newXp = xp + 20;
      setXp(newXp);
      localStorage.setItem('moodXp', newXp.toString());

      // Check Level Up
      const oldLevel = Math.floor(xp / 100) + 1;
      const newLevel = Math.floor(newXp / 100) + 1;
      if (newLevel > oldLevel) setShowLevelUp(true);

      // Update Streak & Achievements
      const newStreak = calculateStreak(newHistory);
      setStreak(newStreak);
      checkAchievements(newHistory, newStreak);
    }
  };

  const calculateStreak = (history: Record<string, string>) => {
    let count = 0;
    const date = new Date();
    // Check from today backwards
    // If today is not logged yet (initial load), start from yesterday
    const todayStr = date.toISOString().split('T')[0];
    if (!history[todayStr]) {
      date.setDate(date.getDate() - 1);
    }

    while (true) {
      const str = date.toISOString().split('T')[0];
      if (history[str]) {
        count++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  };

  const checkAchievements = (history: Record<string, string>, currentStreak: number) => {
    const newUnlocked = [...unlockedAchievements];
    let changed = false;

    achievementsList.forEach(ach => {
      if (!newUnlocked.includes(ach.id) && ach.condition(history, currentStreak)) {
        newUnlocked.push(ach.id);
        changed = true;
        // Could add a toast notification here for achievement unlocked
      }
    });

    if (changed) {
      setUnlockedAchievements(newUnlocked);
      localStorage.setItem('moodAchievements', JSON.stringify(newUnlocked));
    }
  };

  // Simple calendar generation
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentLevel = Math.floor(xp / 100) + 1;
  const progress = xp % 100;

  return (
    <section id="mood-tracker" className="py-24 px-6 md:px-12 bg-gradient-to-b from-purple-50/30 to-pink-50/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-purple-800 mb-4">
            📅 Daily Mood Check-in
          </h2>
          <p className="text-lg text-purple-600">Bagaimana perasaanmu hari ini?</p>
        </motion.div>

        {/* Gamification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Level Card */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border-2 border-purple-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              {currentLevel}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-bold text-purple-900 mb-1">
                <span>Level {currentLevel}</span>
                <span>{progress}/100 XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-purple-500 h-2.5 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border-2 border-orange-200 shadow-sm flex items-center justify-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full text-orange-500">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{streak}</p>
              <p className="text-xs text-orange-800 font-semibold uppercase tracking-wider">Day Streak</p>
            </div>
          </div>

          {/* Total Logs Card */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border-2 border-blue-200 shadow-sm flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full text-blue-500">
              <TrendingUp size={24} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{Object.keys(moodHistory).length}</p>
              <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">Total Logs</p>
            </div>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {moods.map((mood) => (
            <motion.button
              key={mood.label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectMood(mood.emoji)}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
                selectedMood === mood.emoji ? 'ring-4 ring-purple-200 scale-110' : ''
              } ${mood.color}`}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-sm font-semibold text-gray-700">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Calendar View */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border-2 border-purple-200 shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-purple-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-purple-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
              const mood = moodHistory[dateStr];
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div 
                  key={day} 
                  className={`aspect-square rounded-xl flex items-center justify-center border-2 relative ${
                    isToday ? 'border-purple-400 bg-purple-50' : 'border-transparent hover:bg-white/50'
                  }`}
                >
                  <span className="text-sm text-gray-500 absolute top-1 left-2">{day}</span>
                  {mood && <span className="text-2xl">{mood}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {achievementsList.map((ach) => {
              const isUnlocked = unlockedAchievements.includes(ach.id);
              return (
                <motion.div
                  key={ach.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 transition ${
                    isUnlocked 
                      ? 'bg-white/80 border-yellow-400 shadow-md' 
                      : 'bg-gray-50/50 border-gray-200 opacity-60 grayscale'
                  }`}
                >
                  <div className={`text-3xl ${isUnlocked ? '' : 'opacity-50'}`}>
                    {isUnlocked ? ach.icon : '🔒'}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isUnlocked ? 'text-purple-900' : 'text-gray-500'}`}>
                      {ach.label}
                    </h4>
                    <p className="text-xs text-gray-500">{ach.description}</p>
                  </div>
                  {isUnlocked && <Award size={16} className="ml-auto text-yellow-500" />}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Level Up Overlay */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => setShowLevelUp(false)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
              <div className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-sm w-full border-4 border-yellow-400">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-3xl font-bold text-purple-800 mb-2">LEVEL UP!</h3>
                <p className="text-lg text-gray-600 mb-6">Selamat! Kamu naik ke <span className="font-bold text-purple-600">Level {currentLevel}</span></p>
                <button 
                  onClick={() => setShowLevelUp(false)}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:shadow-lg transition"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}