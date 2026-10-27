import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  AppState,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
const MotionContext = createContext(true);
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(true);
  const [active, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (mounted) setReduced(value);
      })
      .catch(() => {});
    const appSubscription = AppState.addEventListener('change', value =>
      setActive(value === 'active'),
    );
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    return () => {
      mounted = false;
      subscription.remove();
      appSubscription.remove();
    };
  }, []);
  return (
    <MotionContext.Provider value={reduced || !active}>
      {children}
    </MotionContext.Provider>
  );
}
export function useReducedMotion() {
  return useContext(MotionContext);
}
export function Reveal({
  children,
  trigger,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  trigger?: string | number | boolean;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduced || trigger === false) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 520,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, progress, reduced, trigger]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function MotionPressable({
  style,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);
  useEffect(() => () => scale.stopAnimation(), [scale]);
  return (
    <AnimatedPressable
      {...props}
      onPressIn={event => {
        setPressed(true);
        if (!reduced)
          Animated.spring(scale, {
            toValue: 0.97,
            speed: 32,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        onPressIn?.(event);
      }}
      onPressOut={event => {
        setPressed(false);
        Animated.spring(scale, {
          toValue: 1,
          speed: 20,
          bounciness: 8,
          useNativeDriver: true,
        }).start();
        onPressOut?.(event);
      }}
      style={[
        typeof style === 'function' ? style({ pressed }) : style,
        { transform: [{ scale }] },
      ]}
    />
  );
}
export function OceanAtmosphere({ active = true }: { active?: boolean }) {
  const reduced = useReducedMotion();
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced || !active) {
      drift.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(drift, {
        toValue: 1,
        duration: 14000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [active, drift, reduced]);
  if (reduced) return null;
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}
    >
      {[8, 25, 44, 67, 83].map((left, index) => (
        <Animated.View
          key={left}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${30 + index * 12}%`,
            width: 5 + index * 2,
            height: 5 + index * 2,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#53d9ed',
            opacity: drift.interpolate({
              inputRange: [0, 0.15, 0.8, 1],
              outputRange: [0, 0.15, 0.1, 0],
            }),
            transform: [
              {
                translateY: drift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, -250],
                }),
              },
              {
                translateX: drift.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, index % 2 ? 18 : -18, 0],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}
