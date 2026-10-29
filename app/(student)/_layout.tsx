import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const tab = (title: string, active: IconName, idle: IconName) => ({
  title,
  tabBarIcon: ({ color, focused, size }: { color: string; focused: boolean; size: number }) => (
    <Ionicons name={focused ? active : idle} size={size} color={color} />
  ),
});

export default function StudentTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.faint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 4,
          borderTopWidth: 0,
          backgroundColor: '#fff',
          shadowColor: '#2F5BA8',
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 12,
        },
      }}
    >
      <Tabs.Screen name="index" options={tab('Home', 'home', 'home-outline')} />
      <Tabs.Screen name="courses" options={tab('Courses', 'book', 'book-outline')} />
      <Tabs.Screen name="practice" options={tab('Practice', 'create', 'create-outline')} />
      <Tabs.Screen name="notes" options={tab('Notes', 'document-text', 'document-text-outline')} />
      <Tabs.Screen name="profile" options={tab('Profile', 'person', 'person-outline')} />
    </Tabs>
  );
}
