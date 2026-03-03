# 🗃️ Database Management - Quick Reference

Website sudah integrated dengan Supabase. Berikut cara cepat mengedit database:

---

## 🔑 Setup (First Time Only)

### 1. Register Supabase
```
➜ Buka https://supabase.com
➜ Sign up dengan email
➜ Create project (pilih free tier)
➜ Tunggu project aktif (~5 menit)
```

### 2. Ambil API Keys
```
Dashboard → Settings ⚙️ → API
├─ Copy "Project URL" 
└─ Copy "anon public" key
```

### 3. Setup .env.local
```bash
# Buat file di root folder: .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

### 4. Restart Server
```bash
npm run dev
```

---

## 📝 Database Operations

### ▶️ VIEW DATA
**Via Dashboard:**
```
Supabase → Table Editor → Pilih tabel
```

**Via React Code:**
```typescript
'use client';
import { getAlbums } from '@/lib/supabase';

useEffect(() => {
  const data = await getAlbums();
  console.log(data);
}, []);
```

---

### ✏️ ADD DATA
**Via Dashboard:**
```
Table Editor → [Table Name] → Insert row → Fill fields → Save
```

**Via SQL:**
```sql
INSERT INTO albums (title, month, year, cover)
VALUES ('Liburan Bali', 'Desember', 2025, 'https://image.jpg');
```

**Via React Code:**
```typescript
import { createAlbum } from '@/lib/supabase';

await createAlbum({
  title: 'Liburan Bali',
  month: 'Desember',
  year: 2025,
  cover: 'https://image.jpg'
});
```

---

### 🔄 EDIT DATA
**Via Dashboard:**
```
Table Editor → Click row → Edit field → Save
```

**Via SQL:**
```sql
UPDATE albums 
SET title = 'Liburan Bali Seru' 
WHERE id = 'uuid-here';
```

**Via React Code:**
```typescript
import { updateAlbum } from '@/lib/supabase';

await updateAlbum('album-id', {
  title: 'Liburan Bali Seru'
});
```

---

### 🗑️ DELETE DATA
**Via Dashboard:**
```
Table Editor → Swipe/hover row → Delete icon → Confirm
```

**Via SQL:**
```sql
DELETE FROM albums WHERE id = 'uuid-here';
```

**Via React Code:**
```typescript
import { deleteAlbum } from '@/lib/supabase';

await deleteAlbum('album-id');
```

---

## 📊 Database Tables

```
┌─────────────────────────────────┐
│  ALBUMS                         │
├─────────────────────────────────┤
│ id (uuid)                       │
│ title (text)                    │
│ month (text)                    │
│ year (integer)                  │
│ cover (text - image URL)        │
│ created_at (timestamp)          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  PHOTOS                         │
├─────────────────────────────────┤
│ id (uuid)                       │
│ album_id (foreign key)          │
│ image (text - URL)              │
│ story (text)                    │
│ date (text)                     │
│ emotion (text)                  │
│ created_at (timestamp)          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  VOICE_NOTES                    │
├─────────────────────────────────┤
│ id (uuid)                       │
│ title (text)                    │
│ audio_url (text - URL)          │
│ duration (integer)              │
│ created_at (timestamp)          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  SCHEDULED_MESSAGES             │
├─────────────────────────────────┤
│ id (uuid)                       │
│ time (text - HH:MM)             │
│ message (text)                  │
│ is_active (boolean)             │
│ created_at (timestamp)          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  SURPRISES                      │
├─────────────────────────────────┤
│ id (uuid)                       │
│ title (text)                    │
│ video_url (text)                │
│ message (text)                  │
│ is_active (boolean)             │
│ created_at (timestamp)          │
└─────────────────────────────────┘
```

---

## 🔐 File Upload (Storage)

### Upload Image
```typescript
import { uploadImage, getPublicUrl } from '@/lib/supabase';

// Upload file
const { data } = await uploadImage('albums', 'photo.jpg', fileBlob);

// Get public URL
const url = getPublicUrl('albums', data.path);

// Save URL di database
await createAlbum({
  title: 'My Album',
  cover: url
});
```

### Buckets Available
- `albums` - Album cover photos
- `voice-notes` - Audio files
- `gallery` - Gallery images
- `ldr-tracker` - Location check-in photos
- `wishlist` - Wishlist item images
- `videos` - Surprise video files

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| `SUPABASE_URL undefined` | Check `.env.local` exists & restart server |
| `Authentication error` | Verify API key correct in `.env.local` |
| `Connection timeout` | Check Supabase project is active |
| `File upload failed` | Verify bucket name & file size < 50MB |
| `RLS policy error` | Enable public access in Supabase policies |

---

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **JavaScript SDK**: https://supabase.com/docs/reference/javascript/introduction
- **SQL Cheatsheet**: https://supabase.com/docs/guides/database/sql-query-builder

---

**That's it! You can now manage your LDR website data like a pro! 🎉**
