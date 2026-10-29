import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './theme';

type Btn = { text?: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void };
type Kind = 'error' | 'success' | 'warning' | 'info';
type Data = { title: string; message?: string; buttons: Btn[]; kind: Kind };

let push: ((d: Data) => void) | null = null;

function inferKind(title: string, buttons: Btn[]): Kind {
  if (buttons.some((b) => b.style === 'destructive')) return 'warning';
  if (/ব্যর্থ|ত্রুটি|অনুমতি নেই|নিষ্ক্রিয়|ভুল/.test(title)) return 'error';
  if (/সফল|সংরক্ষিত|ধন্যবাদ|সম্পন্ন/.test(title)) return 'success';
  return 'info';
}

/** React Native-এর Alert.alert-এর মতোই ব্যবহার করা যায়, কিন্তু ডিজাইন করা ডায়ালগ দেখায় */
export const Alert = {
  alert(title: string, message?: string, buttons?: Btn[], kind?: Kind) {
    const b = buttons && buttons.length ? buttons : [{ text: 'ঠিক আছে' }];
    push?.({ title, message, buttons: b, kind: kind ?? inferKind(title, b) });
  },
};

/** সুপাবেসের ইংরেজি এরর বাংলায় সহজ করে */
export function friendly(msg?: string) {
  const m = (msg ?? '').toLowerCase();
  if (m.includes('invalid login')) return 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে। আবার চেষ্টা করুন।';
  if (m.includes('not confirmed')) return 'আপনার ইমেইল এখনো যাচাই করা হয়নি। ইনবক্স দেখুন।';
  if (m.includes('already registered') || m.includes('already been registered'))
    return 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। লগইন করুন।';
  if (m.includes('rate limit') || m.includes('security purposes'))
    return 'অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।';
  if (m.includes('network') || m.includes('fetch')) return 'ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।';
  if (m.includes('password') && m.includes('6')) return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
  if (m.includes('invalid email') || m.includes('valid email')) return 'সঠিক ইমেইল ঠিকানা লিখুন।';
  return msg || 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।';
}

const KIND = {
  error: { icon: 'close-circle', color: colors.red, bg: '#FDE8E8' },
  success: { icon: 'checkmark-circle', color: colors.green, bg: colors.greenBg },
  warning: { icon: 'warning', color: colors.orange, bg: colors.orangeBg },
  info: { icon: 'information-circle', color: colors.primary, bg: colors.blueBg },
} as const;

export function DialogHost() {
  const [queue, setQueue] = useState<Data[]>([]);
  const scale = useRef(new Animated.Value(0.85)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const current = queue[0];

  useEffect(() => {
    push = (d) => setQueue((q) => [...q, d]);
    return () => {
      push = null;
    };
  }, []);

  useEffect(() => {
    if (current) {
      scale.setValue(0.85);
      fade.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7, tension: 90 }),
        Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]).start();
    }
  }, [current, scale, fade]);

  if (!current) return null;
  const k = KIND[current.kind];
  const close = (b?: Btn) => {
    setQueue((q) => q.slice(1));
    b?.onPress?.();
  };
  const cancel = current.buttons.find((b) => b.style === 'cancel');

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={() => close(cancel)}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(16,24,40,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 28,
          opacity: fade,
        }}
      >
        <Animated.View
          style={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: '#fff',
            borderRadius: 28,
            paddingHorizontal: 22,
            paddingTop: 26,
            paddingBottom: 20,
            alignItems: 'center',
            transform: [{ scale }],
            shadowColor: '#0B1B3A',
            shadowOpacity: 0.25,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
            elevation: 16,
          }}
        >
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: k.bg,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Ionicons name={k.icon} size={38} color={k.color} />
          </View>
          <Text style={{ fontSize: 19, fontWeight: '800', color: colors.text, textAlign: 'center' }}>{current.title}</Text>
          {!!current.message && (
            <Text style={{ fontSize: 14, color: colors.sub, textAlign: 'center', marginTop: 8, lineHeight: 21 }}>
              {current.message}
            </Text>
          )}
          <View
            style={{
              flexDirection: current.buttons.length > 2 ? 'column' : 'row',
              gap: 10,
              marginTop: 22,
              alignSelf: 'stretch',
            }}
          >
            {current.buttons.map((b, i) => {
              const destructive = b.style === 'destructive';
              const ghost = b.style === 'cancel';
              const bg = ghost ? '#F2F4F7' : destructive ? colors.red : colors.primary;
              return (
                <Pressable
                  key={i}
                  onPress={() => close(b)}
                  style={({ pressed }) => ({
                    flex: current.buttons.length > 2 ? undefined : 1,
                    height: 46,
                    borderRadius: 23,
                    backgroundColor: bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text style={{ fontWeight: '700', fontSize: 15, color: ghost ? colors.text : '#fff' }}>
                    {b.text ?? 'ঠিক আছে'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
