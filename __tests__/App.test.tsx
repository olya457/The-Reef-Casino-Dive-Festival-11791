import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));
jest.mock('react-native-linear-gradient', () => require('react-native').View);
jest.mock('react-native-webview', () => ({
  WebView: require('react-native').View,
}));
jest.mock('@react-navigation/native', () => ({ useIsFocused: () => true }));
jest.mock('lucide-react-native', () => ({
  Waves: require('react-native').View,
  ChevronLeft: require('react-native').View,
  Search: require('react-native').View,
  ChevronRight: require('react-native').View,
}));
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('../src/navigation/AppNavigator', () => ({
  AppNavigator: () => null,
}));
test('shows splash, then onboarding for a new user', async () => {
  jest.useFakeTimers();
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });
  expect(JSON.stringify(tree!.toJSON())).toContain('DEEP BLUE');
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(4800);
  });
  expect(JSON.stringify(tree!.toJSON())).toContain('Welcome to Deep Blue');
  await ReactTestRenderer.act(async () => {
    tree!.unmount();
  });
  jest.useRealTimers();
});
