import { WaveImage, WaveBackground, OceanWaves } from '../components/WaveMedia';
import {
  Reveal,
  OceanAtmosphere,
  useReducedMotion,
} from '../components/motion';
import { useResponsive } from '../hooks/useResponsive';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from '../components/GradientSurface';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Waves } from 'lucide-react-native';
import { images } from '../data/images';
import { Button, colors, styles } from '../components/ui';
import { useApp } from '../store/AppStore';
const animation = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:transparent;overflow:hidden}.track{height:3px;width:100%;background:#ffffff20;border-radius:5px;margin-top:12px}.wave{height:100%;background:linear-gradient(90deg,#38d2e9,#efbc5c);animation:load 4s linear forwards}@keyframes load{from{width:0}to{width:100%}}</style></head><body><div class="track"><div class="wave"></div></div><script>setTimeout(()=>window.ReactNativeWebView.postMessage('done'),4000)</script></body></html>`;
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const { width, height, compact } = useResponsive();
  const inset = useSafeAreaInsets();
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = setTimeout(onDone, 4700);
    return () => clearTimeout(timer);
  }, [onDone]);
  return (
    <WaveBackground source={images.onboarding[0]} style={{ flex: 1 }}>
      <LinearGradient
        colors={['#00132277', '#00101aaa']}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ flex: 1 }}>
        <OceanAtmosphere />
        <OceanWaves />
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingTop: inset.top + 24,
            paddingBottom: inset.bottom + 24,
            paddingHorizontal: 24,
          }}
        >
          <Reveal style={{ alignItems: 'center' }}>
            <WaveImage
              source={images.logo}
              style={{
                width: Math.min(width * 0.75, height * 0.34, 320),
                height: Math.min(width * 0.75, height * 0.34, 320),
                borderRadius: 28,
                marginTop: height * 0.045,
              }}
            />
            <Text
              style={{
                color: 'white',
                fontWeight: '900',
                fontSize: Math.min(width * 0.11, 44),
                letterSpacing: compact ? 3 : 6,
                marginTop: height * 0.045,
              }}
            >
              DEEP BLUE
            </Text>
            <Text
              style={{
                color: colors.gold,
                letterSpacing: compact ? 3 : 5,
                fontSize: 15,
                marginTop: 15,
              }}
            >
              DIVING FESTIVAL
            </Text>
            <Text style={[styles.body, { marginTop: 30, letterSpacing: 1 }]}>
              Organized by The Reef Casino
            </Text>
            <View style={{ height: 30, width: 100, marginTop: 18 }}>
              <WebView
                source={{
                  html: reduced
                    ? animation.replace(
                        'animation:load 4s linear forwards',
                        'width:100%',
                      )
                    : animation,
                }}
                style={{ backgroundColor: 'transparent' }}
                scrollEnabled={false}
                onMessage={e => {
                  if (e.nativeEvent.data === 'done') onDone();
                }}
                originWhitelist={['about:blank']}
                onShouldStartLoadWithRequest={r => r.url === 'about:blank'}
              />
            </View>
          </Reveal>
        </ScrollView>
      </View>
    </WaveBackground>
  );
}
const slides = [
  [
    'Welcome to Deep Blue',
    'Discover an extraordinary world of diving adventures, ocean exploration, and unforgettable underwater experiences at Deep Blue Diving Festival.',
  ],
  [
    'Navigate the Underwater World',
    'Discover diving pools, ocean exhibitions, training centers, restaurants, and visitor facilities using our interactive festival map.',
  ],
  [
    'Reserve Your Experience',
    'Explore diving activities, interactive workshops, and ocean shows. Choose your date, reserve places for your group and save a QR ticket on your device.',
  ],
  [
    'Take the Ocean Challenge',
    'Complete interactive missions, explore festival locations, test your diving knowledge, and unlock exclusive achievements.',
  ],
  [
    'Explore Beyond the Surface',
    'Uncover marine discoveries, learn about diving equipment, and experience the mysteries of the underwater world.',
  ],
];
export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const { update } = useApp();
  const { height, compact, gutter, fontScale } = useResponsive();
  const inset = useSafeAreaInsets();
  return (
    <WaveBackground source={images.onboarding[index]} style={{ flex: 1 }}>
      <LinearGradient
        colors={['#00101a00', '#03142022', '#031420', '#031420']}
        locations={[0, 0.4, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ flex: 1 }}>
        <OceanAtmosphere />
        <OceanWaves />
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: gutter,
            paddingTop: inset.top + 20,
            paddingBottom: Math.max(inset.bottom, 16) + 24,
          }}
        >
          <Reveal trigger={index} style={{ flexGrow: 1 }}>
            <View style={styles.between}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#bba45d88',
                  borderRadius: 28,
                  padding: 12,
                }}
              >
                <Waves size={22} color={colors.cyan} />
              </View>
              <Text style={{ color: '#b6cbd7', fontSize: 9, letterSpacing: 1 }}>
                Presented by The Reef Casino
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                minHeight: height * (compact || fontScale > 1.3 ? 0.16 : 0.34),
              }}
            />
            <Text style={[styles.label, { marginBottom: 15 }]}>
              DIVE INTO WONDER
            </Text>
            <Text
              style={[
                styles.title,
                styles.serif,
                { fontSize: compact ? 29 : 36 },
              ]}
            >
              {slides[index][0]}
            </Text>
            <Text style={[styles.body, { marginTop: 16, marginBottom: 16 }]}>
              {slides[index][1]}
            </Text>
            <View style={[styles.row, { gap: 5, marginBottom: 10 }]}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={{
                    height: 4,
                    width: i === index ? 22 : 5,
                    borderRadius: 5,
                    backgroundColor: i === index ? colors.gold : '#44525a',
                  }}
                />
              ))}
            </View>
            <Button
              title={
                index === 0
                  ? 'Get Started  ›'
                  : index === 4
                  ? 'Explore Festival  ›'
                  : 'Continue  ›'
              }
              disabled={busy}
              onPress={() => {
                if (index < 4) setIndex(index + 1);
                else {
                  setBusy(true);
                  update(s => ({ ...s, onboarded: true })).catch(() =>
                    setBusy(false),
                  );
                }
              }}
            />
            {index > 0 && (
              <Button
                title="Previous"
                secondary
                onPress={() => setIndex(index - 1)}
              />
            )}
          </Reveal>
        </ScrollView>
      </View>
    </WaveBackground>
  );
}
