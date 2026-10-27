import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ImageProps,
  ImageStyle,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useReducedMotion } from './motion';

function useWaveArrival(source: ImageProps['source'], delay = 0) {
  const reduced = useReducedMotion();
  const phase = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduced) {
      phase.setValue(1);
      return;
    }
    phase.setValue(0);
    const animation = Animated.timing(phase, {
      toValue: 1,
      duration: 1250,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, phase, reduced, source]);
  return {
    opacity: phase.interpolate({
      inputRange: [0, 0.35, 1],
      outputRange: [0, 0.85, 1],
    }),
    transform: [
      {
        translateY: phase.interpolate({
          inputRange: [0, 0.6, 1],
          outputRange: [36, -3, 0],
        }),
      },
      {
        translateX: phase.interpolate({
          inputRange: [0, 0.35, 0.7, 1],
          outputRange: [-14, 7, -2, 0],
        }),
      },
      {
        scale: phase.interpolate({
          inputRange: [0, 1],
          outputRange: [1.06, 1],
        }),
      },
    ],
  };
}
export function WaveImage({
  delay = 0,
  ...props
}: ImageProps & { delay?: number }) {
  const motion = useWaveArrival(props.source, delay);
  return <Animated.Image {...props} style={[props.style, motion]} />;
}
export function WaveBackground({
  source,
  children,
  style,
  imageStyle,
}: {
  source: ImageProps['source'];
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}) {
  const motion = useWaveArrival(source);
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <Animated.Image
        source={source}
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFill,
          imageStyle,
          {
            width: '100%',
            height: '100%',
            opacity: motion.opacity,
            transform: motion.transform.slice(-1),
          },
        ]}
      />
      {children}
    </View>
  );
}
export function OceanWaves() {
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) {
      phase.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(phase, {
        toValue: 1,
        duration: 9500,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [phase, reduced]);
  if (reduced) return null;
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}
    >
      {[0, 1, 2].map(layer => (
        <Animated.View
          key={layer}
          style={{
            position: 'absolute',
            bottom: -18 + layer * 17,
            width: width * 2,
            height: 135,
            opacity: 0.12 - layer * 0.025,
            transform: [
              {
                translateX: phase.interpolate({
                  inputRange: [0, 1],
                  outputRange: layer % 2 ? [-width, 0] : [0, -width],
                }),
              },
              {
                translateY: phase.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, -10 - layer * 3, 0],
                }),
              },
            ],
          }}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
          >
            <Path
              d="M0 65 C100 15 200 15 300 65 S500 115 600 65 C700 15 800 15 900 65 S1100 115 1200 65 L1200 160 L0 160 Z"
              fill={layer === 1 ? '#6bdbe9' : '#139cb7'}
            />
            <Path
              d="M0 65 C100 15 200 15 300 65 S500 115 600 65 C700 15 800 15 900 65 S1100 115 1200 65"
              stroke="#83edf4"
              strokeWidth="1.5"
              fill="none"
            />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
