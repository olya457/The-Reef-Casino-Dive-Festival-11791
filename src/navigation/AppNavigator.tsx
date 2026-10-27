import { SafetyScreen } from '../screens/SafetyScreen';
import React from 'react';
import { useReducedMotion } from '../components/motion';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { renderFloatingTabBar } from './FloatingTabBar';
import { StackParams, TabParams } from '../types';
import { colors } from '../components/ui';
import { MapScreen } from '../screens/MapScreen';
import {
  EventsScreen,
  EventDetailScreen,
  BookingScreen,
  TicketScreen,
  BookingsScreen,
} from '../screens/EventScreens';
import {
  ChallengesScreen,
  ChallengeScreen,
  AchievementsScreen,
} from '../screens/ChallengeScreens';
import {
  SecretsScreen,
  SecretListScreen,
  SecretDetailScreen,
  EquipmentScreen,
  EquipmentDetailScreen,
} from '../screens/DiscoveryScreens';
const Stack = createNativeStackNavigator<StackParams>();
const Tabs = createBottomTabNavigator<TabParams>();
function TabNavigator() {
  const reduced = useReducedMotion();
  return (
    <Tabs.Navigator
      tabBar={renderFloatingTabBar}
      screenOptions={{
        headerShown: false,
        animation: reduced ? 'none' : 'fade',
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Dive Map' }}
      />
      <Tabs.Screen name="Events" component={EventsScreen} />
      <Tabs.Screen name="Challenges" component={ChallengesScreen} />
      <Tabs.Screen name="Secrets" component={SecretsScreen} />
      <Tabs.Screen name="Equipment" component={EquipmentScreen} />
      <Tabs.Screen
        name="Safety"
        component={SafetyScreen}
        options={{ title: 'Diving Safety' }}
      />
    </Tabs.Navigator>
  );
}
export function AppNavigator() {
  const reduced = useReducedMotion();
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.bg,
          card: colors.panel,
          primary: colors.cyan,
          text: colors.white,
          border: colors.border,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: reduced ? 'none' : 'slide_from_right',
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Ticket" component={TicketScreen} />
        <Stack.Screen name="Bookings" component={BookingsScreen} />
        <Stack.Screen name="SecretList" component={SecretListScreen} />
        <Stack.Screen name="SecretDetail" component={SecretDetailScreen} />
        <Stack.Screen
          name="EquipmentDetail"
          component={EquipmentDetailScreen}
        />
        <Stack.Screen name="Challenge" component={ChallengeScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
