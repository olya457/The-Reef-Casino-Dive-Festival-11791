export type Booking = {
  id: string;
  eventId: number;
  date: string;
  guests: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
};
export type Progress = {
  onboarded: boolean;
  favorites: number[];
  saved: number[];
  visited: number[];
  read: number[];
  passed: string[];
  answers: Record<string, number[]>;
  bookings: Booking[];
};
export type TabParams = {
  Map: { locationId?: number } | undefined;
  Events: { locationId?: number } | undefined;
  Challenges: undefined;
  Secrets: undefined;
  Equipment: undefined;
  Safety: undefined;
};
export type StackParams = {
  Tabs: import('@react-navigation/native').NavigatorScreenParams<TabParams>;
  EventDetail: { id: number; date?: string };
  Booking: { id: number; date?: string };
  Ticket: { id: string };
  Bookings: undefined;
  SecretList: { category?: string; saved?: boolean };
  SecretDetail: { id: number };
  EquipmentDetail: { id: number };
  Challenge: { id: string };
  Achievements: undefined;
};
export type Nav =
  import('@react-navigation/native-stack').NativeStackNavigationProp<StackParams>;
