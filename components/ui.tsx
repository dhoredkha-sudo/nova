import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '@/lib/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const bg =
    variant === 'primary' ? colors.primary : variant === 'danger' ? colors.red : 'transparent';
  const fg = variant === 'primary' || variant === 'danger' ? '#fff' : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: pressed || disabled ? 0.8 : 1 },
        variant === 'outline' && { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: '#fff' },
        variant === 'ghost' && { borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
        variant === 'primary' && shadow,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {variant === 'ghost' && icon && <Ionicons name={icon} size={18} color={colors.text} />}
          <Text style={[styles.btnText, { color: variant === 'ghost' ? colors.text : fg }]}>{title}</Text>
          {variant !== 'ghost' && icon && <Ionicons name={icon} size={18} color={fg} />}
        </View>
      )}
    </Pressable>
  );
}

export function Field(props: TextInputProps & { icon?: IconName; label?: string }) {
  const { icon, label, style, ...rest } = props;
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.field}>
        {icon && <Ionicons name={icon} size={18} color={colors.faint} style={{ marginRight: 8 }} />}
        <TextInput
          placeholderTextColor={colors.faint}
          style={[{ flex: 1, fontSize: 15, color: colors.text, paddingVertical: 12 }, style]}
          autoCapitalize="none"
          {...rest}
        />
      </View>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: colors.sub, fontSize: 12 }}>{action}</Text>
          <Ionicons name="chevron-forward" size={12} color={colors.sub} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function IconBubble({
  name,
  color,
  bg,
  size = 44,
}: {
  name: IconName;
  color: string;
  bg: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.34,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={name} size={size * 0.5} color={color} />
    </View>
  );
}

export function StatTile({
  icon,
  color,
  bg,
  label,
  value,
}: {
  icon: IconName;
  color: string;
  bg: string;
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.stat}>
      <IconBubble name={icon} color={color} bg={bg} size={36} />
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function QuickTile({
  icon,
  color,
  bg,
  title,
  sub,
  onPress,
}: {
  icon: IconName;
  color: string;
  bg: string;
  title: string;
  sub: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quick, { opacity: pressed ? 0.85 : 1 }]}>
      <IconBubble name={icon} color={color} bg={bg} size={46} />
      <Text style={styles.quickTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.quickSub} numberOfLines={1}>
        {sub}
      </Text>
    </Pressable>
  );
}

export function ListRow({
  icon,
  color,
  bg,
  title,
  sub,
  right,
  onPress,
}: {
  icon: IconName;
  color: string;
  bg: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1 }]}>
      <IconBubble name={icon} color={color} bg={bg} size={42} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {sub ? (
          <Text style={styles.rowSub} numberOfLines={1}>
            {sub}
          </Text>
        ) : null}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={16} color={colors.faint} />}
    </Pressable>
  );
}

export function Avatar({ uri, name, size = 52 }: { uri?: string | null; name?: string; size?: number }) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: '#fff' }}
      />
    );
  }
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primaryDark,
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.36 }}>{initials}</Text>
    </View>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <View style={{ alignItems: 'center', padding: 24 }}>
      <Ionicons name="file-tray-outline" size={32} color={colors.faint} />
      <Text style={{ color: colors.sub, marginTop: 8, textAlign: 'center' }}>{text}</Text>
    </View>
  );
}

export function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnText: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 13, color: colors.sub, marginBottom: 6, fontWeight: '600' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 14, ...shadow },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  statLabel: { fontSize: 11, color: colors.sub, marginTop: 6 },
  statValue: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 2 },
  quick: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    ...shadow,
  },
  quickTitle: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 8 },
  quickSub: { fontSize: 10, color: colors.faint, marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    ...shadow,
  },
  rowTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  rowSub: { fontSize: 12, color: colors.sub, marginTop: 2 },
});
