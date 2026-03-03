'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Plus, X, ChevronLeft, ChevronRight, Send, Edit2, Trash2, Check, Save, Upload } from 'lucide-react';

interface Comment {
  id: number;
  text: string;
  user: string;
}

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: string;
  color: string;
  likes: number;
  images: string[];
  comments: Comment[];
}

const mockEvents: TimelineEvent[] = [
  {
    id: 1,
    title: 'First Chat',
    description: 'Awal dari semuanya... DM pertama yang mengubah hidup.',
    date: '2024-01-15',
    icon: '💬',
    color: 'blue',
    likes: 45,
    images: ['https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=600&h=600&fit=crop'],
    comments: [
      { id: 1, text: 'So sweet! 😍', user: 'User' },
      { id: 2, text: 'Kapan nih part 2?', user: 'User' }
    ],
  },
  {
    id: 2,
    title: 'First Call',
    description: 'Suara pertama kamu... jantung berdebar menunggu panggilan VChat.',
    date: '2024-02-20',
    icon: '☎️',
    color: 'green',
    likes: 82,
    images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=600&fit=crop'],
    comments: [],
  },
  {
    id: 3,
    title: 'First Meet',
    description: 'Akhirnya bertemu offline! Momen yang paling ditunggu.',
    date: '2024-06-10',
    icon: '👫',
    color: 'red',
    likes: 156,
    images: ['https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=600&fit=crop'],
    comments: [{ id: 3, text: 'Couple goals! 🔥', user: 'User' }],
  },
  {
    id: 4,
    title: '1st Anniversary',
    description: 'Satu tahun bersama, masih banyak yang perlu dijalani.',
    date: '2025-01-15',
    icon: '🎉',
    color: 'purple',
    likes: 210,
    images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=600&fit=crop'],
    comments: [],
  },
];

const TimelineEventItem = ({
  event,
  index,
  onDelete,
  onLike,
  onEditEvent,
  onAddComment,
  onDeleteComment,
  onEditComment,
  getGradient,
}: {
  event: TimelineEvent;
  index: number;
  onDelete: (id: number) => void;
  onLike: (id: number) => void;
  onEditEvent: (id: number, updatedEvent: Partial<TimelineEvent>) => void;
  onAddComment: (id: number, text: string) => void;
  onDeleteComment: (eventId: number, commentId: number) => void;
  onEditComment: (eventId: number, commentId: number, text: string) => void;
  getGradient: (color: string) => string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: event.title, date: event.date, description: event.description });
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.8, 1.6, 0.8]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.6, 1, 0.6]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
  };

  const handleLikeClick = () => {
    onLike(event.id);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  };

  const handleSaveEvent = () => {
    onEditEvent(event.id, editForm);
    setIsEditing(false);
  };

  return (
    <div
      ref={ref}
      id={`timeline-event-${event.id}`}
      className={`flex flex-col md:flex-row items-center justify-center w-full relative ${
        isLeft ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Content Side */}
      <div className="w-full md:w-[40%] px-4 mb-8 md:mb-0">
        <motion.div
          initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden relative z-10 max-w-sm mx-auto md:mx-0"
        >
          {/* Instagram Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${getGradient(event.color)} text-white shadow-sm`}>
                  <span className="text-sm">{event.icon}</span>
               </div>
               <div className="flex flex-col">
                  {isEditing ? (
                    <input 
                      value={editForm.title} 
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="text-sm font-bold text-gray-900 leading-none border-b border-gray-300 focus:outline-none focus:border-blue-500 w-32"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-900 leading-none">{event.title}</span>
                  )}
                  
                  {isEditing ? (
                    <input 
                      type="date"
                      value={editForm.date} 
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      className="text-[10px] text-gray-500 mt-0.5 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <span className="text-[10px] text-gray-500 mt-0.5">{event.date}</span>
                  )}
               </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <button onClick={handleSaveEvent} className="text-green-500 hover:text-green-600 transition"><Check size={16} /></button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500 transition"><Edit2 size={16} /></button>
              )}
              <button onClick={() => isEditing ? setIsEditing(false) : onDelete(event.id)} className="text-gray-400 hover:text-red-500 transition">
                {isEditing ? <X size={16} /> : <Trash2 size={16} />}
              </button>
            </div>
          </div>

          {/* Image Area */}
          <div className="aspect-square w-full bg-gray-100 relative group">
             <img src={event.images[currentImageIndex]} alt={event.title} className="w-full h-full object-cover transition-opacity duration-300" />
             {event.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                     {currentImageIndex + 1}/{event.images.length}
                  </div>
                </>
             )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-4 p-3 bg-white relative">
             <button onClick={handleLikeClick} className="focus:outline-none transform active:scale-110 transition-transform relative">
               <Heart size={24} className={`transition-colors ${event.likes > 0 ? 'fill-red-500 text-red-500' : 'text-gray-800 hover:text-red-500'}`} />
               {showConfetti && (
                 <>
                   {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                     <motion.div
                       key={i}
                       initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
                       animate={{ x: Math.cos(angle * (Math.PI / 180)) * 30, y: Math.sin(angle * (Math.PI / 180)) * 30, scale: 0, opacity: 0 }}
                       transition={{ duration: 0.5, ease: "easeOut" }}
                       className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full pointer-events-none"
                       style={{ marginTop: -4, marginLeft: -4 }}
                     />
                   ))}
                 </>
               )}
             </button>
             <MessageCircle size={24} onClick={() => setShowComments(!showComments)} className="text-gray-800 hover:text-blue-500 cursor-pointer transition-colors" />
          </div>

          {/* Caption */}
          <div className="px-3 pb-4 bg-white pt-0">
             <p className="text-sm font-bold text-gray-900 mb-1">{event.likes} suka</p>
             <p className="text-sm text-gray-800 leading-relaxed">
                <span className="font-bold mr-2">{event.title}</span>
                {isEditing ? (
                  <textarea 
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full text-sm border border-gray-300 rounded p-1 mt-1 focus:outline-none focus:border-blue-500"
                    rows={2}
                  />
                ) : (
                  event.description
                )}
             </p>
             <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">
                {new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </p>

             {/* Comments Section */}
             <div className="mt-3 border-t border-gray-50 pt-2">
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="text-xs text-gray-500 font-medium mb-2 hover:text-gray-700"
                >
                  {event.comments && event.comments.length > 0 ? `Lihat semua ${event.comments.length} komentar` : 'Belum ada komentar'}
                </button>

                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 mb-2"
                    >
                      {event.comments?.map((comment, i) => (
                        <div key={comment.id} className="text-sm text-gray-800 flex items-start justify-between group">
                          <div className="flex-1">
                            <span className="font-bold mr-2 text-xs">{comment.user}</span>
                            {editingCommentId === comment.id ? (
                              <div className="flex items-center gap-2 mt-1">
                                <input 
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  className="flex-1 text-xs border-b border-blue-300 focus:outline-none"
                                />
                                <button onClick={() => { onEditComment(event.id, comment.id, editCommentText); setEditingCommentId(null); }} className="text-green-500"><Check size={12} /></button>
                                <button onClick={() => setEditingCommentId(null)} className="text-red-500"><X size={12} /></button>
                              </div>
                            ) : (
                              <span>{comment.text}</span>
                            )}
                          </div>
                          {!editingCommentId && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingCommentId(comment.id); setEditCommentText(comment.text); }} className="text-gray-400 hover:text-blue-500"><Edit2 size={10} /></button>
                              <button onClick={() => onDeleteComment(event.id, comment.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={10} /></button>
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="text" 
                    placeholder="Tambahkan komentar..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && commentText.trim()) {
                        onAddComment(event.id, commentText);
                        setCommentText('');
                      }
                    }}
                    className="flex-1 text-xs bg-gray-5 border border-gray-200 rounded-full px-3 py-1.5 focus:outline-none focus:border-blue-400"
                  />
                  <button 
                    onClick={() => {
                      if (commentText.trim()) {
                        onAddComment(event.id, commentText);
                        setCommentText('');
                      }
                    }}
                    disabled={!commentText.trim()}
                    className="text-blue-500 disabled:opacity-50 p-1 hover:bg-blue-50 rounded-full transition"
                  >
                    <Send size={16} />
                  </button>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* 3D Timeline Sphere (Center) */}
      <div className="relative flex items-center justify-center w-40 md:w-[20%] z-20 flex-shrink-0">
        <motion.div
          style={{ scale, opacity }}
          drag
          dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
          dragSnapToOrigin
          dragElastic={0.2}
          whileHover={{ y: -15, rotate: 10, scale: 1.1 }}
          whileDrag={{ scale: 1.2, rotate: 90, cursor: 'grabbing' }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className={`w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_-10px_20px_rgba(0,0,0,0.3),inset_0_10px_20px_rgba(255,255,255,0.5)] border-4 border-white/40 backdrop-blur-sm bg-gradient-to-br ${getGradient(
            event.color
          )} cursor-grab active:cursor-grabbing`}
        >
          <span className="text-6xl md:text-8xl filter drop-shadow-lg select-none">
            {event.icon}
          </span>
        </motion.div>
      </div>

      {/* Empty Side for Balance */}
      <div className="w-full md:w-[40%] px-4 hidden md:block" />
    </div>
  );
};

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(mockEvents);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    icon: '💕',
    imageUrl: '',
    color: 'amber',
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('timeline_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load events", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('timeline_events', JSON.stringify(events));
    }
  }, [events, isLoaded]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewEvent({ ...newEvent, imageUrl });
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([
        ...events,
        {
          id: Math.max(...events.map((e) => e.id), 0) + 1,
          ...newEvent,
          color: newEvent.color,
          likes: 0,
          images: newEvent.imageUrl ? [newEvent.imageUrl] : ['https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop'],
          comments: [],
        },
      ]);
      setNewEvent({ title: '', description: '', date: '', icon: '💕', imageUrl: '', color: 'amber' });
      setShowAddForm(false);
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleLikeEvent = (id: number) => {
    setEvents(events.map((e) => e.id === id ? { ...e, likes: e.likes + 1 } : e));
  };

  const handleEditEvent = (id: number, updatedEvent: Partial<TimelineEvent>) => {
    setEvents(events.map((e) => e.id === id ? { ...e, ...updatedEvent } : e));
  };

  const handleAddComment = (id: number, text: string) => {
    const newComment: Comment = { id: Date.now(), text, user: 'User' };
    setEvents(events.map((e) => e.id === id ? { ...e, comments: [...(e.comments || []), newComment] } : e));
  };

  const handleDeleteComment = (eventId: number, commentId: number) => {
    setEvents(events.map((e) => e.id === eventId ? { ...e, comments: e.comments.filter(c => c.id !== commentId) } : e));
  };

  const handleEditComment = (eventId: number, commentId: number, text: string) => {
    setEvents(events.map((e) => e.id === eventId ? { ...e, comments: e.comments.map(c => c.id === commentId ? { ...c, text } : c) } : e));
  };

  const getGradient = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-300 via-blue-500 to-blue-800';
      case 'green': return 'from-green-300 via-green-500 to-green-800';
      case 'purple': return 'from-purple-300 via-purple-500 to-purple-800';
      case 'amber': return 'from-amber-300 via-amber-500 to-amber-800';
      default: return 'from-red-300 via-red-500 to-red-800';
    }
  };

  const colors = ['blue', 'green', 'red', 'purple', 'amber'];

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <section id="timeline" className="py-24 px-6 md:px-12 bg-gradient-to-b from-transparent to-blue-50/30 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-amber-950 mb-4">
            🕰️ Timeline Momen Penting
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">Perjalanan kita yang indah</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Add Event Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="mb-12 mx-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white font-semibold rounded-full hover:shadow-lg transition"
          >
            <Plus size={20} /> Tambah Momen
          </motion.button>

          {/* Add Event Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 p-6 bg-white/80 backdrop-blur-md rounded-lg border-2 border-amber-200 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-amber-950">Tambah Momen Baru</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-600 hover:text-amber-950"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Judul momen"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                
                {/* Image Upload */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer flex items-center gap-2 px-4 py-2 border border-amber-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
                    <Upload size={18} />
                    <span className="text-sm truncate">{newEvent.imageUrl ? 'Gambar Terpilih' : 'Unggah Gambar'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {newEvent.imageUrl && (
                    <div className="w-10 h-10 rounded overflow-hidden border border-gray-200">
                      <img src={newEvent.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <textarea
                  placeholder="Deskripsi momen"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  rows={3}
                />
                
                {/* Color Picker */}
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewEvent({ ...newEvent, color })}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${getGradient(color)} ${newEvent.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddEvent}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white font-semibold rounded-lg hover:shadow-lg transition"
                  >
                    Simpan Momen
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline Events with 3D Effect */}
          <div className="relative space-y-20 md:space-y-32 py-10">
            {/* Central Line */}
            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-2 transform -translate-x-1/2 hidden md:block rounded-full"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, #fcd34d, #f59e0b, #fcd34d, transparent)',
                backgroundSize: '100% 200%',
              }}
              animate={{ backgroundPosition: ['0% 0%', '0% 200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {sortedEvents.map((event, index) => {
              return (
                <TimelineEventItem
                  key={event.id}
                  event={event}
                  index={index}
                  onDelete={handleDeleteEvent}
                  onLike={handleLikeEvent}
                  onEditEvent={handleEditEvent}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  onEditComment={handleEditComment}
                  getGradient={getGradient}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
