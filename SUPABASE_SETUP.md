# Supabase Setup Guide untuk trystandhinda

## 📋 1. Buat Project Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"**
3. Sign up / Login (bisa pakai GitHub)
4. Klik **"New Project"**
5. Isi form:
   - **Name**: `trystandhinda` (atau bebas)
   - **Database Password**: (Simpan password ini, nanti butuh untuk connection string jika perlu)
   - **Region**: Pilih yang dekat (misal: Singapore)
   - **Pricing Plan**: Free
6. Klik **"Create new project"** dan tunggu ~2 menit sampai statusnya hijau (Active).

## 🔑 2. Ambil API Keys & URL

Setelah project aktif:

1. Di dashboard project, cari menu **Project Settings** (icon gear ⚙️ di paling bawah sidebar kiri).
2. Pilih **API**
3. Di bagian **Project URL**, copy URL-nya.
4. Di bagian **Project API keys**, cari `anon` `public`. Copy key-nya.

## 📝 3. Setup Environment Variables

Di folder project laptopmu (`D:\Developer\Trystandhinda`), buat file bernama `.env.local` (jika belum ada).

Isi file `.env.local` dengan data tadi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**PENTING:** Jangan commit file ini ke GitHub! Sudah ada di .gitignore.

---

## 🗄️ Setup Database Tables

Di Supabase dashboard, buka **SQL Editor** dan jalankan query berikut:

### 1. Albums Table
```sql
create table albums (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  month text not null,
  year integer not null,
  cover text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

### 2. Photos (untuk Album)
```sql
create table photos (
  id uuid default uuid_generate_v4() primary key,
  album_id uuid references albums(id) on delete cascade,
  image text not null,
  story text,
  date text,
  emotion text,
  created_at timestamp default now()
);
```

### 3. Voice Notes Table
```sql
create table voice_notes (
  id uuid default uuid_generate_v4() primary key,
  title text,
  audio_url text not null,
  duration integer,
  created_at timestamp default now()
);
```

### 4. Scheduled Messages Table
```sql
create table scheduled_messages (
  id uuid default uuid_generate_v4() primary key,
  time text not null,
  message text not null,
  is_active boolean default true,
  created_at timestamp default now()
);
```

### 5. Timeline Events Table
```sql
create table timeline_events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date date not null,
  icon text,
  color text,
  created_at timestamp default now()
);
```

### 6. Wishlists Table
```sql
create table wishlists (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  priority text,
  category text,
  image_url text,
  created_at timestamp default now()
);
```

---

## 🪣 Setup Storage Buckets

Di Supabase dashboard:

1. Buka **Storage** (di sidebar kiri)
2. Klik **Create a new bucket**
3. Buat bucket dengan nama berikut (public access):
   - `albums`
   - `voice-notes`
   - `gallery`
   - `ldr-tracker` (Opsional: untuk foto check-in lokasi)
   - `wishlist` (Opsional: untuk gambar wishlist)
   - `videos` (Opsional: untuk video surprise)

---

## 📊 Cara Mengedit Database

### Option 1: Melalui Supabase Dashboard (Recommended untuk Awal)

1. Buka https://app.supabase.com
2. Login ke project Anda
3. Di sidebar, pilih **Table Editor**
4. Pilih tabel yang ingin diedit
5. Klik tombol **Insert row** untuk tambah data baru
6. Klik row yang ada untuk edit
7. Klik X pada row untuk delete

**Contoh - Menambah Album Baru:**
1. Pilih tabel `albums`
2. Klik **Insert row**
3. Isi: title, month, year, cover (URL gambar)
4. Klik **Save**

### Option 2: Melalui SQL Editor

Untuk bulk operations atau query kompleks:

1. Buka **SQL Editor** di Supabase
2. Tulis query SQL:

```sql
-- Insert album baru
INSERT INTO albums (title, month, year, cover)
VALUES ('Liburan Bali', 'Desember', 2025, 'https://example.com/bali.jpg');

-- Select semua albums
SELECT * FROM albums ORDER BY created_at DESC;

-- Update album
UPDATE albums SET title = 'Liburan Bali Kece' 
WHERE id = 'uuid-disini';

-- Delete album
DELETE FROM albums WHERE id = 'uuid-disini';
```

### Option 3: Melalui Aplikasi (Dari Code)

Di aplikasi React, import from `lib/supabase.ts`:

```typescript
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from '@/lib/supabase';

// Ambil semua albums
const albums = await getAlbums();

// Buat album baru
await createAlbum({
  title: 'Liburan Bali',
  month: 'Desember',
  year: 2025,
  cover: 'https://example.com/bali.jpg'
});

// Update album
await updateAlbum(albumId, {
  title: 'Liburan Bali Kece Banget'
});

// Hapus album
await deleteAlbum(albumId);
```

---

## 🔐 Bagaimanakah Security Bekerja?

Supabase menggunakan **Row Level Security (RLS)** untuk protect data. Untuk website personal ini, Anda bisa:

1. **Enable Anonymous Access** (untuk read-only public data)
2. **Add Authentication** (Google, Email, dll) untuk edit permissions
3. **Custom Policies** - Hanya owner bisa edit data mereka

Untuk sekarang, Anda bisa set policy permissive untuk development:

```sql
-- Izinkan semua (untuk development saja!)
alter table albums enable row level security;

create policy "Enable public access"
  on albums
  for select
  using (true);

create policy "Enable inserts"
  on albums
  for insert
  with check (true);

create policy "Enable updates"
  on albums
  for update
  using (true);

create policy "Enable deletes"
  on albums
  for delete
  using (true);
```

---

## 🚀 Cara Menggunakan di Aplikasi

### 1. Import functions
```typescript
'use client';

import { getAlbums, uploadImage, getPublicUrl } from '@/lib/supabase';
```

### 2. Load data di component
```typescript
useEffect(() => {
  async function loadData() {
    try {
      const albums = await getAlbums();
      setAlbums(albums);
    } catch (error) {
      console.error('Error loading albums:', error);
    }
  }
  
  loadData();
}, []);
```

### 3. Upload files
```typescript
const handleUpload = async (file: File) => {
  try {
    // Upload ke storage
    const { data } = await uploadImage('albums', file.name, file);
    
    // Get public URL
    const publicUrl = getPublicUrl('albums', data.path);
    
    // Save di database dengan URL
    await createAlbum({
      title: 'New Album',
      cover: publicUrl
    });
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## 💡 Tips & Tricks

1. **Backup Data**: Selalu backup database sebelum ada changes besar
2. **Test Mode**: Gunakan `.env.local` untuk development, `.env.production.local` untuk production
3. **Monitor Usage**: Supabase free tier punya limits (lihat di Settings → Usage)
4. **Enable VCS**: Gunakan Supabase → Version Control untuk track changes

---

## ❓ Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL is undefined"
- ✅ Cek file `.env.local` exists dan ada env variables
- ✅ Restart dev server: `npm run dev`
- ✅ Pastikan format benar (tanpa quotes)

### Error: "Failed to fetch data"
- ✅ Cek internet connection
- ✅ Pastikan Supabase project aktif
- ✅ Cek di Supabase Dashboard → Project Status
- ✅ Verify RLS policies allow access

### Upload tidak berhasil
- ✅ Cek bucket name benar
- ✅ Verify bucket permissions (public)
- ✅ File size < 50MB (free tier limit)

---

## 📚 Resources

- Supabase Docs: https://supabase.com/docs
- JavaScript Client: https://supabase.com/docs/reference/javascript
- SQL Cheatsheet: https://supabase.com/docs/guides/database/tables

---

**Happy coding! 💙**
Sekarang Anda bisa menyimpan semua memori LDR kalian di Supabase! 🚀
