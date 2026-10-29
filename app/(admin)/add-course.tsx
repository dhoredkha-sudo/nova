import React, { useState } from 'react';
import { Alert } from '@/lib/dialog';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Field } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

export default function AddCourse() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!title.trim()) return Alert.alert('কোর্সের নাম দিন');
    setBusy(true);
    const { error } = await supabase
      .from('courses')
      .insert({ title: title.trim(), description: desc.trim(), created_by: session!.user.id });
    setBusy(false);
    if (error) return Alert.alert('ত্রুটি', error.message);
    Alert.alert('সফল', 'নতুন কোর্স তৈরি হয়েছে।');
    setTitle('');
    setDesc('');
    router.replace('/(admin)/courses');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>Add Course</Text>
      </View>
      <Field label="কোর্সের নাম" placeholder="e.g. Physics" autoCapitalize="words" value={title} onChangeText={setTitle} />
      <Field label="বিবরণ" placeholder="সংক্ষিপ্ত বিবরণ" autoCapitalize="sentences" value={desc} onChangeText={setDesc} />
      <Button title="Create Course" icon="add" onPress={save} loading={busy} style={{ marginTop: 8 }} />
    </ScrollView>
  );
}
