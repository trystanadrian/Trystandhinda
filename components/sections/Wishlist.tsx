'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, X, Trash2, CheckCircle2, Circle, Upload, Image as ImageIcon, ArrowUpDown, GripVertical, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WishlistItem {
  id: number | string;
  title: string;
  category: 'place' | 'random' | 'together' | 'small';
  completed: boolean;
  description?: string;
  image?: string;
}

const categoryInfo = {
  place: { label: '🌍 Tempat Impian', color: 'from-blue-400 to-cyan-400' },
  random: { label: '✨ Hal Random', color: 'from-purple-400 to-pink-400' },
  together: { label: '🎯 Target Bersama', color: 'from-orange-400 to-red-400' },
  small: { label: '💕 Hal Kecil', color: 'from-green-400 to-emerald-400' },
};

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'small' as const,
    description: '',
    image: '',
  });

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }, [items]);

  // Load from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from('wishlists').select('*');
      if (data) setItems(data);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (stats.completed === stats.total && stats.total > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [stats.completed, stats.total]);

  const handleAddItem = async () => {
    if (newItem.title.trim()) {
      const itemToAdd = {
        ...newItem,
        completed: false,
        image: '',
      };

      const { data, error } = await supabase.from('wishlists').insert([itemToAdd]).select();
      
      if (data) {
        setItems([...items, ...data]);
        setNewItem({ title: '', category: 'small', description: '', image: '' });
        setShowAddForm(false);
      }
    }
  };

  const handleToggleItem = async (id: number | string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const { error } = await supabase.from('wishlists').update({ completed: !item.completed }).eq('id', id);
      if (!error) setItems(items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    }
  };

  const handleDeleteItem = async (id: number | string) => {
    const { error } = await supabase.from('wishlists').delete().eq('id', id);
    if (!error) setItems(items.filter((item) => item.id !== id));
  };

  const handleImageUpload = async (id: number | string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const { error } = await supabase.from('wishlists').update({ image: imageUrl }).eq('id', id);
      if (!error) setItems(items.map((item) => (item.id === id ? { ...item, image: imageUrl } : item)));
    }
  };

  const handleReorder = (newCategoryItems: WishlistItem[], category: string) => {
    const otherCategoriesItems = items.filter((i) => i.category !== category);
    setItems([...otherCategoriesItems, ...newCategoryItems]);
  };

  const toggleReorderMode = () => {
    if (!isReorderMode) {
      setFilter('all'); // Reset filter when entering reorder mode
      setSearchQuery(''); // Reset search when entering reorder mode
    }
    setIsReorderMode(!isReorderMode);
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'completed'
        ? item.completed
        : !item.completed;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const groupedItems = (Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>).reduce(
    (acc, category) => {
      acc[category] = filteredItems.filter((item) => item.category === category);
      return acc;
    },
    {} as Record<string, WishlistItem[]>
  );

  return (
    <section id="wishlist" className="py-24 px-6 md:px-12 bg-gradient-to-b from-transparent to-teal-50/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-amber-950 mb-4">
            ✅ Wishlist & Future Plans
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">Impian dan rencana kita bersama</p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12 p-8 bg-white/60 backdrop-blur-md rounded-2xl border-2 border-purple-200 shadow-lg"
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-amber-950">Relationship Completion</h3>
              <p className="text-3xl font-playfair font-bold text-purple-600">{stats.percentage}%</p>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.completed} dari {stats.total} momen tercapai 💫
            </p>
          </div>
        </motion.div>

        {/* Controls (Filter & Reorder) */}
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari impian kita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isReorderMode}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/60 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
          {/* Filter Buttons */}
          <div className="flex bg-white/60 backdrop-blur-md rounded-lg p-1 border border-purple-200 shadow-sm">
            {(['all', 'completed', 'pending'] as const).map((f) => (
              <button
                key={f}
                onClick={() => !isReorderMode && setFilter(f)}
                disabled={isReorderMode}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filter === f
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Reorder Toggle */}
          <button
            onClick={toggleReorderMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition font-medium text-sm ${
              isReorderMode
                ? 'bg-purple-500 border-purple-500 text-white'
                : 'bg-white/60 border-purple-200 text-purple-700 hover:bg-purple-50'
            }`}
          >
            {isReorderMode ? <CheckCircle2 size={18} /> : <ArrowUpDown size={18} />}
            {isReorderMode ? 'Selesai' : 'Atur Urutan'}
          </button>
          </div>
        </div>

        {/* Add Item Button */}
        {!isReorderMode && (
        <div className="mb-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-full hover:shadow-lg transition"
          > 
            <Plus size={20} /> Tambah Wishlist
          </motion.button>
        </div>
        )}

        {/* Add Item Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 p-6 bg-white/80 backdrop-blur-md rounded-lg border-2 border-purple-200 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-amber-950">Tambah Wishlist Baru</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-600 hover:text-amber-950">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Judul wishlist"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {Object.entries(categoryInfo).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Deskripsi (opsional)"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  rows={2}
                />
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddItem}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-lg hover:shadow-lg transition"
                  >
                    Simpan
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
        </AnimatePresence>

        {/* Wishlist Items by Category */}
        <div className="space-y-12">
          {Object.entries(groupedItems).map(([categoryKey, categoryItems], categoryIndex) => {
            const category = categoryKey as keyof typeof categoryInfo;
            const { label, color } = categoryInfo[category];
            
            // Calculate stats for this category
            const allCategoryItems = items.filter((item) => item.category === category);
            const total = allCategoryItems.length;
            const completed = allCategoryItems.filter((i) => i.completed).length;
            const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent text-center`}>
                    {label}
                  </h3>
                  <div className={`h-1 w-16 bg-gradient-to-r ${color} rounded-full mt-2 mx-auto`} />
                  
                  {/* Category Progress Bar */}
                  {total > 0 && (
                    <div className="mt-4 max-w-xs mx-auto">
                      <div className="flex justify-between text-xs text-gray-500 mb-1 px-1">
                        <span>{completed}/{total} Selesai</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${color}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {categoryItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Belum ada wishlist di kategori ini 🤔</p>
                ) : isReorderMode ? (
                  // Reorder List View
                  <Reorder.Group axis="y" values={categoryItems} onReorder={(newOrder) => handleReorder(newOrder, categoryKey)} className="space-y-3">
                    {categoryItems.map((item) => (
                      <Reorder.Item key={item.id} value={item} className="bg-white/80 p-4 rounded-xl border border-purple-200 shadow-sm flex items-center gap-4 cursor-grab active:cursor-grabbing">
                         <div className="p-2 bg-purple-100 rounded text-purple-600 cursor-grab active:cursor-grabbing">
                           <GripVertical size={20}/>
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{item.title}</h4>
                            {item.description && <p className="text-xs text-gray-500 truncate">{item.description}</p>}
                         </div>
                         {item.completed && <CheckCircle2 size={20} className="text-green-500" />}
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                ) : (
                  // Standard Grid View
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 group hover:shadow-md ${
                          item.completed
                            ? 'bg-green-50/80 border-green-200'
                            : `bg-white/70 border-${categoryKey}-200 hover:border-${categoryKey}-300`
                        }`}
                      >
                        {/* Image Preview if Completed & Has Image */}
                        {item.completed && item.image && (
                          <div className="w-full h-32 overflow-hidden border-b border-green-100 relative group/image">
                            <img src={item.image} alt="Achievement" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                               <label className="cursor-pointer p-2 bg-white/80 rounded-full hover:bg-white transition">
                                  <Upload size={16} className="text-gray-700" />
                                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(item.id, e)} className="hidden" />
                               </label>
                            </div>
                          </div>
                        )}

                        <div className="p-5">
                          <div className="flex items-start gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleToggleItem(item.id)}
                              className="flex-shrink-0 mt-1"
                            >
                              {item.completed ? (
                                <CheckCircle2 size={24} className="text-green-500" fill="currentColor" />
                              ) : (
                                <Circle size={24} className="text-gray-400 hover:text-gray-600" />
                              )}
                            </motion.button>
                            
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-bold text-lg leading-tight mb-1 ${
                                  item.completed
                                    ? 'text-gray-500 line-through decoration-green-500/50'
                                    : 'text-gray-800'
                                }`}
                              >
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                              )}
                              
                              {/* Upload Option when Completed but no Image */}
                              {item.completed && !item.image && (
                                <div className="mt-3">
                                  <label className="inline-flex items-center gap-2 text-xs text-green-600 font-medium cursor-pointer hover:text-green-700 transition bg-green-100/50 px-3 py-1.5 rounded-full border border-green-200 hover:bg-green-100">
                                    <ImageIcon size={14} />
                                    <span>Upload Kenangan</span>
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(item.id, e)} className="hidden" />
                                  </label>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="flex-shrink-0 text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Confetti Animation when all completed */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <p className="text-2xl font-bold text-purple-600">Semua momen tercapai! 🥳</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
