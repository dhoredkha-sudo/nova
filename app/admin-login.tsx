import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthShell from '@/components/AuthShell';
import { Button, Field } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

export default function AdminLogin() {
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
    // রোল সার্ভারের ডাটাবেস থেকে যাচাই হয় — ক্লায়েন্টে বদলানো যায় না
    const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
    if (!p || p.role !== 'admin') {
      await supabase.auth.signOut();
      setBusy(false);
      return Alert.alert('অনুমতি নেই', 'এই অ্যাকাউন্টটি অ্যাডমিন নয়।');
    }
    setBusy(false);
  };

  return (
    <AuthShell title="Admin Login" subtitle="শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য">
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.blueBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
        </View>
        <Text style={{ color: colors.sub, marginTop: 8, fontSize: 12 }}>Nova Education Center</Text>
      </View>
      <Field icon="mail-outline" placeholder="Admin email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field icon="lock-closed-outline" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login as Admin" icon="arrow-forward" onPress={submit} loading={busy} style={{ marginTop: 8 }} />
    </AuthShell>
  );
}
