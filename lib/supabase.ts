import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  );
}

// Validate URL format to prevent runtime crashes
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(
    `Invalid NEXT_PUBLIC_SUPABASE_URL: "${supabaseUrl}". Must start with http:// or https://`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Functions

// Albums Management
export async function getAlbums() {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createAlbum(album: any) {
  const { data, error } = await supabase
    .from('albums')
    .insert([album])
    .select();

  if (error) throw error;
  return data;
}

export async function updateAlbum(id: string, updates: any) {
  const { data, error } = await supabase
    .from('albums')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteAlbum(id: string) {
  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Voice Notes Management
export async function getVoiceNotes() {
  const { data, error } = await supabase
    .from('voice_notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function uploadVoiceNote(
  filename: string,
  fileData: Blob
) {
  const { data, error } = await supabase.storage
    .from('voice-notes')
    .upload(`${new Date().getTime()}-${filename}`, fileData);

  if (error) throw error;
  return data;
}

export async function createVoiceNoteRecord(record: any) {
  const { data, error } = await supabase
    .from('voice_notes')
    .insert([record])
    .select();

  if (error) throw error;
  return data;
}

// Messages Scheduler Management
export async function getScheduledMessages() {
  const { data, error } = await supabase
    .from('scheduled_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createScheduledMessage(message: any) {
  const { data, error } = await supabase
    .from('scheduled_messages')
    .insert([message])
    .select();

  if (error) throw error;
  return data;
}

export async function updateScheduledMessage(id: string, updates: any) {
  const { data, error } = await supabase
    .from('scheduled_messages')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteScheduledMessage(id: string) {
  const { error } = await supabase
    .from('scheduled_messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Upload Image to Storage
export async function uploadImage(bucket: string, filename: string, fileData: Blob) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${new Date().getTime()}-${filename}`, fileData);

  if (error) throw error;
  return data;
}

// Get Public URL for uploaded file
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data?.publicUrl;
}
