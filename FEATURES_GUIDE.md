# 💕 trystandhinda - Complete Guide

## Project Summary

**trystandhinda** adalah sebuah website digital time capsule yang romantic dan interactive untuk pasangan LDR (Long Distance Relationship). Website ini bukan hanya sekadar album foto, tetapi pengalaman emosional yang penuh dengan fitur-fitur unik, animasi halus, dan personalisasi mendalam.

**Motto Utama:** "No Distance Can Downgrade Us" ❤️

---

## ✨ Semua Fitur yang Sudah Dibangun

### 1. 🔐 **Authentication System** 
**File:** `components/AuthGuard.tsx`

- Password protection di seluruh website
- Default password: `16022026` (format DDMMYYYY)
- Hint: Tanggal pertama kalian photobooth
- Local storage untuk menyimpan session
- Logout button di bottom right

**Cara mengubah password:**
```typescript
// Di components/AuthGuard.tsx
const CORRECT_PASSWORD = '16022026'; // Ubah sini
```

---

### 2. 📷 **Album Kebersamaan** (Shared Album)
**File:** `components/sections/Album.tsx`

**Fitur:**
- Grid layout untuk album collection
- Click untuk membuka album detail
- Modal dengan photo carousel
- "What I felt that day" - button untuk lihat cerita & emosi
- Navigation buttons untuk slide foto
- Hover effects & animations

**Data Structure:**
```typescript
const mockAlbums: Album[] = [
  {
    id: 1,
    title: 'First Date',
    cover: 'image-url',
    month: 'Januari',
    year: 2025,
    photos: [
      {
        id: 1,
        image: 'image-url',
        story: 'Cerita di balik foto',
        date: '15 Januari 2025',
        emotion: 'Bahagia dengan gugup 💕',
      },
    ],
  },
];
```

**Cara menambah album:**
1. Buka `components/sections/Album.tsx`
2. Tambah object ke `mockAlbums` array
3. Gunakan image URL (bisa dari Unsplash atau Supabase storage)

---

### 3. 🕰️ **Timeline Momen Penting** (Important Moments)
**File:** `components/sections/Timeline.tsx`

**Fitur:**
- Vertical timeline dengan alternating layout (kiri-kanan)
- Animated dots saat scroll
- Add/Edit/Delete momen secara real-time
- Form untuk menambah momen baru
- Icon & emoji support
- Sorted by date

**Button Fitur:**
- "Tambah Momen" button dengan gradient
- Delete button di setiap event
- Form validation

**Cara menggunakan:**
1. Default events di `mockEvents` array
2. User bisa click "Tambah Momen" untuk add event
3. Setiap event punya: title, description, date, icon

---

### 4. ✅ **Wishlist & Future Plans**
**File:** `components/sections/Wishlist.tsx`

**4 Kategori:**
- 🌍 Tempat Impian (Dream Places)
- ✨ Hal Random (Random Things)
- 🎯 Target Bersama (Life Goals)
- 💕 Hal Kecil (Little Moments)

**Fitur:**
- Interactive checkboxes
- Progress bar dengan percentage
- "Relationship Completion" stat
- Confetti animation ketika semua selesai
- Add/Delete/Check items
- Grouped by category

**Data Structure:**
```typescript
interface WishlistItem {
  id: number;
  title: string;
  category: 'place' | 'random' | 'together' | 'small';
  completed: boolean;
  description?: string;
}
```

---

### 5. 🌍 **Peta Dunia Kita** (Our World Map)
**File:** `components/sections/LocationsGlobe.tsx`

**Fitur:**
- SVG-based interactive map
- Animated connecting line antara dua kota
- Hover effects untuk location cards
- Personal markers (🧸 untuk kamu, 👑 untuk dia)
- Distance facts & information

**Lokasi Default:**
- Bojongsari, Depok (latitude: -6.35, longitude: 106.82)
- Kepolorejo, Magetan (latitude: -7.65, longitude: 111.30)

**Cara mengubah lokasi:**
```typescript
const myLocation: LocationInfo = {
  name: 'Bojongsari, Depok',
  coordinates: [-6.35, 106.82],
};
```

---

### 6. 📍 **LDR Distance Tracker**
**File:** `components/sections/LDRTracker.tsx`

**Menampilkan:**
- 🗺️ Jarak antar kota (dalam KM)
- 💕 Berapa hari sudah LDR
- ⏰ Countdown ke pertemuan berikutnya
- Koordinat lokasi
- Motto card yang glow

**Dates untuk disesuaikan:**
```typescript
const ldrStartDate = new Date('2024-01-15'); // Kapan LDR mulai
const nextMeetingDate = new Date('2026-03-18'); // Kapan ketemu lagi
```

**Countdown Features:**
- Real-time countdown (update setiap detik)
- Hari, Jam, Menit, Detik
- Automatic stop ketika sudah tiba

---

### 7. 💌 **Today's Love Letter**
**File:** `components/sections/LoveLetter.tsx`

**Fitur:**
- Random love letter generator
- Satu random letter per hari (localStorage)
- 8+ pre-written letters
- Romantic card design dengan hearts
- Refresh button untuk testing
- Beautiful typography

**Cara menambah love letters:**
```typescript
const loveletters = [
  "Hari ini aku ingin bilang bahwa cinta aku ke kamu tidak terbatas...",
  "You know what I love about us?...",
  // Tambah lebih banyak surat di sini
];
```

**Logic:**
- Setiap hari membuat hash dari date
- Random letter dipilih berdasarkan hash
- localStorage menyimpan date & index
- Automatic reset di tengah malam

---

### 8. 🎁 **Surprise Section**
**File:** `components/sections/Surprise.tsx`

**Fitur:**
- Secret button dengan gradien "Don't click this"
- Hidden message reveal
- Video player modal
- Custom video support (YouTube/Vimeo)
- Animated transitions

**Cara customize video:**
```typescript
// Di components/sections/Surprise.tsx
// Uncomment iframe code dan ganti URL:
<iframe
  className="w-full h-full"
  src="YOUR_VIDEO_URL_HERE"
  frameBorder="0"
  allowFullScreen
/>
```

---

## 🎨 **Design & Animations**

### Color Palette
**File:** `app/globals.css`

```css
:root {
  --cream: #faf8f3;
  --warm-brown: #8b6f47;
  --soft-peach: #f5e6d3;
  --dusty-rose: #d4a5a5;
  --warm-tan: #c7a878;
  --heart-red: #e89b9b;
}
```

### Animations Included
- `fadeInUp` - Fade in dengan slide up
- `fadeInDown` - Fade in dengan slide down
- `glow` - Text glow effect
- `float` - Floating animation
- `typewriter` - Typewriter effect
- `twinkle` - Twinkling stars

---

## 🔧 **Customization Quick Reference**

### Ubah Warna
Edit `app/globals.css` - update CSS variables

### Ubah Password
Edit `components/AuthGuard.tsx` - `CORRECT_PASSWORD` variable

### Ubah Album
Edit `components/sections/Album.tsx` - `mockAlbums` array

### Ubah Timeline
Edit `components/sections/Timeline.tsx` - `mockEvents` array

### Ubah Wishlist
Edit `components/sections/Wishlist.tsx` - `mockWishlist` array

### Ubah Lokasi
Edit `components/sections/LocationsGlobe.tsx` - `myLocation` & `partnerLocation`

### Ubah Dates
Edit `components/sections/LDRTracker.tsx` - dates variables

### Ubah Love Letters
Edit `components/sections/LoveLetter.tsx` - `loveletters` array

### Ubah Video
Edit `components/sections/Surprise.tsx` - uncomment iframe & update URL

---

## 📱 **Responsive Breakpoints**

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Semua components sudah responsive dengan Tailwind CSS breakpoints.

---

## 🚀 **Deployment**

### Deploy ke Vercel
```bash
npm run build
vercel deploy
```

### Environment Variables (untuk Supabase nanti)
Buat `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 📦 **Dependencies**

- `next@14` - React framework
- `framer-motion` - Animations
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `typescript` - Type safety

---

## 🎵 **Features Coming Soon (Optional)**

Fitur yang bisa ditambahkan di masa depan:
- Voice notes recorder dengan Supabase
- Background music toggle
- Night mode auto-switch (19:00 - 04:00)
- 3D Globe dengan three.js
- Photo gallery dengan filters
- AR features
- Mobile app version

---

## 💡 **Tips & Best Practices**

1. **Backup Data:** Gunakan localStorage atau Supabase untuk backup
2. **Images:** Gunakan compressed images untuk performa lebih baik
3. **Videos:** Host di Vimeo/YouTube untuk lebih reliable
4. **Testing:** Refresh button di love letter untuk testing
5. **Personalization:** Ubah semua text & emojis sesuai personality

---

## 🔒 **Security Notes**

Untuk production:
1. Integrate dengan Supabase untuk authentication proper
2. Enable Row Level Security (RLS)
3. Add rate limiting middleware
4. Use HTTPS
5. Protect API keys

---

## 📞 **Support & Customization**

Untuk customization lebih dalam:
- Modifikasi theme colors
- Add more animations dengan Framer Motion
- Integrate dengan Supabase
- Add push notifications
- Create mobile app version

---

## 💕 **Final Notes**

Website ini adalah celebration of love transcending distance. Setiap component, animation, dan message dibuat dengan care dan passion. 

**"No Distance Can Downgrade Us"** ❤️

Enjoy the journey bersama-sama! ✨

---

*Created with 💕 for your love story*
*February 25, 2026*
