import { MotionProvider } from './src/components/motion';
import React, { useCallback, useState } from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/store/AppStore';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen, OnboardingScreen } from './src/screens/WelcomeScreens';
import { colors } from './src/components/ui';
function Content() {
  const { state, ready, error } = useApp();
  const [loaded, setLoaded] = useState(false);
  const done = useCallback(() => setLoaded(true), []);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      {!loaded || !ready ? (
        <SplashScreen onDone={done} />
      ) : state.onboarded ? (
        <AppNavigator />
      ) : (
        <OnboardingScreen />
      )}
      {error && (
        <View
          accessibilityRole="alert"
          style={{
            position: 'absolute',
            top: 55,
            left: 15,
            right: 15,
            padding: 16,
            backgroundColor: '#713520',
            borderRadius: 15,
          }}
        >
          <Text style={{ color: 'white' }}>{error}</Text>
        </View>
      )}
    </View>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <MotionProvider>
        <AppProvider>
          <Content />
        </AppProvider>
      </MotionProvider>
    </SafeAreaProvider>
  );
}
