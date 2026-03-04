'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, MapPin, X, Palette, Heart, Calendar, Bell, Upload, Loader2, Search, Share2, Edit, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabase';

interface LocationData {
  id: number;
  name: string;
  region: string;
  country: string;
  coords: [number, number]; // [lat, lng]
}

interface Checkpoint {
  id: number | string;
  lat: number;
  lng: number;
  caption: string;
  image: string;
  date: string;
  iso_date?: string;
}

const LOCATIONS: LocationData[] = [
  { id: 1, name: 'Bojongsari Lama', region: 'Jawa Barat', country: 'Indonesia', coords: [-6.4024, 106.7448] },
  { id: 2, name: 'Kepolorejo', region: 'Jawa Timur', country: 'Indonesia', coords: [-7.6465, 111.3265] },
];

// Haversine formula for distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Custom Icons
const createEmojiIcon = (emoji: string, className = '') => {
  return L.divIcon({
    className: `custom-emoji-marker ${className}`,
    html: `<div style="font-size: 2rem; line-height: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.2); filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const checkpointIcon = createEmojiIcon('📍', 'transition-all duration-300 ease-out');

// Component to handle map clicks
function MapEventHandler({ isAddingMarker, onMapClick }: { isAddingMarker: boolean, onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (isAddingMarker) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom() > 12 ? map.getZoom() : 12, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function Globe3D() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<LocationData | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [locations, setLocations] = useState<LocationData[]>(LOCATIONS);
  const [tempMarker, setTempMarker] = useState<{lat: number, lng: number} | null>(null);
  const [newCheckpointData, setNewCheckpointData] = useState({ caption: '', image: '', date: '' });
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite'>('roadmap');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editForm, setEditForm] = useState({ caption: '', date: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // LDR Tracker State
  const [ldrDays, setLdrDays] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // LDR Constants
  const ldrStartDate = new Date('2026-02-16');
  const nextMeetingDate = new Date('2026-03-18');
  const distance = calculateDistance(locations[0].coords[0], locations[0].coords[1], locations[1].coords[0], locations[1].coords[1]);

  useEffect(() => {
    setMounted(true);
    // Fix Leaflet default icon issue in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const fetchCheckpoints = async () => {
      const { data, error } = await supabase
        .from('location_checkins')
        .select('*');
      
      if (data) {
        setCheckpoints(data);
      }
    };
    fetchCheckpoints();

    const savedLocations = localStorage.getItem('map_locations');
    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    }
  }, []);

  // Realtime Subscription (Auto Update)
  useEffect(() => {
    const channel = supabase
      .channel('realtime_checkins')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'location_checkins' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setCheckpoints((prev) => [...prev, payload.new as Checkpoint]);
        } else if (payload.eventType === 'DELETE') {
          setCheckpoints((prev) => prev.filter((item) => item.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setCheckpoints((prev) => prev.map((item) => (item.id === payload.new.id ? (payload.new as Checkpoint) : item)));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Request Notification Permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, []);

  // LDR Timer Logic
  useEffect(() => {
    const now = new Date();
    const diffMs = now.getTime() - ldrStartDate.getTime();
    setLdrDays(Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const dist = nextMeetingDate.getTime() - currentTime;
      if (dist <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        setCountdown({
          days: Math.floor(dist / (1000 * 60 * 60 * 24)),
          hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((dist % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setTempMarker({ lat, lng });
    setSelectedCheckpoint(null);
    setActiveLocation(null);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCheckpointData({ ...newCheckpointData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCheckpoint = async () => {
    if (!tempMarker) return;

    setIsUploading(true);

    try {
      let imageUrl = "";

      if (selectedFile) {
        console.log(selectedFile);
        const fileName = `checkpoint-${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('ldr-tracker')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('ldr-tracker')
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrl;
      }

      const dateObj = newCheckpointData.date ? new Date(newCheckpointData.date) : new Date();
      const formattedDate = dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const isoDate = newCheckpointData.date || dateObj.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('location_checkins')
        .insert([{
          lat: tempMarker.lat,
          lng: tempMarker.lng,
          caption: newCheckpointData.caption,
          image: imageUrl,
          date: formattedDate,
          iso_date: isoDate
        }])
        .select();

      if (error) throw error;

      setTempMarker(null);
      setNewCheckpointData({ caption: '', image: '', date: '' });
      setSelectedFile(null);
      setIsAddingMarker(false);

    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Gagal menyimpan, cek console.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCheckpoint = async (id: number | string) => {
    const { error } = await supabase
      .from('location_checkins')
      .delete()
      .eq('id', id);
    if (!error) setCheckpoints(checkpoints.filter(c => c.id !== id));
    setSelectedCheckpoint(null);
    setEditingId(null);
  };

  const startEditing = (point: Checkpoint) => {
    setEditingId(point.id);
    setEditForm({ 
      caption: point.caption, 
      date: point.iso_date || new Date().toISOString().split('T')[0] 
    });
  };

  const saveEdit = async () => {
    if (editingId === null) return;
    const dateObj = new Date(editForm.date);
    const formattedDate = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const { error } = await supabase
      .from('location_checkins')
      .update({ caption: editForm.caption, date: formattedDate, iso_date: editForm.date })
      .eq('id', editingId);

    if (!error) {
      setCheckpoints(prev => prev.map(p => p.id === editingId ? {
        ...p,
        caption: editForm.caption,
        date: formattedDate,
        iso_date: editForm.date
      } : p));
    }
    setEditingId(null);
  };

  const countdownItems = [
    { label: 'Hari', value: countdown.days },
    { label: 'Jam', value: countdown.hours },
    { label: 'Menit', value: countdown.minutes },
    { label: 'Detik', value: countdown.seconds },
  ];

  const handleDragEnd = (id: number, e: any) => {
    const marker = e.target;
    const position = marker.getLatLng();
    setLocations(prev => {
      const updated = prev.map(loc => 
        loc.id === id ? { ...loc, coords: [position.lat, position.lng] as [number, number] } : loc
      );
      localStorage.setItem('map_locations', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCheckpointDragEnd = async (id: number | string, e: any) => {
    const marker = e.target;
    const position = marker.getLatLng();
    
    // Optimistic update (Update tampilan dulu biar cepat)
    setCheckpoints(prev => {
      return prev.map(point => 
        point.id === id ? { ...point, lat: position.lat, lng: position.lng } : point
      );
    });

    // Save to Supabase (Simpan ke database)
    await supabase.from('location_checkins').update({ 
      lat: position.lat, 
      lng: position.lng 
    }).eq('id', id);
  };

  const addToGoogleCalendar = () => {
    const title = encodeURIComponent("Ketemu Ayang ❤️");
    const details = encodeURIComponent("Saatnya bertemu dan melepas rindu! Jangan lupa bawa senyum manis.");
    const location = encodeURIComponent(`${locations[1].name}`);
    
    const startDate = nextMeetingDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(nextMeetingDate.getTime() + 24 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  const renderMapContent = (fullscreen: boolean) => (
    <div className={`relative bg-white/70 backdrop-blur-md rounded-2xl border-2 border-cyan-300 shadow-lg transition-all duration-500 overflow-hidden ${
      fullscreen ? 'w-full h-full max-w-none rounded-none border-0 bg-white p-0 flex flex-col' : 'p-4'
    }`}>
      
      {/* Close Button for Fullscreen */}
      {fullscreen && (
        <button 
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition z-[1000] shadow-md"
        >
          <X size={24} />
        </button>
      )}

      {/* Map Visualization */}
      <div className={`relative w-full ${fullscreen ? 'h-full' : 'aspect-square md:aspect-video min-h-[300px] md:min-h-[400px]'} rounded-xl overflow-hidden z-0`}>
        {mounted ? (
          <MapContainer
            center={[-7.0, 109.0]}
            zoom={6}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={mapTypeId === 'roadmap' 
                ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              }
            />
            
            <MapEventHandler isAddingMarker={isAddingMarker} onMapClick={handleMapClick} />
            <MapController center={flyToPosition} />

            {/* Main Locations */}
            {locations.map((loc) => (
              <Marker
                key={loc.id}
                position={loc.coords}
                draggable={true}
                icon={createEmojiIcon(loc.id === 1 ? '👑' : '👸')}
                eventHandlers={{
                  dragend: (e) => handleDragEnd(loc.id, e),
                  click: () => {
                    setActiveLocation(loc);
                    setFlyToPosition([...loc.coords]);
                  },
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold text-teal-800 text-lg">{loc.name}</h3>
                    <p className="text-sm text-gray-600">{loc.region}</p>
                    <p className="text-xs text-gray-500 mt-1">{loc.country}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* User Checkpoints */}
            {checkpoints.map((point) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                draggable={true}
                icon={checkpointIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedCheckpoint(point);
                    setFlyToPosition([point.lat, point.lng]);
                  },
                  dragend: (e) => handleCheckpointDragEnd(point.id, e),
                }}
              >
                <Popup>
                  <div className="p-1 max-w-[200px]">
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-2 bg-gray-100">
                      <img src={point.image} alt="Memory" className="w-full h-full object-cover" />
                    </div>
                    
                    {editingId === point.id ? (
                      <div className="space-y-2 mb-2">
                        <input 
                          type="text" 
                          value={editForm.caption}
                          onChange={(e) => setEditForm({...editForm, caption: e.target.value})}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        />
                        <input 
                          type="date" 
                          value={editForm.date}
                          onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-800 mb-1">{point.caption}</p>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{point.date}</span>
                      <div className="flex gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const text = encodeURIComponent(`Lihat kenangan kita "${point.caption}" 📍\nhttps://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`);
                            window.open(`https://wa.me/?text=${text}`, '_blank');
                          }}
                          className="text-green-500 hover:text-green-700 p-1 bg-green-50 rounded-full transition"
                          title="Bagikan ke WhatsApp"
                        >
                          <Share2 size={14} />
                        </button>
                        {editingId === point.id ? (
                          <button onClick={(e) => { e.stopPropagation(); saveEdit(); }} className="text-green-500 hover:text-green-700 p-1 bg-green-50 rounded-full transition">
                            <Check size={14} />
                          </button>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); startEditing(point); }} className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 rounded-full transition">
                            <Edit size={14} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCheckpoint(point.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-full transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Temp Marker for Adding */}
            {tempMarker && (
              <Marker
                position={[tempMarker.lat, tempMarker.lng]}
                icon={createEmojiIcon('📍', 'transition-all duration-300 ease-out')}
              />
            )}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
            <Loader2 size={32} className="animate-spin mb-2" />
            <p>Loading Maps...</p>
          </div>
        )}

        {/* Zoomed Image Modal */}
        <AnimatePresence>
          {zoomedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[2000] bg-black/90 flex items-center justify-center p-4"
              onClick={() => setZoomedImage(null)}
            >
              <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full object-contain" />
              <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition"><X size={24} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Checkpoint Modal Overlay */}
        <AnimatePresence>
          {tempMarker && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-2xl z-[1000] border-2 border-cyan-100"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-teal-800">Tambah Kenangan Baru</h4>
                <button onClick={() => setTempMarker(null)} className="text-gray-400 hover:text-red-500"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 border-2 border-dashed border-cyan-300 rounded-lg hover:bg-cyan-50 transition text-gray-600 text-sm">
                    <Upload size={16} />
                    <span className="truncate">{newCheckpointData.image ? 'Ganti Foto' : 'Upload Foto'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {newCheckpointData.image && (
                    <div 
                      className="w-10 h-10 rounded overflow-hidden border border-gray-200 cursor-zoom-in hover:ring-2 hover:ring-cyan-400 transition bg-white"
                      onClick={() => setZoomedImage(newCheckpointData.image)}
                      title="Klik untuk memperbesar"
                    >
                      <img src={newCheckpointData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <input
                  type="date"
                  value={newCheckpointData.date}
                  onChange={(e) => setNewCheckpointData({ ...newCheckpointData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Tulis caption momen ini..."
                  value={newCheckpointData.caption}
                  onChange={(e) => setNewCheckpointData({ ...newCheckpointData, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  onClick={handleSaveCheckpoint}
                  disabled={!newCheckpointData.image || isUploading}
                  className="w-full py-2 bg-teal-500 text-white rounded-lg font-semibold text-sm hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex justify-center items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    'Simpan Lokasi'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Mode Indicator */}
        {isAddingMarker && !tempMarker && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-2 w-full max-w-sm px-4">
            <div className="bg-teal-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-bounce">
              Klik di peta atau cari lokasi 👇
            </div>
            
            <div className="relative w-full pointer-events-auto">
              <div className="flex shadow-lg rounded-lg overflow-hidden bg-white">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Cari nama tempat..."
                  className="flex-1 px-4 py-2 border-none focus:outline-none text-gray-800"
                />
                <button 
                  onClick={handleSearch}
                  className="bg-white px-3 text-gray-500 hover:text-teal-500 border-l"
                >
                  {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                </button>
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex flex-col"
                      onClick={() => {
                        const lat = parseFloat(result.lat);
                        const lng = parseFloat(result.lon);
                        setTempMarker({ lat, lng });
                        setFlyToPosition([lat, lng]);
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                    >
                      <span className="font-medium text-gray-800 truncate">{result.display_name.split(',')[0]}</span>
                      <span className="text-xs text-gray-500 truncate">{result.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={`flex flex-wrap justify-center gap-4 mt-6 ${fullscreen ? 'absolute bottom-8 left-1/2 -translate-x-1/2 mt-0 bg-white/90 p-4 rounded-2xl backdrop-blur-md shadow-xl z-[1000]' : ''}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingMarker(!isAddingMarker)}
          className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-full transition ${
            isAddingMarker ? 'bg-red-500 text-white' : 'bg-cyan-500 text-white hover:bg-cyan-600'
          }`}
        >
          {isAddingMarker ? <X size={18} /> : <MapPin size={18} />}
          {isAddingMarker ? 'Batal' : 'Tambah Kenangan'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMapTypeId(prev => prev === 'roadmap' ? 'satellite' : 'roadmap')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition"
        >
          <Palette size={18} /> {mapTypeId === 'roadmap' ? 'Satelit' : 'Peta'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 text-teal-700 font-semibold rounded-full hover:bg-teal-100 transition"
        >
          {fullscreen ? <X size={18} /> : <Maximize2 size={18} />} 
          {fullscreen ? 'Exit' : 'Fullscreen'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <section id="ldr-tracker" className="py-24 px-4 bg-gradient-to-b from-blue-50/30 to-cyan-50/20">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-amber-950 mb-4">
            📍 LDR Tracker & Map
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">Jarak yang memisahkan tapi tidak memandulkan</p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {isFullscreen && mounted ? createPortal(
            <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
              {renderMapContent(true)}
            </div>,
            document.body
          ) : (
            renderMapContent(false)
          )}
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 mt-16">
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
              {distance.toLocaleString()} <span className="text-2xl">km</span>
            </motion.div>
            <p className="text-sm text-blue-800 text-center">
              {locations[0].name} → {locations[1].name}
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

          {/* Motto Card */}
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

          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addToGoogleCalendar}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 hover:bg-white text-amber-900 font-semibold rounded-full shadow-sm border border-amber-200 transition"
            >
              <Calendar size={18} /> Simpan ke Google Calendar
            </motion.button>
            <p className="text-xs text-gray-500 mt-2">
              <Bell size={12} className="inline mr-1" /> Notifikasi akan muncul saat hitung mundur selesai
            </p>
          </div>
        </motion.div>

        {/* Locations Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { location: locations[0], emoji: '👑', label: 'Lokasi Ku' },
            { location: locations[1], emoji: '👸', label: 'Lokasi Dia' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveLocation(item.location)}
              className="p-6 bg-white/50 backdrop-blur-md rounded-xl border-2 border-amber-200 text-center cursor-pointer hover:border-amber-400 transition"
            >
              <h4 className="text-2xl font-bold text-amber-950 mb-2">
                {item.emoji} {item.label}
              </h4>
              <p className="text-lg text-gray-700">{item.location.name}</p>
              <p className="text-sm text-gray-600 mt-2">
                📍 {item.location.coords[0].toFixed(2)}°, {item.location.coords[1].toFixed(2)}°
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
