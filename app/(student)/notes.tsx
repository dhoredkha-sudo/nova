import React, { useState } from 'react';
import { Alert } from '@/lib/dialog';
import { Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Empty, Field, Loading } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { timeAgo, useLoad } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

type Note = { id: string; title: string; body: string | null; created_at: string };

export default function Notes() {
  const { session } = useAuth();
  const uid = session!.user.id;
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState<Note | null>(null);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, loading, refreshing, refresh, reload } = useLoad(async () => {
    const { data } = await supabase.from('notes').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    return (data ?? []) as Note[];
  }, [] as Note[]);

  const openNew = () => {
    setEditing(null);
    setTitle('');
    setBody('');
    setVisible(true);
  };
  const openEdit = (n: Note) => {
    setEditing(n);
    setTitle(n.title);
    setBody(n.body ?? '');
    setVisible(true);
  };

  const save = async () => {
    if (!title.trim()) return Alert.alert('শিরোনাম দিন');
    setSaving(true);
    const { error } = editing
      ? await supabase.from('notes').update({ title: title.trim(), body }).eq('id', editing.id)
      : await supabase.from('notes').insert({ user_id: uid, title: title.trim(), body });
    setSaving(false);
    if (error) return Alert.alert('ত্রুটি', error.message);
    setVisible(false);
    reload();
  };

  const remove = (n: Note) =>
    Alert.alert('নোট মুছবেন?', n.title, [
      { text: 'বাতিল', style: 'cancel' },
      {
        text: 'মুছুন',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('notes').delete().eq('id', n.id);
          reload();
        },
      },
    ]);

  if (loading) return <Loading />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 14 }}>Notes</Text>
        {data.length === 0 && <Empty text="আপনার প্রথম নোটটি লিখুন — নিচের + বাটনে চাপ দিন" />}
        {data.map((n) => (
          <Pressable key={n.id} onPress={() => openEdit(n)} onLongPress={() => remove(n)}>
            <Card style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '800', fontSize: 15, color: colors.text, flex: 1 }}>{n.title}</Text>
                <Pressable onPress={() => remove(n)} hitSlop={10}>
                  <Ionicons name="trash-outline" size={18} color={colors.faint} />
                </Pressable>
              </View>
              {!!n.body && (
                <Text style={{ color: colors.sub, marginTop: 6 }} numberOfLines={3}>
                  {n.body}
                </Text>
              )}
              <Text style={{ color: colors.faint, fontSize: 11, marginTop: 8 }}>{timeAgo(n.created_at)}</Text>
            </Card>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={openNew}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 24,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>

      <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: insets.top + 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '800' }}>{editing ? 'Edit Note' : 'New Note'}</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Ionicons name="close" size={26} color={colors.text} />
            </Pressable>
          </View>
          <Field placeholder="Title" autoCapitalize="sentences" value={title} onChangeText={setTitle} />
          <TextInput
            placeholder="লিখুন..."
            placeholderTextColor={colors.faint}
            multiline
            value={body}
            onChangeText={setBody}
            style={{
              flex: 1,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 14,
              padding: 14,
              fontSize: 15,
              marginBottom: 14,
            }}
          />
          <Button title="Save" onPress={save} loading={saving} style={{ marginBottom: insets.bottom + 8 }} />
        </View>
      </Modal>
    </View>
  );
}
