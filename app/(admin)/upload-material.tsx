import React, { useEffect, useState } from 'react';
import { Alert } from '@/lib/dialog';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Field } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

type Course = { id: string; title: string };
const KINDS = [
  { k: 'pdf', label: 'PDF', icon: 'document' },
  { k: 'video', label: 'Video', icon: 'play-circle' },
  { k: 'notes', label: 'Notes', icon: 'reader' },
] as const;

export default function UploadMaterial() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<string | null>(courseId ?? null);
  const [kind, setKind] = useState<'pdf' | 'video' | 'notes'>('pdf');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .from('courses')
      .select('id,title')
      .then(({ data }) => setCourses((data ?? []) as Course[]));
  }, []);

  useEffect(() => {
    if (courseId) setCourse(courseId);
  }, [courseId]);

  const save = async () => {
    if (!course) return Alert.alert('কোর্স বাছাই করুন');
    if (!title.trim()) return Alert.alert('শিরোনাম দিন');
    setBusy(true);
    const { error } = await supabase.from('materials').insert({ course_id: course, title: title.trim(), kind, url: url.trim() || null });
    setBusy(false);
    if (error) return Alert.alert('ত্রুটি', error.message);
    Alert.alert('সফল', 'ম্যাটেরিয়াল যোগ হয়েছে।');
    setTitle('');
    setUrl('');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>Upload Material</Text>
      </View>

      <Text style={{ fontSize: 13, color: colors.sub, fontWeight: '600', marginBottom: 8 }}>কোর্স</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {courses.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setCourse(c.id)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: course === c.id ? colors.primary : '#fff',
              borderWidth: 1,
              borderColor: course === c.id ? colors.primary : colors.border,
            }}
          >
            <Text style={{ color: course === c.id ? '#fff' : colors.text, fontWeight: '600' }}>{c.title}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ fontSize: 13, color: colors.sub, fontWeight: '600', marginBottom: 8 }}>ধরন</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        {KINDS.map((o) => (
          <Pressable
            key={o.k}
            onPress={() => setKind(o.k)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 14,
              backgroundColor: kind === o.k ? colors.blueBg : '#fff',
              borderWidth: 1.5,
              borderColor: kind === o.k ? colors.primary : colors.border,
            }}
          >
            <Ionicons name={o.icon} size={22} color={kind === o.k ? colors.primary : colors.faint} />
            <Text style={{ marginTop: 4, fontWeight: '700', color: kind === o.k ? colors.primary : colors.sub }}>{o.label}</Text>
          </Pressable>
        ))}
      </View>

      <Field label="শিরোনাম" placeholder="e.g. Chapter 5 Notes" autoCapitalize="sentences" value={title} onChangeText={setTitle} />
      <Field label="লিংক (Google Drive / YouTube / PDF URL)" placeholder="https://..." keyboardType="url" value={url} onChangeText={setUrl} />
      <Button title="Add Material" icon="cloud-upload" onPress={save} loading={busy} style={{ marginTop: 8 }} />
    </ScrollView>
  );
}
