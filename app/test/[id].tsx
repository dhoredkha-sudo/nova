import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Empty, Loading } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { colors, shadow } from '@/lib/theme';

type Q = { id: string; question: string; options: string[]; answer_index: number };

export default function TestRunner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [qs, setQs] = useState<Q[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: t } = await supabase.from('tests').select('title').eq('id', id).maybeSingle();
      const { data: q } = await supabase.from('questions').select('*').eq('test_id', id);
      setTitle(t?.title ?? 'Practice Test');
      setQs((q ?? []) as Q[]);
    })();
  }, [id]);

  if (!qs) return <Loading />;

  const finish = async (finalScore: number) => {
    setDone(true);
    await supabase.from('activities').insert({
      user_id: session!.user.id,
      title: `${title} completed`,
      detail: `Score ${finalScore}/${qs.length}`,
    });
    await supabase.from('study_log').insert({ user_id: session!.user.id, minutes: 15 });
  };

  const next = () => {
    const correct = picked === qs[i].answer_index;
    const newScore = score + (correct ? 1 : 0);
    setScore(newScore);
    if (i + 1 < qs.length) {
      setI(i + 1);
      setPicked(null);
    } else finish(newScore);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: '800', fontSize: 16, color: colors.text }}>{title}</Text>
        <View style={{ width: 26 }} />
      </View>

      {qs.length === 0 ? (
        <Empty text="এই টেস্টে এখনো প্রশ্ন নেই" />
      ) : done ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 56 }}>{score / qs.length >= 0.6 ? '🎉' : '💪'}</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 8 }}>
            {score}/{qs.length}
          </Text>
          <Text style={{ color: colors.sub, marginTop: 6, textAlign: 'center' }}>
            {score / qs.length >= 0.6 ? 'চমৎকার! এভাবেই চালিয়ে যান।' : 'আরেকটু অনুশীলন করলেই আরও ভালো হবে!'}
          </Text>
          <Button title="Done" onPress={() => router.back()} style={{ marginTop: 24, alignSelf: 'stretch' }} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ color: colors.sub, fontWeight: '600' }}>
            Question {i + 1} of {qs.length}
          </Text>
          <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, marginVertical: 10 }}>
            <View style={{ height: 6, width: `${((i + 1) / qs.length) * 100}%`, backgroundColor: colors.primary, borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 19, fontWeight: '800', color: colors.text, marginVertical: 12, lineHeight: 26 }}>
            {qs[i].question}
          </Text>
          {qs[i].options.map((o, idx) => {
            const sel = picked === idx;
            return (
              <Pressable
                key={idx}
                onPress={() => setPicked(idx)}
                style={[
                  {
                    backgroundColor: '#fff',
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: sel ? colors.primary : 'transparent',
                  },
                  shadow,
                ]}
              >
                <Text style={{ color: sel ? colors.primary : colors.text, fontWeight: sel ? '700' : '500', fontSize: 15 }}>{o}</Text>
              </Pressable>
            );
          })}
          <Button
            title={i + 1 < qs.length ? 'Next' : 'Finish'}
            onPress={next}
            disabled={picked === null}
            style={{ marginTop: 10 }}
          />
        </ScrollView>
      )}
    </View>
  );
}
