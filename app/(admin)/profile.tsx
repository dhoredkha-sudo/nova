import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Card, ListRow } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { pickAndUploadAvatar } from '@/lib/avatar';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

export default function AdminProfile() {
  const { profile, session, refreshProfile, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [uploading, setUploading] = useState(false);

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
    >
      <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 14 }}>Profile</Text>
      <Card style={{ alignItems: 'center', paddingVertical: 20 }}>
        <Pressable onPress={changePhoto}>
          <Avatar uri={profile?.avatar_url} name={profile?.full_name || 'Admin'} size={92} />
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
        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 10, color: colors.text }}>
          {profile?.full_name || 'Admin'} <Text style={{ color: '#F5B301' }}>♛</Text>
        </Text>
        <Text style={{ color: colors.sub, fontSize: 12 }}>{session?.user.email}</Text>
      </Card>

      <View style={{ marginTop: 22 }}>
        <ListRow icon="information-circle" color={colors.purple} bg={colors.purpleBg} title="About Nova" sub="Developer & app info" onPress={() => router.push('/about')} />
        <ListRow icon="log-out" color={colors.red} bg="#FDE8E8" title="Logout" onPress={logout} />
      </View>
    </ScrollView>
  );
}
