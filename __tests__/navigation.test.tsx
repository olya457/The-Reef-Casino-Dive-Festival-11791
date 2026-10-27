import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MotionPressable } from '../src/components/motion';
import { renderFloatingTabBar } from '../src/navigation/FloatingTabBar';

jest.mock('@react-navigation/native', () => ({ useIsFocused: () => true }));
jest.mock('react-native-linear-gradient', () => require('react-native').View);
jest.mock('lucide-react-native', () => {
  const View = require('react-native').View;
  return {
    Map: View,
    CalendarDays: View,
    Compass: View,
    BookOpen: View,
    Settings: View,
    ShieldCheck: View,
  };
});

test('navigation can invoke the tab renderer outside React without calling hooks', async () => {
  const routes = [
    'Map',
    'Events',
    'Challenges',
    'Secrets',
    'Equipment',
    'Safety',
  ].map(name => ({ key: name, name }));
  const navigate = jest.fn();
  const emit = jest.fn(() => ({ defaultPrevented: false }));
  const props = {
    state: { index: 0, routes },
    descriptors: Object.fromEntries(
      routes.map(route => [route.key, { options: { title: route.name } }]),
    ),
    navigation: { navigate, emit },
    insets: { top: 0, bottom: 0, left: 0, right: 0 },
  } as unknown as BottomTabBarProps;
  const element = renderFloatingTabBar(props);
  expect(React.isValidElement(element)).toBe(true);
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(element);
  });
  const tabs = tree!.root.findAllByType(MotionPressable);
  expect(tabs).toHaveLength(6);
  await ReactTestRenderer.act(async () => {
    tabs[1].props.onPress();
  });
  expect(navigate).toHaveBeenCalledWith('Events', undefined);
  await ReactTestRenderer.act(async () => {
    tabs[5].props.onPress();
  });
  expect(navigate).toHaveBeenLastCalledWith('Safety', undefined);
  emit.mockReturnValue({ defaultPrevented: true });
  await ReactTestRenderer.act(async () => {
    tabs[2].props.onPress();
  });
  expect(navigate).toHaveBeenCalledTimes(2);
  await ReactTestRenderer.act(async () => {
    tree!.unmount();
  });
});
