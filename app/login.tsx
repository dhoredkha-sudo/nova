import React, { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AuthShell from '@/components/AuthShell';
import { Button, Field } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) return Alert.alert('তথ্য দিন', 'ইমেইল ও পাসওয়ার্ড লিখুন।');
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setBusy(false);
      return Alert.alert('লগইন ব্যর্থ', error.message);
    }
    const { data: p } = await supabase.from('profiles').select('role, approved').eq('id', data.user.id).maybeSingle();
    if (p && !p.approved) {
      await supabase.auth.signOut();
      setBusy(false);
      return Alert.alert(
        p.role === 'teacher' ? 'অনুমোদনের অপেক্ষায়' : 'অ্যাকাউন্ট নিষ্ক্রিয়',
        p.role === 'teacher'
          ? 'আপনার শিক্ষক অ্যাকাউন্ট এখনো অ্যাডমিন অনুমোদন করেননি।'
          : 'আপনার অ্যাকাউন্ট সাময়িকভাবে বন্ধ আছে। অ্যাডমিনের সাথে যোগাযোগ করুন।'
      );
    }
    setBusy(false); // রিডাইরেক্ট করে _layout-এর Gate
  };

  return (
    <AuthShell title="Welcome back 👋" subtitle="আপনার অ্যাকাউন্টে লগইন করুন">
      <Field icon="mail-outline" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field icon="lock-closed-outline" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" icon="arrow-forward" onPress={submit} loading={busy} style={{ marginTop: 8 }} />
      <Pressable onPress={() => router.replace('/register')} style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ color: colors.sub }}>
          নতুন? <Text style={{ color: colors.primary, fontWeight: '700' }}>Register করুন</Text>
        </Text>
      </Pressable>
    </AuthShell>
  );
}
