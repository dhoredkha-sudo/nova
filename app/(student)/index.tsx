import React from 'react';
import { Alert, Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Scene from '@/components/Scene';
import { Avatar, Card, Empty, ListRow, QuickTile, SectionHeader, StatTile } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fmtTime, timeAgo, useLoad } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { colors, shadow } from '@/lib/theme';

type ClassRow = { id: string; title: string; starts_at: string; ends_at: string; meeting_url: string | null };
type Activity = { id: string; title: string; detail: string | null; created_at: string };

export default function StudentHome() {
  const { profile, session } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const uid = session?.user.id;

  const { data, refreshing, refresh } = useLoad(
    async () => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start.getTime() + 86400000);
      const [enr, asg, study, cls, act] = await Promise.all([
        supabase.from('enrollments').select('progress').eq('user_id', uid!),
        supabase.from('assignments').select('id', { count: 'exact', head: true }).eq('done', false),
        supabase.from('study_log').select('minutes').eq('user_id', uid!),
        supabase
          .from('classes')
          .select('*')
          .gte('starts_at', start.toISOString())
          .lt('starts_at', end.toISOString())
          .order('starts_at'),
        supabase.from('activities').select('*').eq('user_id', uid!).order('created_at', { ascending: false }).limit(3),
      ]);
      const enrolls = enr.data ?? [];
      const minutes = (study.data ?? []).reduce((a, b: any) => a + b.minutes, 0);
      const progress = enrolls.length ? Math.round(enrolls.reduce((a, b: any) => a + b.progress, 0) / enrolls.length) : 0;
      return {
        courses: enrolls.length,
        assignments: asg.count ?? 0,
        hours: Math.round(minutes / 60),
        progress,
        classes: (cls.data ?? []) as ClassRow[],
        activities: (act.data ?? []) as Activity[],
      };
    },
    { courses: 0, assignments: 0, hours: 0, progress: 0, classes: [] as ClassRow[], activities: [] as Activity[] }
  );

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good Morning,' : hour < 17 ? 'Good Afternoon,' : 'Good Evening,';
  const now = Date.now();
  const isLive = (c: ClassRow) => now >= new Date(c.starts_at).getTime() && now <= new Date(c.ends_at).getTime();

  const joinLive = () => {
    const live = data.classes.find(isLive) ?? data.classes[0];
    if (!live) return Alert.alert('Live Class', 'আজ কোনো ক্লাস নির্ধারিত নেই।');
    if (live.meeting_url) Linking.openURL(live.meeting_url);
    else Alert.alert(live.title, 'এই ক্লাসের মিটিং লিংক এখনো যোগ করা হয়নি।');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <View style={{ height: 250 + insets.top - 20 }}>
        <LinearGradient colors={['#3F8CF7', '#A8D1FC']} style={StyleSheet.absoluteFill} />
        <Scene width={width} height={200} style={{ position: 'absolute', bottom: 0 }} />
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center' }}>
          <Avatar uri={profile?.avatar_url} name={profile?.full_name} size={54} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 12, color: colors.text }}>{greet}</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }} numberOfLines={1}>
              {profile?.full_name || 'Student'}
            </Text>
            <Text style={{ fontSize: 12, color: colors.text }}>
              {profile?.class_name} · {profile?.subject}
            </Text>
          </View>
          <Pressable
            style={styles.round}
            onPress={() =>
              Alert.alert('Notifications', data.activities[0] ? `${data.activities[0].title}` : 'কোনো নতুন নোটিফিকেশন নেই')
            }
          >
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            {data.activities.length > 0 && <View style={styles.dot} />}
          </Pressable>
          <Pressable style={[styles.round, { marginLeft: 8 }]} onPress={() => router.push('/(student)/profile')}>
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </Pressable>
        </View>
        <Text
          style={{
            position: 'absolute',
            left: 40,
            top: insets.top + 100,
            fontSize: 22,
            fontStyle: 'italic',
            fontWeight: '600',
            color: '#1D4FA8',
            transform: [{ rotate: '-8deg' }],
          }}
        >
          Small Steps{'\n'}Big Dreams
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: -26 }}>
        <Card style={{ flexDirection: 'row', paddingVertical: 12 }}>
          <StatTile icon="layers" color={colors.primary} bg={colors.blueBg} label="Courses" value={data.courses} />
          <StatTile icon="document-text" color={colors.green} bg={colors.greenBg} label="Assignments" value={data.assignments} />
          <StatTile icon="time" color={colors.purple} bg={colors.purpleBg} label="Study Hours" value={`${data.hours}h`} />
          <StatTile icon="stats-chart" color={colors.orange} bg={colors.orangeBg} label="Progress" value={`${data.progress}%`} />
        </Card>

        <SectionHeader title="Quick Access" action="See All" onAction={() => router.push('/(student)/courses')} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <QuickTile icon="reader" color={colors.primary} bg={colors.blueBg} title="My Courses" sub="Continue Learning" onPress={() => router.push('/(student)/courses')} />
          <QuickTile icon="create" color={colors.teal} bg={colors.tealBg} title="Practice Test" sub="Improve Skills" onPress={() => router.push('/(student)/practice')} />
          <QuickTile icon="document-text" color={colors.orange} bg={colors.orangeBg} title="Notes" sub="Your Notes" onPress={() => router.push('/(student)/notes')} />
          <QuickTile icon="videocam" color={colors.purple} bg={colors.purpleBg} title="Live Class" sub="Join Now" onPress={joinLive} />
        </View>

        <SectionHeader title="Today's Classes" action="See All" onAction={joinLive} />
        {data.classes.length === 0 ? (
          <Card>
            <Empty text="আজ কোনো ক্লাস নেই" />
          </Card>
        ) : (
          data.classes.map((c) => (
            <ListRow
              key={c.id}
              icon="school"
              color={colors.orange}
              bg={colors.orangeBg}
              title={c.title}
              sub={`${fmtTime(c.starts_at)} – ${fmtTime(c.ends_at)}`}
              onPress={() => (c.meeting_url ? Linking.openURL(c.meeting_url) : Alert.alert(c.title, 'মিটিং লিংক নেই'))}
              right={
                isLive(c) ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={styles.live}>
                      <Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>● Live Now</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.faint} />
                  </View>
                ) : undefined
              }
            />
          ))
        )}

        <LinearGradient
          colors={['#5B7CF6', '#8E6CF0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ borderRadius: 18, padding: 18, marginTop: 6 }, shadow]}
        >
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>You Can Do It!</Text>
          <Text style={{ color: '#E6E8FF', marginTop: 4, lineHeight: 18 }}>
            Keep learning, keep growing.{'\n'}Your future is waiting!
          </Text>
        </LinearGradient>

        <SectionHeader title="Recent Activity" action="See All" />
        {data.activities.length === 0 ? (
          <Card>
            <Empty text="এখনো কোনো অ্যাক্টিভিটি নেই — একটি কোর্স শুরু করুন!" />
          </Card>
        ) : (
          data.activities.map((a) => (
            <ListRow
              key={a.id}
              icon="checkmark-circle"
              color={colors.teal}
              bg={colors.tealBg}
              title={a.title}
              sub={`${a.detail ?? ''} · ${timeAgo(a.created_at)}`}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  round: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red },
  live: { backgroundColor: colors.greenBg, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
});
