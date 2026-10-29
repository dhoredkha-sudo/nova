import React, { useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Empty, Loading } from '@/components/ui';
import { useLoad } from '@/lib/data';
import { Profile, supabase } from '@/lib/supabase';
import { colors, shadow } from '@/lib/theme';

export default function PeopleList({
  role,
  title,
  back,
}: {
  role: 'student' | 'teacher';
  title: string;
  back?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [q, setQ] = useState('');

  const { data, loading, refreshing, refresh, reload } = useLoad(async () => {
    const { data } = await supabase.from('profiles').select('*').eq('role', role).order('created_at', { ascending: false });
    return (data ?? []) as Profile[];
  }, [] as Profile[]);

  const list = useMemo(
    () => data.filter((p) => p.full_name.toLowerCase().includes(q.trim().toLowerCase())),
    [data, q]
  );

  const setApproved = async (p: Profile, approved: boolean) => {
    const { error } = await supabase.from('profiles').update({ approved }).eq('id', p.id);
    if (error) return Alert.alert('ত্রুটি', error.message);
    reload();
  };

  const manage = (p: Profile) => {
    const buttons: any[] = [];
    if (role === 'teacher' && !p.approved) buttons.push({ text: 'Approve', onPress: () => setApproved(p, true) });
    else if (p.approved) buttons.push({ text: role === 'teacher' ? 'Suspend' : 'Suspend account', style: 'destructive', onPress: () => setApproved(p, false) });
    else buttons.push({ text: 'Activate', onPress: () => setApproved(p, true) });
    buttons.push({ text: 'বাতিল', style: 'cancel' });
    Alert.alert(p.full_name || 'User', p.approved ? 'অ্যাকাউন্ট সক্রিয় আছে' : 'অ্যাকাউন্ট নিষ্ক্রিয়/অপেক্ষমাণ', buttons);
  };

  if (loading) return <Loading />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          {back && (
            <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
              <Ionicons name="chevron-back" size={26} color={colors.text} />
            </Pressable>
          )}
          <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>{title}</Text>
          <Text style={{ marginLeft: 8, color: colors.sub, fontWeight: '700' }}>({data.length})</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 14,
            paddingHorizontal: 12,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="search" size={18} color={colors.faint} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search by name"
            placeholderTextColor={colors.faint}
            style={{ flex: 1, paddingVertical: 11, paddingHorizontal: 8, color: colors.text }}
          />
        </View>

        {list.length === 0 && <Empty text="কাউকে পাওয়া যায়নি" />}
        {list.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => manage(p)}
            style={[
              { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
              shadow,
            ]}
          >
            <Avatar uri={p.avatar_url} name={p.full_name} size={46} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: '700', color: colors.text }}>{p.full_name || 'Unnamed'}</Text>
              <Text style={{ color: colors.sub, fontSize: 12 }}>
                {role === 'student' ? `${p.class_name ?? ''} · ${p.subject ?? ''}` : 'Teacher'}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: p.approved ? colors.greenBg : colors.orangeBg,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: p.approved ? colors.green : colors.orange }}>
                {p.approved ? 'Active' : role === 'teacher' ? 'Pending' : 'Suspended'}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
