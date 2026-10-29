import React from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Empty, ListRow, Loading } from '@/components/ui';
import { useLoad } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

type Course = { id: string; title: string; description: string | null };

export default function AdminCourses() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, loading, refreshing, refresh, reload } = useLoad(async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    return (data ?? []) as Course[];
  }, [] as Course[]);

  const remove = (c: Course) =>
    Alert.alert('কোর্স মুছবেন?', `"${c.title}" ও এর সব ম্যাটেরিয়াল মুছে যাবে।`, [
      { text: 'বাতিল', style: 'cancel' },
      {
        text: 'মুছুন',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('courses').delete().eq('id', c.id);
          if (error) Alert.alert('ত্রুটি', error.message);
          reload();
        },
      },
    ]);

  if (loading) return <Loading />;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 14 }}>Courses</Text>
        {data.length === 0 && <Empty text="কোনো কোর্স নেই — + চাপ দিয়ে যোগ করুন" />}
        {data.map((c) => (
          <ListRow
            key={c.id}
            icon="book"
            color={colors.purple}
            bg={colors.purpleBg}
            title={c.title}
            sub={c.description ?? ''}
            onPress={() => router.push({ pathname: '/(admin)/upload-material', params: { courseId: c.id } })}
            right={
              <Pressable onPress={() => remove(c)} hitSlop={10}>
                <Ionicons name="trash-outline" size={20} color={colors.red} />
              </Pressable>
            }
          />
        ))}
      </ScrollView>
      <Pressable
        onPress={() => router.push('/(admin)/add-course')}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 24,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>
    </View>
  );
}
