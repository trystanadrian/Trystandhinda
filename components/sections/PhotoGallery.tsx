'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Search, Heart, X, ZoomIn, ZoomOut, Download, Share2, Filter, ChevronLeft, ChevronRight, Play, Pause, Plus, Upload, Trash2, Edit, Layers } from 'lucide-react';

interface GalleryPhoto {
  id: number;
  url: string;
  title: string;
  category: string;
  liked: boolean;
}

const mockPhotos: GalleryPhoto[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=800&fit=crop',
    title: 'First Date',
    category: 'Moments',
    liked: false,
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    title: 'Together',
    category: 'Selfies',
    liked: false,
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1494822893917-64971a432d2a?w=600&h=600&fit=crop',
    title: 'Adventure',
    category: 'Travel',
    liked: false,
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=900&fit=crop',
    title: 'Sunset',
    category: 'Nature',
    liked: false,
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=500&fit=crop',
    title: 'Smile',
    category: 'Selfies',
    liked: true,
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop',
    title: 'Hiking',
    category: 'Travel',
    liked: false,
  },
];

const categories = ['All', 'Moments', 'Selfies', 'Travel', 'Nature'];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState(mockPhotos);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const controls = useAnimation();
  const [columns, setColumns] = useState(1);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [uploadData, setUploadData] = useState({ title: '', category: 'Moments' });
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const columnTransforms = [y1, y2, y3];

  const filteredPhotos = useMemo(() => photos.filter((photo) => {
    const categoryMatch = selectedCategory === 'All' || photo.category === selectedCategory;
    const searchMatch = photo.title.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  }), [photos, selectedCategory, searchQuery]);

  // Load from Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('gallery_photos');
    if (saved) {
      try {
        setPhotos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse gallery photos", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to Local Storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gallery_photos', JSON.stringify(photos));
    }
  }, [photos, isLoaded]);

  // Responsive Masonry Columns
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 640) setColumns(2);
      else setColumns(1);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const columnPhotos = useMemo(() => {
    const cols = Array.from({ length: columns }, () => [] as GalleryPhoto[]);
    filteredPhotos.forEach((photo, i) => {
      cols[i % columns].push(photo);
    });
    return cols;
  }, [filteredPhotos, columns]);

  const toggleLike = (id: number) => {
    setPhotos(photos.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)));
  };

  const downloadPhoto = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'memory.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNavigate = useCallback((direction: 'next' | 'prev') => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredPhotos.length;
    } else {
      newIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    }
    setSelectedPhoto(filteredPhotos[newIndex]);
    setScale(1);
  }, [selectedPhoto, filteredPhotos]);

  // Handle Zoom Animation & Reset
  useEffect(() => {
    controls.start({ scale });
    if (scale === 1) {
      controls.start({ x: 0, y: 0 });
    }
  }, [scale, controls]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedPhoto) {
      interval = setInterval(() => {
        handleNavigate('next');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedPhoto, handleNavigate]);

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleNavigate('prev');
      if (e.key === 'ArrowRight') handleNavigate('next');
      if (e.key === 'Escape') { setSelectedPhoto(null); setIsPlaying(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, handleNavigate]);

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Prevent flickering when dragging over children
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      const promises = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then(images => {
        setNewPhotos(images);
        setShowUploadModal(true);
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const promises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then(images => {
        setNewPhotos(images);
        setShowUploadModal(true);
      });
    }
  };

  const handleAddPhotos = () => {
    if (newPhotos.length > 0 && uploadData.title) {
      const newId = Math.max(...photos.map(p => p.id), 0) + 1;
      const newEntries = newPhotos.map((img, idx) => ({
        id: newId + idx,
        url: img,
        title: newPhotos.length > 1 ? `${uploadData.title} (${idx + 1})` : uploadData.title,
        category: uploadData.category,
        liked: false
      }));
      
      setPhotos([...newEntries, ...photos]);
      setNewPhotos([]);
      setUploadData({ title: '', category: 'Moments' });
      setShowUploadModal(false);
    }
  };

  const handleSaveEdit = () => {
    if (editingPhoto && editingPhoto.title) {
      setPhotos(photos.map(p => p.id === editingPhoto.id ? editingPhoto : p));
      setEditingPhoto(null);
    }
  };

  const handleDeletePhoto = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      setPhotos(prev => prev.filter(p => p.id !== id));
      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
        setIsPlaying(false);
      }
    }
  };

  return (
    <section 
      id="gallery" 
      className="py-24 px-4 bg-gradient-to-b from-blue-50/30 to-cyan-50/20 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      <AnimatePresence>
        {isDraggingFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-teal-500/10 backdrop-blur-sm border-4 border-dashed border-teal-500 flex flex-col items-center justify-center pointer-events-none rounded-xl m-4"
          >
            <div className="bg-white p-6 rounded-full shadow-xl animate-bounce">
              <Upload size={48} className="text-teal-600" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-teal-800 bg-white/80 px-6 py-2 rounded-full">
              Lepaskan foto di sini (Bisa banyak!)
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-teal-800 mb-4">
            📸 Our Gallery
          </h2>
          <p className="text-lg text-teal-600">Koleksi momen terbaik kita dalam satu dinding kenangan</p>
        </motion.div>

        {/* Controls */}
        <div className="sticky top-4 z-30 mb-8">
          <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari momen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 flex-1 md:flex-none">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className="p-2 md:px-4 md:py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition shadow-md flex items-center gap-2 flex-shrink-0"
                title="Upload Foto"
              >
                <Plus size={18} />
                <span className="hidden md:inline text-sm font-medium">Upload</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div ref={galleryRef} className="flex gap-6 items-start">
          {columnPhotos.map((col, colIndex) => (
            <motion.div 
              key={colIndex} 
              className="flex-1 flex flex-col gap-6"
              style={{ y: columnTransforms[colIndex % 3] }}
            >
              <AnimatePresence>
              {col.map((photo, idx) => (
              <motion.div
                layout
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-zoom-in shadow-md hover:shadow-xl transition-all duration-300 bg-gray-100"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs text-white mb-2 border border-white/30">
                      {photo.category}
                    </span>
                    <h3 className="text-white font-bold text-xl">{photo.title}</h3>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingPhoto(photo);
                  }}
                  className="absolute top-4 left-14 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 text-gray-400 hover:text-blue-500"
                  title="Edit Foto"
                >
                  <Edit size={18} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePhoto(photo.id);
                  }}
                  className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 text-gray-400 hover:text-red-500"
                  title="Hapus Foto"
                >
                  <Trash2 size={18} />
                </button>

                {/* Like Button (Always visible on mobile, hover on desktop) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(photo.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                >
                  <Heart
                    size={18}
                    className={photo.liked ? 'text-red-500 fill-current' : 'text-gray-400'}
                  />
                </button>
              </motion.div>
            ))}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Tidak ada momen yang ditemukan</p>
          </motion.div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              onClick={() => { setSelectedPhoto(null); setIsPlaying(false); }}
            >
              {/* Ambient Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-black/70 z-10" />
                <img 
                  src={selectedPhoto.url} 
                  className="w-full h-full object-cover blur-[100px] opacity-80 scale-110"
                  alt=""
                />
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNavigate('prev'); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition z-50 hover:scale-110"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNavigate('next'); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition z-50 hover:scale-110"
              >
                <ChevronRight size={32} />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative z-20 max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image */}
                <div 
                  ref={containerRef}
                  className="relative rounded-lg overflow-hidden shadow-2xl w-full flex justify-center items-center"
                  style={{ maxHeight: '80vh' }}
                >
                  <motion.img 
                    src={selectedPhoto.url} 
                    alt={selectedPhoto.title} 
                    className="max-w-full max-h-[80vh] object-contain cursor-grab active:cursor-grabbing"
                    animate={controls}
                    drag={scale > 1}
                    dragConstraints={scale > 1 ? undefined : containerRef}
                    dragElastic={0.1}
                    onDoubleClick={() => setScale(s => s > 1 ? 1 : 2.5)}
                  />
                </div>

                {/* Info Bar */}
                <div className="mt-6 flex items-center justify-between w-full max-w-2xl text-white px-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedPhoto.title}</h3>
                    <p className="text-white/60">{selectedPhoto.category}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setScale(s => s > 1 ? 1 : 2.5)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-md"
                    >
                      {scale > 1 ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
                    </button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-md"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button 
                      onClick={() => toggleLike(selectedPhoto.id)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-md"
                    >
                      <Heart size={24} className={selectedPhoto.liked ? 'text-red-500 fill-current' : 'text-white'} />
                    </button>
                    <button 
                      onClick={() => downloadPhoto(selectedPhoto.url)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-md"
                    >
                      <Download size={24} />
                    </button>
                    <button 
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-md"
                    >
                      <Share2 size={24} />
                    </button>
                    <button 
                      onClick={() => handleDeletePhoto(selectedPhoto.id)}
                      className="p-3 bg-white/10 hover:bg-red-500/20 rounded-full transition backdrop-blur-md text-white hover:text-red-400"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => { setSelectedPhoto(null); setIsPlaying(false); }}
                  className="absolute -top-12 right-4 text-white/50 hover:text-white transition"
                >
                  <X size={32} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
                
                <h3 className="text-2xl font-bold text-teal-800 mb-6">Upload Foto Baru</h3>
                
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="w-full aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer">
                    {newPhotos.length > 0 ? (
                        <div className="w-full h-full relative">
                            {newPhotos.length === 1 ? (
                                <img src={newPhotos[0]} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full grid grid-cols-2 gap-1 p-1 overflow-y-auto bg-gray-50">
                                    {newPhotos.map((img, idx) => (
                                        <img key={idx} src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded-sm" />
                                    ))}
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Layers size={12} /> {newPhotos.length} Foto
                                    </div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-white font-medium">Ganti Pilihan</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-4">
                            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-sm text-gray-500">Klik untuk upload foto (Bisa banyak)</p>
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={handleImageUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul / Caption</label>
                    <input 
                        type="text" 
                        value={uploadData.title}
                        onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="Contoh: Liburan di Bali"
                    />
                  </div>

                  {/* Category Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                        value={uploadData.category}
                        onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    >
                        {categories.filter(c => c !== 'All').map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                  </div>

                  <button 
                    onClick={handleAddPhotos}
                    disabled={newPhotos.length === 0 || !uploadData.title}
                    className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    Simpan {newPhotos.length > 1 ? `${newPhotos.length} Foto` : 'Foto'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
              >
                <button 
                  onClick={() => setEditingPhoto(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
                
                <h3 className="text-2xl font-bold text-teal-800 mb-6">Edit Foto</h3>
                
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                    <img src={editingPhoto.url} alt="Preview" className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                    <input 
                        type="text" 
                        value={editingPhoto.title}
                        onChange={(e) => setEditingPhoto({...editingPhoto, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                        value={editingPhoto.category}
                        onChange={(e) => setEditingPhoto({...editingPhoto, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                        {categories.filter(c => c !== 'All').map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                  </div>

                  <button 
                    onClick={handleSaveEdit}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition mt-2"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
