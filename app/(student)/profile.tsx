import React, { useEffect, useState } from 'react';
import { Alert } from '@/lib/dialog';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Field, ListRow } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { pickAndUploadAvatar } from '@/lib/avatar';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

export default function Profile() {
  const { profile, session, refreshProfile, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [cls, setCls] = useState('');
  const [subject, setSubject] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setName(profile?.full_name ?? '');
    setCls(profile?.class_name ?? '');
    setSubject(profile?.subject ?? '');
  }, [profile]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name.trim(), class_name: cls.trim(), subject: subject.trim() })
      .eq('id', session!.user.id);
    setSaving(false);
    if (error) return Alert.alert('ত্রুটি', error.message);
    await refreshProfile();
    Alert.alert('সংরক্ষিত', 'প্রোফাইল আপডেট হয়েছে।');
  };

  const changePhoto = async () => {
    try {
      setUploading(true);
      const url = await pickAndUploadAvatar(session!.user.id);
      if (url) {
        await supabase.from('profiles').update({ avatar_url: url }).eq('id', session!.user.id);
        await refreshProfile();
      }
    } catch (e: any) {
      Alert.alert('আপলোড ব্যর্থ', e.message ?? 'আবার চেষ্টা করুন');
    } finally {
      setUploading(false);
    }
  };

  const logout = () =>
    Alert.alert('লগআউট', 'আপনি কি নিশ্চিত?', [
      { text: 'না', style: 'cancel' },
      { text: 'হ্যাঁ', style: 'destructive', onPress: signOut },
    ]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 14 }}>Profile</Text>
      <Card style={{ alignItems: 'center', paddingVertical: 20 }}>
        <Pressable onPress={changePhoto}>
          <Avatar uri={profile?.avatar_url} name={profile?.full_name} size={92} />
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#fff',
            }}
          >
            <Ionicons name={uploading ? 'hourglass' : 'camera'} size={15} color="#fff" />
          </View>
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 10, color: colors.text }}>{profile?.full_name}</Text>
        <Text style={{ color: colors.sub, fontSize: 12 }}>{session?.user.email}</Text>
      </Card>

      <View style={{ marginTop: 18 }}>
        <Field label="নাম" icon="person-outline" autoCapitalize="words" value={name} onChangeText={setName} />
        <Field label="ক্লাস" icon="school-outline" autoCapitalize="words" value={cls} onChangeText={setCls} />
        <Field label="বিষয়" icon="flask-outline" autoCapitalize="words" value={subject} onChangeText={setSubject} />
        <Button title="Save Changes" onPress={save} loading={saving} />
      </View>

      <View style={{ marginTop: 22 }}>
        <ListRow icon="information-circle" color={colors.purple} bg={colors.purpleBg} title="About Nova" sub="Developer & app info" onPress={() => router.push('/about')} />
        <ListRow icon="log-out" color={colors.red} bg="#FDE8E8" title="Logout" onPress={logout} />
      </View>
    </ScrollView>
  );
}
