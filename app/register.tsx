import React, { useState } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AuthShell from '@/components/AuthShell';
import { Button, Field } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teacher, setTeacher] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim()) return Alert.alert('তথ্য দিন', 'নাম ও ইমেইল দিন।');
    if (password.length < 6) return Alert.alert('পাসওয়ার্ড', 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।');
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim(), want_teacher: teacher } },
    });
    setBusy(false);
    if (error) return Alert.alert('রেজিস্ট্রেশন ব্যর্থ', error.message);

    if (teacher) {
      await supabase.auth.signOut();
      Alert.alert('ধন্যবাদ!', 'আপনার শিক্ষক অ্যাকাউন্ট অ্যাডমিন অনুমোদনের পর চালু হবে।');
      return router.replace('/login');
    }
    if (!data.session) {
      Alert.alert('ইমেইল যাচাই', 'আপনার ইমেইলে পাঠানো লিংকে ক্লিক করে অ্যাকাউন্ট নিশ্চিত করুন, তারপর লগইন করুন।');
      router.replace('/login');
    }
  };

  return (
    <AuthShell title="Create account ✨" subtitle="Nova-তে আপনার শেখার যাত্রা শুরু করুন">
      <Field icon="person-outline" placeholder="Full name" autoCapitalize="words" value={name} onChangeText={setName} />
      <Field icon="mail-outline" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field icon="lock-closed-outline" placeholder="Password (min 6)" secureTextEntry value={password} onChangeText={setPassword} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: colors.text }}>আমি একজন শিক্ষক</Text>
          <Text style={{ fontSize: 12, color: colors.sub }}>অ্যাডমিন অনুমোদনের পর চালু হবে</Text>
        </View>
        <Switch value={teacher} onValueChange={setTeacher} trackColor={{ true: colors.primary }} />
      </View>
      <Button title="Register" icon="arrow-forward" onPress={submit} loading={busy} style={{ marginTop: 8 }} />
      <Pressable onPress={() => router.replace('/login')} style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ color: colors.sub }}>
          আগে থেকেই অ্যাকাউন্ট আছে? <Text style={{ color: colors.primary, fontWeight: '700' }}>Login</Text>
        </Text>
      </Pressable>
    </AuthShell>
  );
}
