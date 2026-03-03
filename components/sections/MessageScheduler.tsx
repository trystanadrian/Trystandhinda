'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Upload, Move, Check, ZoomIn, ZoomOut, Calendar, MessageCircle, Trash2, Maximize2, Search, ArrowUpDown, ChevronDown } from 'lucide-react';

interface ChatMemory {
  id: number;
  date: string;
  image: string;
  caption: string;
}

export default function MessageScheduler() {
  const [memories, setMemories] = useState<ChatMemory[]>([
    {
      id: 1,
      date: '15 Jan 2024',
      image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop',
      caption: 'Chat pagi yang bikin senyum 😊',
    },
    {
      id: 2,
      date: '20 Feb 2024',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      caption: 'Inget gak pas kita bahas ini? 😂',
    },
    {
      id: 3,
      date: '10 Mar 2024',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop',
      caption: 'Ucapan malam ter-sweet ❤️',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({ date: '', image: '', caption: '' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Cropping State
  const [isCropping, setIsCropping] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCropImage(imageUrl);
      setIsCropping(true);
      setCropScale(1);
      setCropOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - cropOffset.x, y: clientY - cropOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setCropOffset({
        x: clientX - dragStart.x,
        y: clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropSave = () => {
    if (imgRef.current && cropImage) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set output resolution (HD 16:9)
      canvas.width = 1280;
      canvas.height = 720;

      // Calculate ratio between preview (320px width) and canvas (1280px width)
      const ratio = canvas.width / 320;

      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply transformations
        ctx.translate(cropOffset.x * ratio, cropOffset.y * ratio);
        ctx.scale(cropScale, cropScale);
        
        // Draw image (assuming preview width is 320px, so we draw at 1280px width on canvas)
        ctx.drawImage(imgRef.current, 0, 0, 1280, (1280 / imgRef.current.width) * imgRef.current.height);
        
        const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
        setNewMemory({ ...newMemory, image: croppedUrl });
        setIsCropping(false);
        setCropImage(null);
      }
    }
  };

  const addMemory = () => {
    if (newMemory.image) {
      setMemories([
        ...memories,
        {
          id: Date.now(),
          date: newMemory.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          image: newMemory.image,
          caption: newMemory.caption,
        },
      ]);
      setNewMemory({ date: '', image: '', caption: '' });
      setShowAddForm(false);
    }
  };

  const deleteMemory = (id: number) => {
    setMemories(memories.filter((m) => m.id !== id));
  };

  // Extract available years from memories
  const availableYears = Array.from(new Set(memories.map(m => {
    const d = new Date(m.date);
    return !isNaN(d.getTime()) ? d.getFullYear().toString() : null;
  }))).filter((y): y is string => y !== null).sort((a, b) => Number(b) - Number(a));

  const months = [
    { value: '0', label: 'Januari' },
    { value: '1', label: 'Februari' },
    { value: '2', label: 'Maret' },
    { value: '3', label: 'April' },
    { value: '4', label: 'Mei' },
    { value: '5', label: 'Juni' },
    { value: '6', label: 'Juli' },
    { value: '7', label: 'Agustus' },
    { value: '8', label: 'September' },
    { value: '9', label: 'Oktober' },
    { value: '10', label: 'November' },
    { value: '11', label: 'Desember' },
  ];

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.date.toLowerCase().includes(searchQuery.toLowerCase());

    const d = new Date(memory.date);
    const isValidDate = !isNaN(d.getTime());
    
    const matchesYear = selectedYear === 'all' || (isValidDate && d.getFullYear().toString() === selectedYear);
    const matchesMonth = selectedMonth === 'all' || (isValidDate && d.getMonth().toString() === selectedMonth);

    return matchesSearch && matchesYear && matchesMonth;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const displayedMemories = filteredMemories.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <section id="chat-memories" className="py-24 px-4 bg-gradient-to-b from-cyan-50/20 to-blue-50/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-teal-700 mb-4">
            💬 Chat Memories
          </h2>
          <p className="text-lg text-teal-600">Kumpulan screenshot chat lucu & manis kita</p>
        </motion.div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col gap-4 max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari kenangan chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-cyan-200 focus:border-cyan-400 focus:outline-none bg-white/80 backdrop-blur-sm shadow-sm transition-all"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {/* Year Filter */}
              <div className="relative min-w-[110px]">
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-white/80 border-2 border-cyan-200 rounded-full text-teal-700 font-medium focus:outline-none focus:border-cyan-400 pr-8 cursor-pointer"
                >
                  <option value="all">Tahun</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-700 pointer-events-none" size={16} />
              </div>

              {/* Month Filter */}
              <div className="relative min-w-[110px]">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-white/80 border-2 border-cyan-200 rounded-full text-teal-700 font-medium focus:outline-none focus:border-cyan-400 pr-8 cursor-pointer"
                >
                  <option value="all">Bulan</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-700 pointer-events-none" size={16} />
              </div>

              <button
                onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center gap-2 px-4 py-3 bg-white/80 border-2 border-cyan-200 rounded-full text-teal-700 font-medium hover:bg-cyan-50 transition min-w-[120px] justify-center whitespace-nowrap"
              >
                <ArrowUpDown size={18} />
                {sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}
              </button>
            </div>
          </div>
        </div>

        {/* Add Message Button */}
        <div className="text-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-bold rounded-full hover:shadow-lg transition"
          >
            <Plus size={20} /> Tambah Screenshot
          </motion.button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12 overflow-hidden"
          >
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-cyan-300 shadow-xl max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-teal-700">Upload Screenshot Chat</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-red-500 transition">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="flex justify-center">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-teal-700 mb-2 text-center">📸 Screenshot</label>
                    {newMemory.image ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-cyan-200 group">
                        <img src={newMemory.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer px-4 py-2 bg-white/90 rounded-full text-sm font-bold hover:bg-white transition">
                            Ganti Gambar
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-cyan-300 rounded-xl hover:bg-cyan-50 transition cursor-pointer group">
                        <div className="p-4 bg-cyan-100 rounded-full text-cyan-500 mb-3 group-hover:scale-110 transition-transform">
                          <Upload size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Klik untuk upload screenshot</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-teal-700 mb-2">📅 Tanggal (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 12 Jan 2024"
                      value={newMemory.date}
                      onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-teal-700 mb-2">📝 Caption</label>
                    <input
                      type="text"
                      placeholder="Tulis sesuatu..."
                      value={newMemory.caption}
                      onChange={(e) => setNewMemory({ ...newMemory, caption: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addMemory}
                    disabled={!newMemory.image}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Simpan Kenangan
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Memories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedMemories.map((memory, idx) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-cyan-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setSelectedImage(memory.image)}>
                <img 
                  src={memory.image} 
                  alt={memory.caption} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-gray-700">
                    <Maximize2 size={16} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md">
                    <Calendar size={12} />
                    {memory.date}
                  </div>
                  <button 
                    onClick={() => deleteMemory(memory.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <p className="text-gray-800 font-medium leading-relaxed">
                  {memory.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredMemories.length > visibleCount && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="px-8 py-3 bg-white border-2 border-cyan-300 text-teal-700 font-bold rounded-full hover:bg-cyan-50 transition shadow-sm"
            >
              Muat Lebih Banyak ({filteredMemories.length - visibleCount})
            </motion.button>
          </div>
        )}

        {/* Empty State */}
        {filteredMemories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p>{searchQuery ? 'Tidak ada kenangan yang cocok dengan pencarian.' : 'Belum ada screenshot chat yang disimpan.'}</p>
          </div>
        )}

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
              >
                <img src={selectedImage} alt="Full view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
                >
                  <X size={32} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crop Modal */}
        {isCropping && cropImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Sesuaikan Gambar</h3>
                <button onClick={() => setIsCropping(false)} className="text-gray-500 hover:text-red-500">
                  <X size={24} />
                </button>
              </div>

              {/* Cropper Area (16:9 Aspect Ratio) */}
              <div 
                className="relative w-full aspect-video bg-gray-900 overflow-hidden rounded-lg cursor-move touch-none border-2 border-dashed border-gray-300"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
              >
                <img
                  ref={imgRef}
                  src={cropImage}
                  alt="Crop Preview"
                  className="absolute top-0 left-0 max-w-none origin-top-left select-none pointer-events-none"
                  style={{
                    width: '320px', // Fixed preview width base
                    transform: `translate(${cropOffset.x}px, ${cropOffset.y}px) scale(${cropScale})`,
                  }}
                  draggable={false}
                />
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="w-full h-1/3 border-b border-white"></div>
                  <div className="w-full h-1/3 border-b border-white top-1/3 absolute"></div>
                  <div className="h-full w-1/3 border-r border-white absolute top-0 left-0"></div>
                  <div className="h-full w-1/3 border-r border-white absolute top-0 left-1/3"></div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <ZoomOut size={18} className="text-gray-500" />
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={cropScale}
                    onChange={(e) => setCropScale(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <ZoomIn size={18} className="text-gray-500" />
                </div>
                
                <button
                  onClick={handleCropSave}
                  className="w-full py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition flex items-center justify-center gap-2"
                >
                  <Check size={20} /> Potong & Simpan
                </button>
                <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                  <Move size={12} /> Geser gambar untuk menyesuaikan posisi
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
