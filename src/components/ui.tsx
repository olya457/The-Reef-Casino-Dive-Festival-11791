import { WaveBackground } from './WaveMedia';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  ImageSourcePropType,
  TextInput,
  Platform,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useResponsive } from '../hooks/useResponsive';
import {
  MotionPressable as Pressable,
  Reveal,
  OceanAtmosphere,
  useReducedMotion,
} from './motion';
import LinearGradient from './GradientSurface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Search, ChevronRight } from 'lucide-react-native';
export const colors = {
  bg: '#031420',
  panel: '#0a2435',
  border: '#234354',
  cyan: '#38d2e9',
  muted: '#8aa5b5',
  gold: '#efbc5c',
  white: '#eff6fa',
};
export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { fontSize: 27, color: colors.white, fontWeight: '400' },
  h2: { fontSize: 20, color: colors.white, marginTop: 22, marginBottom: 14 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 23 },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.gold,
  },
  input: {
    color: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: '#142733',
    minHeight: 48,
  },
  serif: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  link: { color: colors.cyan, fontWeight: '600', fontSize: 13 },
  spacer: { height: 20 },
});
export function Screen({
  children,
  padded = true,
  animationKey,
}: {
  children: React.ReactNode;
  padded?: boolean;
  animationKey?: string | number;
}) {
  const insets = useSafeAreaInsets();
  const { gutter, contentWidth, compact } = useResponsive();
  const focused = useIsFocused();
  return (
    <LinearGradient
      colors={['#092636', colors.bg, colors.bg]}
      style={{ flex: 1 }}
    >
      <OceanAtmosphere active={focused} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: insets.top + (compact ? 12 : 20),
            paddingHorizontal: padded ? gutter : 0,
            width: '100%',
            maxWidth: contentWidth + gutter * 2,
            alignSelf: 'center',
            paddingBottom: insets.bottom + 110,
            flexGrow: 1,
          }}
        >
          <Reveal
            trigger={focused ? `screen-${animationKey ?? 'default'}` : false}
          >
            {children}
          </Reveal>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
export function Header({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: () => void;
  action?: React.ReactNode;
}) {
  const { compact } = useResponsive();
  return (
    <View
      style={[
        styles.row,
        { marginBottom: compact ? 16 : 22, gap: compact ? 8 : 12 },
      ]}
    >
      {back && (
        <IconButton label="Go back" onPress={back}>
          <ChevronLeft color={colors.white} />
        </IconButton>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { fontSize: compact ? 23 : 27 }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.body, { fontSize: 12, marginTop: 7 }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {action}
    </View>
  );
}
export function IconButton({
  children,
  onPress,
  label,
  active = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        width: 46,
        flexShrink: 0,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: active ? colors.cyan : colors.border,
        backgroundColor: '#153041',
      }}
    >
      {children}
    </Pressable>
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        opacity: disabled ? 0.4 : 1,
        marginVertical: 6,
        flexShrink: 0,
        alignSelf: 'stretch',
      }}
    >
      <LinearGradient
        colors={secondary ? ['#102e40', '#0b2635'] : ['#13a6c5', '#057a99']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          minHeight: 52,
          flexShrink: 0,
          overflow: 'hidden',
          paddingHorizontal: 18,
          paddingVertical: 15,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: secondary ? 1 : 0,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            color: secondary ? colors.cyan : 'white',
            fontWeight: '700',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
export function Tag({ text }: { text: string }) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderRadius: 20,
        backgroundColor: '#123d50',
        borderWidth: 1,
        borderColor: '#20566a',
        paddingHorizontal: 9,
        paddingVertical: 4,
        marginBottom: 9,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          letterSpacing: 1,
          color: '#83e9f7',
          fontWeight: '800',
        }}
      >
        {text.toUpperCase()}
      </Text>
    </View>
  );
}
export function Chips({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 7, paddingBottom: 16 }}
    >
      {items.map(item => (
        <Pressable
          key={item}
          accessibilityRole="button"
          accessibilityState={{ selected: value === item }}
          onPress={() => onChange(item)}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: 22,
            backgroundColor: value === item ? colors.cyan : colors.panel,
            borderWidth: 1,
            borderColor: value === item ? colors.cyan : colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: value === item ? colors.bg : colors.muted,
              fontWeight: '600',
            }}
          >
            {item}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function Hero({
  source,
  title,
  label,
  children,
  height = 290,
}: {
  source: ImageSourcePropType;
  title: string;
  label?: string;
  children?: React.ReactNode;
  height?: number;
}) {
  const { compact } = useResponsive();
  return (
    <WaveBackground
      source={source}
      style={{
        minHeight: compact ? height * 0.85 : height,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        borderRadius: 20,
        marginBottom: 20,
      }}
    >
      <LinearGradient
        colors={['transparent', '#031420ee', colors.bg]}
        style={{ padding: compact ? 15 : 20, paddingTop: compact ? 65 : 100 }}
      >
        {label && (
          <Text style={[styles.label, { marginBottom: 12 }]}>{label}</Text>
        )}
        <Text
          style={[
            styles.title,
            styles.serif,
            {
              fontSize: height < 250 ? (compact ? 21 : 23) : compact ? 27 : 31,
            },
          ]}
        >
          {title}
        </Text>
        {children}
      </LinearGradient>
    </WaveBackground>
  );
}
export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <View style={[styles.card, { paddingVertical: 35, alignItems: 'center' }]}>
      <Text style={[styles.h2, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[styles.body, { textAlign: 'center' }]}>{body}</Text>
    </View>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = 'Search',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={[styles.row, styles.input, { marginBottom: 12 }]}>
      <Search size={18} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={{ flex: 1, color: colors.white, padding: 0, minHeight: 22 }}
        accessibilityLabel={placeholder}
      />
    </View>
  );
}
export function RowLink({
  title,
  subtitle,
  onPress,
  icon,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.card, styles.row]}
    >
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.white, fontSize: 16 }}>{title}</Text>
        {subtitle && (
          <Text style={[styles.body, { fontSize: 12 }]}>{subtitle}</Text>
        )}
      </View>
      <ChevronRight color={colors.muted} size={19} />
    </Pressable>
  );
}
export function ProgressBar({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: Math.min(1, Math.max(0, value)),
      duration: reduced ? 0 : 650,
      useNativeDriver: false,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [value, progress, reduced]);
  return (
    <View
      style={{
        height: 5,
        backgroundColor: '#243947',
        borderRadius: 4,
        overflow: 'hidden',
        marginVertical: 15,
      }}
    >
      <Animated.View
        style={{
          width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        }}
      >
        <LinearGradient
          colors={[colors.cyan, colors.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: '100%',
            height: 5,
          }}
        />
      </Animated.View>
    </View>
  );
}
export function Section({ title, body }: { title: string; body: string }) {
  return (
    <View>
      <Text style={styles.h2}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}
