import React from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Scene from '@/components/Scene';
import { Button } from '@/components/ui';
import { colors } from '@/lib/theme';

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ flex: 1, backgroundColor: '#EAF3FF' }}>
      <LinearGradient colors={['#4A92F8', '#A8D1FC', '#EAF3FF']} style={StyleSheet.absoluteFill} />
      <Scene mode="full" width={width} height={height * 0.66} style={{ position: 'absolute', bottom: height * 0.26 }} />

      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source={require('@/assets/icon.png')} style={{ width: 44, height: 44, borderRadius: 22 }} />
          <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text }}>Nova</Text>
        </View>
        <Text style={{ fontSize: 34, fontWeight: '800', color: colors.text, marginTop: 28, lineHeight: 42 }}>
          Learn Today{'\n'}Build Tomorrow
        </Text>
        <Text style={{ fontSize: 14, color: '#344054', marginTop: 10, lineHeight: 20, maxWidth: 300 }}>
          Nova is your all-in-one learning companion. Study, practice, track progress and achieve your dreams.
        </Text>
      </View>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: 24,
          paddingBottom: insets.bottom + 20,
          gap: 12,
        }}
      >
        <Button title="Login" icon="arrow-forward" onPress={() => router.push('/login')} />
        <Button title="Register" variant="outline" onPress={() => router.push('/register')} />
        <Button title="Admin Login" variant="ghost" icon="shield-checkmark" onPress={() => router.push('/admin-login')} />
      </View>
    </View>
  );
}
