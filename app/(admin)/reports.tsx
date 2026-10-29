import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Empty, Loading, SectionHeader, StatTile } from '@/components/ui';
import { useLoad } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

type Row = { id: string; title: string; learners: number; avg: number };

export default function Reports() {
  const insets = useSafeAreaInsets();
  const { data, loading, refreshing, refresh } = useLoad(
    async () => {
      const [c, e, s, st] = await Promise.all([
        supabase.from('courses').select('id,title'),
        supabase.from('enrollments').select('course_id,progress'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('study_log').select('minutes'),
      ]);
      const enr = e.data ?? [];
      const rows: Row[] = (c.data ?? []).map((co: any) => {
        const mine = enr.filter((x: any) => x.course_id === co.id);
        return {
          id: co.id,
          title: co.title,
          learners: mine.length,
          avg: mine.length ? Math.round(mine.reduce((a: number, b: any) => a + b.progress, 0) / mine.length) : 0,
        };
      });
      const minutes = (st.data ?? []).reduce((a: number, b: any) => a + b.minutes, 0);
      const overall = enr.length ? Math.round(enr.reduce((a: number, b: any) => a + b.progress, 0) / enr.length) : 0;
      return { rows, students: s.count ?? 0, enrollments: enr.length, hours: Math.round(minutes / 60), overall };
    },
    { rows: [] as Row[], students: 0, enrollments: 0, hours: 0, overall: 0 }
  );

  if (loading) return <Loading />;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 14 }}>Reports</Text>
      <Card style={{ flexDirection: 'row', paddingVertical: 12 }}>
        <StatTile icon="people" color={colors.primary} bg={colors.blueBg} label="Students" value={data.students} />
        <StatTile icon="layers" color={colors.green} bg={colors.greenBg} label="Enrollments" value={data.enrollments} />
        <StatTile icon="time" color={colors.purple} bg={colors.purpleBg} label="Study Hours" value={`${data.hours}h`} />
        <StatTile icon="stats-chart" color={colors.orange} bg={colors.orangeBg} label="Avg Progress" value={`${data.overall}%`} />
      </Card>

      <SectionHeader title="Course Progress" />
      {data.rows.length === 0 ? (
        <Empty text="রিপোর্ট দেখানোর মতো ডাটা নেই" />
      ) : (
        data.rows.map((r) => (
          <Card key={r.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700', color: colors.text }}>{r.title}</Text>
              <Text style={{ color: colors.sub, fontSize: 12 }}>{r.learners} learners</Text>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.border, marginTop: 10 }}>
              <View style={{ width: `${r.avg}%`, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
            </View>
            <Text style={{ fontSize: 11, color: colors.sub, marginTop: 4 }}>{r.avg}% average progress</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}
