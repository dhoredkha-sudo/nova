import React, { useState } from 'react';
import { Alert } from '@/lib/dialog';
import { Linking, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Empty, IconBubble, Loading } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useLoad } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

type Course = { id: string; title: string; description: string | null };
type Material = { id: string; course_id: string; title: string; kind: string; url: string | null };

export default function Courses() {
  const { session } = useAuth();
  const router = useRouter();
  const uid = session!.user.id;
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, loading, refreshing, refresh, reload } = useLoad(
    async () => {
      const [c, e, m] = await Promise.all([
        supabase.from('courses').select('*').order('created_at'),
        supabase.from('enrollments').select('course_id, progress').eq('user_id', uid),
        supabase.from('materials').select('*').order('created_at'),
      ]);
      const prog: Record<string, number> = {};
      (e.data ?? []).forEach((r: any) => (prog[r.course_id] = r.progress));
      return { courses: (c.data ?? []) as Course[], prog, materials: (m.data ?? []) as Material[] };
    },
    { courses: [] as Course[], prog: {} as Record<string, number>, materials: [] as Material[] }
  );

  const enroll = async (c: Course) => {
    setBusyId(c.id);
    const { error } = await supabase.from('enrollments').insert({ user_id: uid, course_id: c.id, progress: 0 });
    if (error) Alert.alert('ত্রুটি', error.message);
    else await supabase.from('activities').insert({ user_id: uid, title: 'Course enrolled', detail: c.title });
    setBusyId(null);
    reload();
  };

  const cont = async (c: Course) => {
    setBusyId(c.id);
    const next = Math.min(100, (data.prog[c.id] ?? 0) + 10);
    await supabase.from('enrollments').update({ progress: next }).eq('user_id', uid).eq('course_id', c.id);
    await supabase.from('study_log').insert({ user_id: uid, minutes: 30 });
    await supabase.from('activities').insert({ user_id: uid, title: `${c.title} - Lesson`, detail: `Completed · ${next}%` });
    setBusyId(null);
    reload();
  };

  if (loading) return <Loading />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 14 }}>My Courses</Text>
      {data.courses.length === 0 && <Empty text="এখনো কোনো কোর্স নেই" />}
      {data.courses.map((c) => {
        const enrolled = c.id in data.prog;
        const p = data.prog[c.id] ?? 0;
        const mats = data.materials.filter((m) => m.course_id === c.id);
        const expanded = open === c.id;
        return (
          <Card key={c.id} style={{ marginBottom: 12 }}>
            <Pressable onPress={() => setOpen(expanded ? null : c.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconBubble name="book" color={colors.primary} bg={colors.blueBg} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: '800', fontSize: 15, color: colors.text }}>{c.title}</Text>
                <Text style={{ color: colors.sub, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                  {c.description}
                </Text>
              </View>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.faint} />
            </Pressable>

            {enrolled && (
              <View style={{ marginTop: 12 }}>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.border }}>
                  <View style={{ width: `${p}%`, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
                </View>
                <Text style={{ fontSize: 11, color: colors.sub, marginTop: 4 }}>{p}% complete</Text>
              </View>
            )}

            {expanded && (
              <View style={{ marginTop: 10 }}>
                {mats.length === 0 ? (
                  <Text style={{ color: colors.faint, fontSize: 12 }}>এই কোর্সে এখনো কোনো ম্যাটেরিয়াল নেই।</Text>
                ) : (
                  mats.map((m) => (
                    <Pressable
                      key={m.id}
                      onPress={() => {
                        if (!m.url) return Alert.alert(m.title, 'লিংক নেই');
                        if (m.kind === 'video') router.push({ pathname: '/player', params: { url: m.url, title: m.title } });
                        else Linking.openURL(m.url);
                      }}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                    >
                      <Ionicons
                        name={m.kind === 'video' ? 'play-circle' : m.kind === 'pdf' ? 'document' : 'reader'}
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={{ marginLeft: 10, color: colors.text, flex: 1 }}>{m.title}</Text>
                      <Ionicons name="open-outline" size={16} color={colors.faint} />
                    </Pressable>
                  ))
                )}
              </View>
            )}

            <View style={{ marginTop: 12 }}>
              {enrolled ? (
                <Button
                  title={p >= 100 ? 'Completed 🎉' : 'Continue Learning'}
                  onPress={() => cont(c)}
                  disabled={p >= 100}
                  loading={busyId === c.id}
                  style={{ height: 44 }}
                />
              ) : (
                <Button title="Enroll" variant="outline" onPress={() => enroll(c)} loading={busyId === c.id} style={{ height: 44 }} />
              )}
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}
