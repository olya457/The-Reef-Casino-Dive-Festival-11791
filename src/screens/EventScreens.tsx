import { WaveImage } from '../components/WaveMedia';
import { useResponsive } from '../hooks/useResponsive';
import { MotionPressable as Pressable } from '../components/motion';
import React, { useState } from 'react';
import {
  Text,
  View,
  Alert,
  Modal,
  useWindowDimensions,
  Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  Ticket,
  Minus,
  Plus,
  Check,
  Clock,
  MapPin,
  X,
} from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  Screen,
  Header,
  Chips,
  Hero,
  Tag,
  Button,
  IconButton,
  Section,
  Empty,
  styles,
  colors,
} from '../components/ui';
import events from '../data/events.json';
import locations from '../data/locations.json';
import { images } from '../data/images';
import { useApp } from '../store/AppStore';
import { bookingConflict, today, validDate } from '../utils/progress';
import {
  upcomingDates,
  eventIdsOnDate,
  remainingPlaces,
  dateLabel,
} from '../utils/schedule';
import { Nav, StackParams, TabParams } from '../types';
export function EventsScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<TabParams, 'Events'>>();
  const [category, setCategory] = useState('All Events');
  const [time, setTime] = useState('All times');
  const [date, setDate] = useState(upcomingDates()[0]);
  const dates = upcomingDates();
  const locationId = route.params?.locationId;
  const list = events.filter(
    e =>
      eventIdsOnDate(date).includes(e.id) &&
      (!locationId || e.locationId === locationId) &&
      (category === 'All Events' || e.category === category) &&
      (time === 'All times' ||
        (time === 'Before 14:00' ? e.start < '14:00' : e.start >= '14:00')),
  );
  return (
    <Screen>
      <Header
        title="Festival Events"
        subtitle="Experiences by The Reef Dive Festival"
        action={
          <IconButton
            label="My Bookings"
            onPress={() => nav.navigate('Bookings')}
          >
            <Ticket color={colors.cyan} />
          </IconButton>
        }
      />
      <Chips
        items={[
          'All Events',
          'Diving',
          'Workshops',
          'Ocean Shows',
          'Exhibitions',
          'Family Activities',
        ]}
        value={category}
        onChange={setCategory}
      />
      <Chips
        items={['All times', 'Before 14:00', 'From 14:00']}
        value={time}
        onChange={setTime}
      />
      {locationId && (
        <Button
          title={`${
            locations.find(l => l.id === locationId)?.name
          } · Clear filter`}
          secondary
          onPress={() =>
            nav.navigate('Tabs', {
              screen: 'Events',
              params: { locationId: undefined },
            })
          }
        />
      )}
      <Chips
        items={dates.map(dateLabel)}
        value={dateLabel(date)}
        onChange={label => setDate(dates.find(d => dateLabel(d) === label)!)}
      />
      <Text style={[styles.body, { marginBottom: 16 }]}>
        {list.length} experiences · {dateLabel(date)} · 30 places per session
      </Text>
      {!list.length && (
        <Empty
          title="No Events Found"
          body="Try a different category, time or location."
        />
      )}
      {list.map(e => (
        <Pressable
          key={e.id}
          accessibilityRole="button"
          onPress={() => nav.navigate('EventDetail', { id: e.id, date })}
          style={[styles.card, { padding: 0, overflow: 'hidden' }]}
        >
          <WaveImage
            source={images.events[e.id - 1]}
            style={{ width: '100%', height: 210 }}
          />
          <View style={{ padding: 16 }}>
            <Tag text={e.category} />
            <Text style={[styles.h2, { marginTop: 4 }]}>{e.title}</Text>
            <Text numberOfLines={2} style={styles.body}>
              {e.description}
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: colors.border,
                marginVertical: 14,
              }}
            />
            <Text style={styles.body}>
              {e.start}–{e.end} · {e.duration} min
            </Text>
            <Text style={styles.body}>
              {locations.find(l => l.id === e.locationId)?.name}
            </Text>
            <Text style={[styles.link, { marginTop: 12 }]}>
              View experience ›
            </Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}
export function EventDetailScreen() {
  const { id, date } = useRoute<RouteProp<StackParams, 'EventDetail'>>().params;
  const nav = useNavigation<Nav>();
  const event = events.find(e => e.id === id)!;
  return (
    <Screen>
      <Header title="Experience" back={() => nav.goBack()} />
      <Hero
        source={images.events[id - 1]}
        title={event.title}
        label={event.category}
        height={330}
      />
      <Text style={styles.body}>Presented by The Reef Dive Festival</Text>
      <View style={[styles.row, { marginTop: 20 }]}>
        <View style={[styles.card, { flex: 1 }]}>
          <Clock color={colors.cyan} />
          <Text style={[styles.body, { marginTop: 8 }]}>
            {event.start}–{event.end}
          </Text>
        </View>
        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.label}>DURATION</Text>
          <Text style={[styles.body, { marginTop: 8 }]}>
            {event.duration} min
          </Text>
        </View>
      </View>
      <Pressable
        style={[styles.card, styles.row]}
        onPress={() =>
          nav.navigate('Tabs', {
            screen: 'Map',
            params: { locationId: event.locationId },
          })
        }
      >
        <MapPin color={colors.cyan} />
        <Text style={[styles.body, { flex: 1 }]}>
          {locations.find(l => l.id === event.locationId)?.name}
        </Text>
      </Pressable>
      <Section title="About this experience" body={event.description} />
      <Text style={styles.h2}>Event program</Text>
      {event.program.map((p, i) => (
        <View
          key={p.time}
          style={[styles.row, { alignItems: 'flex-start', marginBottom: 20 }]}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.cyan,
              width: 28,
              height: 28,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.cyan }}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.white, fontSize: 14 }}>
              {p.activity}
            </Text>
            <Text style={styles.body}>{p.time}</Text>
          </View>
        </View>
      ))}
      <View style={styles.card}>
        <Text style={[styles.label, { marginBottom: 10 }]}>
          SAFETY CLEARANCE REQUIRED
        </Text>
        <Text style={styles.body}>
          Participation in water activities requires on-site safety screening
          and instructor approval. A booking does not grant diving clearance.
        </Text>
      </View>
      <Button
        title="Book This Event"
        onPress={() => nav.navigate('Booking', { id, date })}
      />
    </Screen>
  );
}
export function BookingScreen() {
  const { singleColumn } = useResponsive();
  const { id, date: requestedDate } =
    useRoute<RouteProp<StackParams, 'Booking'>>().params;
  const nav = useNavigation<Nav>();
  const event = events.find(e => e.id === id)!;
  const { state, update } = useApp();
  const [guests, setGuests] = useState(1);
  const dates = upcomingDates(id);
  const [date, setDate] = useState(
    requestedDate && dates.includes(requestedDate)
      ? requestedDate
      : dates[0] || '',
  );
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const existing = state.bookings.find(
    b => b.eventId === id && b.date === date && b.status === 'confirmed',
  );
  const confirm = async () => {
    if (
      !validDate(date) ||
      date < today() ||
      !eventIdsOnDate(date).includes(id)
    ) {
      Alert.alert(
        'Choose a valid date',
        'Choose one of the available weekend sessions.',
      );
      return;
    }
    if (new Date(`${date}T${event.start}:00`).getTime() <= Date.now()) {
      Alert.alert('Session has started', 'Choose a later date.');
      return;
    }
    if (existing) {
      nav.replace('Ticket', { id: existing.id });
      return;
    }
    const conflict = bookingConflict(state.bookings, event, date, events);
    if (conflict) {
      Alert.alert(
        'Overlapping booking',
        'You already have a reservation at this time. Cancel it in My Bookings or choose another date.',
      );
      return;
    }
    if (remainingPlaces(state.bookings, id, date) < guests) {
      Alert.alert(
        'Not enough places',
        'Choose fewer guests or another session.',
      );
      return;
    }
    setBusy(true);
    const booking = {
      id: `DBF-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      eventId: id,
      date,
      guests,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };
    try {
      await update(s => {
        if (
          bookingConflict(s.bookings, event, date, events) ||
          remainingPlaces(s.bookings, id, date) < guests
        )
          throw Error('Reservation unavailable');
        return { ...s, bookings: [...s.bookings, booking] };
      });
      nav.replace('Ticket', { id: booking.id });
    } catch {
      Alert.alert(
        'Unable to save',
        'Please try again. Your reservation has not been created.',
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen>
      <Header
        title="Book Your Experience"
        subtitle="No account or personal details required"
        back={() => nav.goBack()}
      />
      <View style={[styles.card, styles.row]}>
        <WaveImage
          source={images.events[id - 1]}
          style={{ width: 80, height: 100, borderRadius: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Tag text={event.category} />
          <Text style={{ color: colors.white, fontSize: 17 }}>
            {event.title}
          </Text>
          <Text style={styles.body}>
            {event.start}–{event.end}
          </Text>
        </View>
      </View>
      <Text style={styles.h2}>Your visit date</Text>
      <Chips
        items={dates.map(dateLabel)}
        value={date ? dateLabel(date) : ''}
        onChange={label => setDate(dates.find(d => dateLabel(d) === label)!)}
      />
      <Text style={styles.body}>
        {remainingPlaces(state.bookings, id, date)} of 30 places available on
        this device
      </Text>
      <View
        style={[
          styles.between,
          {
            marginVertical: 25,
            flexDirection: singleColumn ? 'column' : 'row',
            alignItems: singleColumn ? 'stretch' : 'center',
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.white, fontSize: 18 }}>
            Number of guests
          </Text>
          <Text style={styles.body}>1–6 guests per group</Text>
        </View>
        <View
          style={[
            styles.row,
            { justifyContent: singleColumn ? 'space-between' : 'flex-end' },
          ]}
        >
          <IconButton
            label="Remove guest"
            onPress={() => setGuests(Math.max(1, guests - 1))}
          >
            <Minus color="white" />
          </IconButton>
          <Text style={styles.title}>{guests}</Text>
          <IconButton
            label="Add guest"
            onPress={() => setGuests(Math.min(6, guests + 1))}
          >
            <Plus color="white" />
          </IconButton>
        </View>
      </View>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
        onPress={() => setAccepted(!accepted)}
        style={[styles.card, styles.row]}
      >
        <View
          style={{
            width: 26,
            height: 26,
            borderWidth: 1,
            borderColor: colors.cyan,
            borderRadius: 7,
            backgroundColor: accepted ? colors.cyan : 'transparent',
          }}
        >
          {accepted && <Check color={colors.bg} size={24} />}
        </View>
        <Text style={[styles.body, { flex: 1 }]}>
          All guests acknowledge that participation requires on-site safety
          clearance and instructor approval.
        </Text>
      </Pressable>
      <View style={styles.card}>
        <Text style={styles.h2}>Reservation summary</Text>
        {[
          ['Experience', event.title],
          ['Date', date || 'Select a date'],
          ['Time', `${event.start}–${event.end}`],
          ['Guests', String(guests)],
        ].map(([label, value]) => (
          <View
            key={label}
            style={[
              styles.between,
              {
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Text style={styles.body}>{label}</Text>
            <Text style={{ color: 'white', flex: 1, textAlign: 'right' }}>
              {value}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.body}>
        Saved on this device. Availability and admission must be confirmed with
        the festival team.
      </Text>
      <Button
        title={
          existing ? 'View Booking' : busy ? 'Saving…' : 'Confirm Reservation'
        }
        disabled={busy || (!existing && !accepted)}
        onPress={confirm}
      />
    </Screen>
  );
}
export function TicketScreen() {
  const { id } = useRoute<RouteProp<StackParams, 'Ticket'>>().params;
  const { state } = useApp();
  const nav = useNavigation<Nav>();
  const [full, setFull] = useState(false);
  const { width, height } = useWindowDimensions();
  const booking = state.bookings.find(b => b.id === id);
  if (!booking)
    return (
      <Screen>
        <Header title="Ticket unavailable" back={() => nav.goBack()} />
      </Screen>
    );
  const event = events.find(e => e.id === booking.eventId)!;
  const expired =
    new Date(`${booking.date}T${event.end}:00`).getTime() < Date.now();
  const active = booking.status === 'confirmed' && !expired;
  const payload = JSON.stringify({
    version: 1,
    bookingId: booking.id,
    eventId: event.id,
    date: booking.date,
    time: event.start,
    guests: booking.guests,
  });
  return (
    <Screen>
      <Header title="Your Booking" back={() => nav.goBack()} />
      <View style={{ alignItems: 'center', marginVertical: 22 }}>
        <View
          style={{
            backgroundColor: colors.cyan,
            padding: 20,
            borderRadius: 50,
          }}
        >
          <Check color={colors.bg} size={38} />
        </View>
        <Text style={[styles.label, { marginTop: 24 }]}>RESERVATION SAVED</Text>
        <Text style={[styles.title, { marginTop: 20, textAlign: 'center' }]}>
          {active
            ? 'Booking Confirmed!'
            : booking.status === 'cancelled'
            ? 'Booking Cancelled'
            : 'Past Booking'}
        </Text>
        <Text style={[styles.body, { textAlign: 'center', marginTop: 12 }]}>
          Your group reservation is saved on this device.
        </Text>
      </View>
      <View
        style={{
          padding: 25,
          borderRadius: 25,
          backgroundColor: '#eff5f4',
          alignItems: 'center',
          marginVertical: 18,
        }}
      >
        <Text
          style={{
            color: '#356779',
            fontSize: 10,
            fontWeight: '800',
            marginBottom: 25,
          }}
        >
          GROUP ENTRY ·{' '}
          {active ? 'LOCAL RESERVATION' : booking.status.toUpperCase()}
        </Text>
        {active ? (
          <Pressable
            accessibilityLabel="Enlarge QR code"
            onPress={() => setFull(true)}
            style={{ padding: 12, backgroundColor: 'white' }}
          >
            <QRCode
              value={payload}
              size={Math.min(210, width - 120)}
              color="#09202d"
            />
          </Pressable>
        ) : (
          <Ticket color="#356779" size={90} />
        )}
        <Text
          style={{
            fontSize: 20,
            color: '#183646',
            textAlign: 'center',
            marginVertical: 20,
          }}
        >
          {event.title}
        </Text>
        <Text style={{ color: '#183646', textAlign: 'center' }}>
          {booking.date} · {event.start} · {booking.guests} guests
        </Text>
        <Text
          selectable
          style={{
            fontSize: 10,
            letterSpacing: 1,
            color: '#356779',
            marginTop: 25,
          }}
        >
          {booking.id}
        </Text>
      </View>
      <Text style={styles.body}>
        Present this reservation to the festival team for confirmation. This
        offline QR does not verify admission.
      </Text>
      <Button
        title="Share Reservation"
        secondary
        onPress={() => {
          Share.share({
            message: `${event.title}\n${booking.date} ${event.start}\n${booking.guests} guests\nBooking: ${booking.id}\nLocal reservation · admission confirmed by festival staff`,
          }).catch(() => {});
        }}
      />
      <Button title="My Bookings" onPress={() => nav.navigate('Bookings')} />
      <Button
        title="Back to Events"
        secondary
        onPress={() =>
          nav.navigate('Tabs', {
            screen: 'Events',
            params: { locationId: undefined },
          })
        }
      />
      <Modal
        visible={full}
        animationType="fade"
        onRequestClose={() => setFull(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <QRCode
            value={payload}
            size={Math.max(100, Math.min(width - 50, height - 210, 400))}
          />
          <Text style={{ marginTop: 30, color: '#09202d' }}>
            {booking.guests} guests · {booking.date} · {event.start}
          </Text>
          <Text style={{ margin: 20, color: '#09202d' }}>{booking.id}</Text>
          <IconButton
            label="Close full screen ticket"
            onPress={() => setFull(false)}
          >
            <X color="white" />
          </IconButton>
        </View>
      </Modal>
    </Screen>
  );
}
export function BookingsScreen() {
  const nav = useNavigation<Nav>();
  const { state, update } = useApp();
  const [filter, setFilter] = useState('Upcoming');
  const list = state.bookings
    .filter(b => {
      const e = events.find(x => x.id === b.eventId)!;
      const past = new Date(`${b.date}T${e.end}:00`).getTime() < Date.now();
      return filter === 'Cancelled'
        ? b.status === 'cancelled'
        : b.status === 'confirmed' && (filter === 'Past' ? past : !past);
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  return (
    <Screen>
      <Header
        title="My Bookings"
        subtitle="Your group tickets, available offline"
        back={() => nav.goBack()}
      />
      <Chips
        items={['Upcoming', 'Past', 'Cancelled']}
        value={filter}
        onChange={setFilter}
      />
      {!list.length && (
        <Empty
          title="No Bookings"
          body="Choose a festival experience and save your first group reservation."
        />
      )}
      {list.map(b => {
        const e = events.find(x => x.id === b.eventId)!;
        return (
          <View key={b.id} style={styles.card}>
            <Tag text={filter === 'Past' ? 'Expired' : b.status} />
            <Text style={styles.h2}>{e.title}</Text>
            <Text style={styles.body}>
              {b.date} · {e.start}–{e.end} · {b.guests} guests
            </Text>
            <Text style={styles.body}>
              {locations.find(l => l.id === e.locationId)?.name}
            </Text>
            <Button
              title="View Ticket"
              onPress={() => nav.navigate('Ticket', { id: b.id })}
            />
            {filter === 'Upcoming' && (
              <Button
                title="Cancel Booking"
                secondary
                onPress={() =>
                  Alert.alert(
                    'Cancel this booking?',
                    'Your group reservation will be cancelled.',
                    [
                      { text: 'Keep Booking', style: 'cancel' },
                      {
                        text: 'Cancel Booking',
                        style: 'destructive',
                        onPress: () => {
                          update(s => ({
                            ...s,
                            bookings: s.bookings.map(x =>
                              x.id === b.id ? { ...x, status: 'cancelled' } : x,
                            ),
                          })).catch(() => {});
                        },
                      },
                    ],
                  )
                }
              />
            )}
          </View>
        );
      })}
    </Screen>
  );
}
