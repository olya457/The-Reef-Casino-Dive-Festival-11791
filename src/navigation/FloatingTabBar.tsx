import React from 'react';
import { View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Map,
  CalendarDays,
  Compass,
  BookOpen,
  Settings,
  ShieldCheck,
} from 'lucide-react-native';
import { MotionPressable as Pressable } from '../components/motion';
import { useResponsive } from '../hooks/useResponsive';
import LinearGradient from '../components/GradientSurface';
import { colors } from '../components/ui';
const icons = [Map, CalendarDays, Compass, BookOpen, Settings, ShieldCheck];
export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { compact } = useResponsive();
  return (
    <View
      style={{
        position: 'absolute',
        left: compact ? 12 : 18,
        right: compact ? 12 : 18,
        bottom: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#366073',
        backgroundColor: '#092331',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 9,
      }}
    >
      <View style={{ flexDirection: 'row', padding: 8 }}>
        {state.routes.map((route, index) => {
          const Icon = icons[index];
          const active = state.index === index;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={
                descriptors[route.key].options.title || route.name
              }
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!event.defaultPrevented)
                  navigation.navigate(route.name, route.params);
              }}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
              style={{
                flex: 1,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {active && (
                <LinearGradient
                  colors={[colors.gold, '#fff3af']}
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: 23,
                    height: 2,
                    borderRadius: 2,
                  }}
                />
              )}
              <Icon
                size={compact ? 23 : 25}
                color={active ? colors.cyan : '#728e9e'}
                strokeWidth={active ? 2.1 : 1.7}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function renderFloatingTabBar(props: BottomTabBarProps) {
  return <FloatingTabBar {...props} />;
}
