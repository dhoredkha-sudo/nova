import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';

/** গ্যালারি থেকে ছবি বেছে Supabase Storage-এ আপলোড করে public URL ফেরত দেয় */
export async function pickAndUploadAvatar(uid: string): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.6,
  });
  if (res.canceled) return null;

  const asset = res.assets[0];
  const blob = await (await fetch(asset.uri)).arrayBuffer();
  const path = `${uid}/avatar-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from('avatars').upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) throw error;
  return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
}
