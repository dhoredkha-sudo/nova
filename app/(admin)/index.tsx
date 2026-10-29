import React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Scene from '@/components/Scene';
import { Avatar, Card, Empty, ListRow, SectionHeader, StatTile } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { timeAgo, useLoad } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { colors, shadow } from '@/lib/theme';

type Act = { id: string; title: string; detail: string | null; created_at: string; profiles: { full_name: string } | null };

function Action({
  icon,
  color,
  bg,
  title,
  sub,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bg: string;
  title: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 10, flexDirection: 'row', alignItems: 'center', opacity: pressed ? 0.85 : 1 },
        shadow,
      ]}
    >
      <View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text }} numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ fontSize: 10, color: colors.faint }} numberOfLines={1}>
          {sub}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color={colors.faint} />
    </Pressable>
  );
}

export default function AdminHome() {
  const { profile } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const { data, refreshing, refresh } = useLoad(
    async () => {
      const head = { count: 'exact' as const, head: true };
      const [s, t, c, p, a] = await Promise.all([
        supabase.from('profiles').select('id', head).eq('role', 'student'),
        supabase.from('profiles').select('id', head).eq('role', 'teacher').eq('approved', true),
        supabase.from('courses').select('id', head),
        supabase.from('profiles').select('id', head).eq('role', 'teacher').eq('approved', false),
        supabase.from('activities').select('id,title,detail,created_at,profiles(full_name)').order('created_at', { ascending: false }).limit(4),
      ]);
      return {
        students: s.count ?? 0,
        teachers: t.count ?? 0,
        courses: c.count ?? 0,
        pending: p.count ?? 0,
        acts: (a.data ?? []) as unknown as Act[],
      };
    },
    { students: 0, teachers: 0, courses: 0, pending: 0, acts: [] as Act[] }
  );

  const go = (p: string) => () => router.push(p as any);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <View style={{ height: 230 + insets.top - 20 }}>
        <LinearGradient colors={['#3F8CF7', '#A8D1FC']} style={StyleSheet.absoluteFill} />
        <Scene width={width} height={190} variant="campus" style={{ position: 'absolute', bottom: 0 }} />
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center' }}>
          <Avatar uri={profile?.avatar_url} name={profile?.full_name || 'Admin'} size={54} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>
              {profile?.full_name || 'Admin'} <Text style={{ color: '#F5B301' }}>♛</Text>
            </Text>
            <Text style={{ fontSize: 12, color: colors.text }}>Nova Education Center</Text>
          </View>
          <Pressable
            onPress={go('/(admin)/profile')}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </Pressable>
        </View>
        <Text
          style={{
            position: 'absolute',
            right: 28,
            top: insets.top + 96,
            fontSize: 20,
            fontStyle: 'italic',
            fontWeight: '600',
            color: '#1D4FA8',
            transform: [{ rotate: '-8deg' }],
          }}
        >
          Manage{'\n'}Educate{'\n'}Grow
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: -26 }}>
        <Card style={{ flexDirection: 'row', paddingVertical: 12 }}>
          <StatTile icon="people" color={colors.primary} bg={colors.blueBg} label="Total Students" value={data.students.toLocaleString()} />
          <StatTile icon="person" color={colors.green} bg={colors.greenBg} label="Total Teachers" value={data.teachers} />
          <StatTile icon="book" color={colors.purple} bg={colors.purpleBg} label="Total Courses" value={data.courses} />
          <StatTile icon="hourglass" color={colors.orange} bg={colors.orangeBg} label="Pending Approvals" value={data.pending} />
        </Card>

        <SectionHeader title="Quick Actions" />
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Action icon="people" color={colors.primary} bg={colors.blueBg} title="Manage Students" sub="Add / View / Edit" onPress={go('/(admin)/students')} />
            <Action icon="person" color={colors.green} bg={colors.greenBg} title="Manage Teachers" sub="Add / View / Edit" onPress={go('/(admin)/teachers')} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Action icon="add-circle" color={colors.purple} bg={colors.purpleBg} title="Add Course" sub="Create New Course" onPress={go('/(admin)/add-course')} />
            <Action icon="cloud-upload" color={colors.orange} bg={colors.orangeBg} title="Upload Material" sub="PDF / Video / Notes" onPress={go('/(admin)/upload-material')} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Action icon="stats-chart" color={colors.primary} bg={colors.blueBg} title="View Reports" sub="Analytics & Progress" onPress={go('/(admin)/reports')} />
            <Action icon="settings" color={colors.purple} bg={colors.purpleBg} title="System Settings" sub="App Configuration" onPress={go('/(admin)/profile')} />
          </View>
        </View>

        <SectionHeader title="Recent Activities" />
        {data.acts.length === 0 ? (
          <Card>
            <Empty text="এখনো কোনো অ্যাক্টিভিটি নেই" />
          </Card>
        ) : (
          data.acts.map((a) => (
            <ListRow
              key={a.id}
              icon="notifications"
              color={colors.green}
              bg={colors.greenBg}
              title={a.title}
              sub={`${a.profiles?.full_name ?? a.detail ?? ''} · ${timeAgo(a.created_at)}`}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
