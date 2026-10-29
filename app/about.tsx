import React from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, ListRow } from '@/components/ui';
import { colors } from '@/lib/theme';

export default function About() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <LinearGradient colors={['#3F8CF7', '#8EC3FB']} style={{ paddingTop: insets.top + 8, paddingBottom: 70, alignItems: 'center' }}>
        <Pressable onPress={() => router.back()} style={{ position: 'absolute', left: 16, top: insets.top + 10 }}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 4 }}>About</Text>
        <Image source={require('@/assets/icon.png')} style={{ width: 84, height: 84, borderRadius: 24, marginTop: 20 }} />
        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 10 }}>Nova</Text>
        <Text style={{ color: '#E6F0FF' }}>Learn Today, Build Tomorrow · v1.0.0</Text>
      </LinearGradient>

      <View style={{ paddingHorizontal: 16, marginTop: -40 }}>
        <Card style={{ alignItems: 'center', paddingVertical: 22 }}>
          <Image
            source={require('@/assets/developer.jpg')}
            style={{ width: 104, height: 104, borderRadius: 52, borderWidth: 3, borderColor: colors.primary }}
          />
          <Text style={{ color: colors.sub, marginTop: 12, fontSize: 12 }}>Developed by</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>Azim R.</Text>
          <Text style={{ color: colors.sub, marginTop: 6, textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 }}>
            একজন শিক্ষার্থী-ডেভেলপার, যার স্বপ্ন প্রযুক্তি দিয়ে সবার জন্য শেখাকে সহজ করা।
          </Text>
        </Card>

        <View style={{ marginTop: 16 }}>
          <ListRow
            icon="mail"
            color={colors.primary}
            bg={colors.blueBg}
            title="Contact"
            sub="azim4web@gmail.com"
            onPress={() => Linking.openURL('mailto:azim4web@gmail.com')}
          />
          <ListRow icon="phone-portrait" color={colors.teal} bg={colors.tealBg} title="App version" sub="1.0.0 · com.novaedu.app" right={<View />} />
        </View>
      </View>
    </ScrollView>
  );
}
