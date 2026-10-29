import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Loading } from '@/components/ui';

function Gate() {
  const { session, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const top = segments[0] as string | undefined;
    const inStudent = top === '(student)';
    const inAdmin = top === '(admin)';
    const inShared = top === 'about' || top === 'test' || top === 'player';
    const isPublic = !inStudent && !inAdmin && !inShared;

    if (!session) {
      if (!isPublic) router.replace('/');
      return;
    }
    if (!profile) return; // প্রোফাইল লোড হচ্ছে
    const isAdmin = profile.role === 'admin';
    if (isPublic) router.replace(isAdmin ? '/(admin)' : '/(student)');
    else if (inAdmin && !isAdmin) router.replace('/(student)');
  }, [session, profile, loading, segments, router]);

  if (loading) return <Loading />;
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
