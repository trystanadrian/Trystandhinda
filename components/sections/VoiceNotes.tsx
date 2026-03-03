'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, Upload, User, UserCheck } from 'lucide-react';

interface VoiceNote {
  id: number;
  duration: string;
  timestamp: string;
  url: string; // For future Supabase integration
  sender: 'me' | 'partner';
  name: string;
}

export default function VoiceNotesRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([
    {
      id: 1,
      duration: '0:45',
      timestamp: '09:30',
      url: '', 
      sender: 'partner',
      name: 'Morning Voice ☀️'
    },
    {
      id: 2,
      duration: '0:12',
      timestamp: '09:32',
      url: '', 
      sender: 'me',
      name: 'Morning too sayang!'
    }
  ]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [uploadSender, setUploadSender] = useState<'me' | 'partner'>('me');
  const [customName, setCustomName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);

        const newNote: VoiceNote = {
          id: Date.now(),
          duration: `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`,
          timestamp: new Date().toLocaleString('id-ID'),
          url,
          sender: 'me',
          name: `Voice Note #${voiceNotes.length + 1}`,
        };

        setVoiceNotes((prev) => [...prev, newNote]);
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Harap izinkan akses microphone untuk merekam suara 🎤');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    
    audio.onloadedmetadata = () => {
        const duration = audio.duration;
        const mins = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60);
        const formattedDuration = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        const newNote: VoiceNote = {
            id: Date.now(),
            duration: formattedDuration,
            timestamp: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            url,
            sender: uploadSender,
            name: customName || file.name
        };
        
        setVoiceNotes(prev => [...prev, newNote]);
        setCustomName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
  };

  const togglePlay = (url: string, id: number) => {
    if (!url) return;
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingId(id);
    }
  };

  const deleteNote = (id: number) => {
    setVoiceNotes(voiceNotes.filter((note) => note.id !== id));
    if (playingId === id) {
      setPlayingId(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="voice-notes" className="py-24 px-4 bg-gradient-to-b from-blue-50/40 to-cyan-50/20">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-teal-700 mb-4">
            🎤 Voice Notes
          </h2>
          <p className="text-lg text-teal-600">Chat suara kita, tersimpan selamanya</p>
        </motion.div>

        {/* Recorder Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-6 bg-white/70 backdrop-blur-md rounded-2xl border-2 border-cyan-300 shadow-lg mb-12"
        >
          <div className="text-center">
            {/* Recording Timer */}
            {isRecording && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mb-6"
              >
                <p className="text-4xl font-bold text-red-500">{formatTime(recordingTime)}</p>
              </motion.div>
            )}

            {/* Record Button */}
            <div className="flex justify-center gap-4 mb-6">
              {!isRecording ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold rounded-full hover:shadow-lg transition"
                >
                  <Mic size={24} /> Mulai Rekam
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold rounded-full hover:shadow-lg transition"
                >
                  <Square size={24} fill="white" /> Stop
                </motion.button>
              )}
            </div>

            {/* Manual Upload Section */}
            <div className="mt-8 pt-6 border-t border-cyan-100">
              <h4 className="text-sm font-bold text-teal-700 mb-4">Atau Tambah Rekaman Manual</h4>
              <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
                <input
                  type="text"
                  placeholder="Nama rekaman..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-cyan-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full md:w-auto"
                />
                
                <div className="flex bg-white rounded-lg border border-cyan-200 p-1">
                  <button
                    onClick={() => setUploadSender('me')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${uploadSender === 'me' ? 'bg-cyan-100 text-cyan-700' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    Aku
                  </button>
                  <button
                    onClick={() => setUploadSender('partner')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${uploadSender === 'partner' ? 'bg-pink-100 text-pink-700' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    Dia
                  </button>
                </div>

                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-cyan-300 text-teal-700 text-sm font-semibold rounded-lg hover:bg-cyan-50 transition"
                >
                  <Upload size={16} /> Upload File
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        {voiceNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/50 max-h-[600px] overflow-y-auto custom-scrollbar"
          >
            {voiceNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${note.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`relative max-w-[85%] md:max-w-[60%] p-3 rounded-2xl shadow-sm flex items-center gap-3 border ${
                    note.sender === 'me' 
                      ? 'bg-teal-100 border-teal-200 rounded-tr-none' 
                      : 'bg-white border-gray-200 rounded-tl-none'
                  }`}
                >
                  <button
                    onClick={() => togglePlay(note.url, note.id)}
                    className={`p-3 rounded-full transition flex-shrink-0 ${
                      playingId === note.id 
                        ? 'bg-red-400 text-white animate-pulse' 
                        : note.sender === 'me' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {playingId === note.id ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  </button>

                  <div className="flex-1 min-w-[100px]">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${note.sender === 'me' ? 'text-teal-800' : 'text-gray-800'}`}>
                        {note.name}
                      </h4>
                    </div>
                    <div className="flex justify-between items-end text-xs opacity-70">
                      <span className="font-mono">{note.duration}</span>
                      <span className="ml-3">{note.timestamp}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition self-start -mr-1 -mt-1"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Hidden audio element */}
        <audio ref={audioRef} onEnded={() => setPlayingId(null)} />
      </div>
    </section>
  );
}
