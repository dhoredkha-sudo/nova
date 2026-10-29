import React from 'react';
import { RefreshControl, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Empty, ListRow, Loading } from '@/components/ui';
import { useLoad } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

type TestRow = { id: string; title: string };

export default function Practice() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, loading, refreshing, refresh } = useLoad(async () => {
    const { data: t } = await supabase.from('tests').select('id, title');
    const { data: q } = await supabase.from('questions').select('test_id');
    const counts: Record<string, number> = {};
    (q ?? []).forEach((r: any) => (counts[r.test_id] = (counts[r.test_id] ?? 0) + 1));
    return { tests: (t ?? []) as TestRow[], counts };
  }, { tests: [] as TestRow[], counts: {} as Record<string, number> });

  if (loading) return <Loading />;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 14 }}>Practice Test</Text>
      {data.tests.length === 0 && <Empty text="এখনো কোনো টেস্ট নেই" />}
      {data.tests.map((t) => (
        <ListRow
          key={t.id}
          icon="create"
          color={colors.teal}
          bg={colors.tealBg}
          title={t.title}
          sub={`${data.counts[t.id] ?? 0} questions`}
          onPress={() => router.push({ pathname: '/test/[id]', params: { id: t.id } })}
        />
      ))}
    </ScrollView>
  );
}
