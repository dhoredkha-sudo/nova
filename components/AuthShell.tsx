import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#4A92F8', '#BFDDFD', '#F3F6FC']} style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 12 }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              marginLeft: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.85)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
            <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text }}>{title}</Text>
            <Text style={{ fontSize: 14, color: '#344054', marginTop: 6 }}>{subtitle}</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 24,
              paddingBottom: insets.bottom + 24,
            }}
          >
            {children}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
