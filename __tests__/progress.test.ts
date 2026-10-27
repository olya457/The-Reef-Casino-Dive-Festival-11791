import {
  bookingConflict,
  earnedPoints,
  initialProgress,
  isComplete,
  validDate,
} from '../src/utils/progress';
import { challenges } from '../src/data/challenges';
import {
  eventIdsOnDate,
  remainingPlaces,
  upcomingDates,
} from '../src/utils/schedule';
import events from '../src/data/events.json';
import { Booking } from '../src/types';
const booking: Booking = {
  id: 'test',
  eventId: 1,
  date: '2026-10-31',
  guests: 6,
  status: 'confirmed',
  createdAt: '2026-10-27',
};
test('new users have no fabricated points or bookings', () => {
  expect(earnedPoints(initialProgress)).toBe(0);
  expect(initialProgress.bookings).toEqual([]);
});
test('exploration rewards require all distinct destinations', () => {
  const partial = { ...initialProgress, visited: [5, 6] };
  expect(isComplete(challenges[0], partial)).toBe(false);
  const full = { ...partial, visited: [5, 6, 7] };
  expect(earnedPoints(full)).toBe(100);
});
test('detective requires both reading and successful quiz', () => {
  const state = { ...initialProgress, read: [1, 3, 4], passed: [] };
  expect(isComplete(challenges[3], state)).toBe(false);
  expect(isComplete(challenges[3], { ...state, passed: ['detective'] })).toBe(
    true,
  );
});
test('bookings detect overlaps and ignore cancelled reservations', () => {
  expect(bookingConflict([booking], events[1], booking.date, events)?.id).toBe(
    'test',
  );
  expect(
    bookingConflict(
      [{ ...booking, status: 'cancelled' }],
      events[1],
      booking.date,
      events,
    ),
  ).toBeUndefined();
  expect(
    bookingConflict([booking], events[2], booking.date, events),
  ).toBeUndefined();
});
test('capacity counts actual groups and cancellation restores places', () => {
  expect(remainingPlaces([booking], 1, booking.date)).toBe(24);
  expect(
    remainingPlaces([{ ...booking, status: 'cancelled' }], 1, booking.date),
  ).toBe(30);
  expect(remainingPlaces([booking], 2, booking.date)).toBe(30);
});
test('weekend schedule always has two events and weekdays are empty', () => {
  for (let day = 1; day <= 30; day++) {
    const date = `2026-11-${String(day).padStart(2, '0')}`;
    const weekend = [0, 6].includes(new Date(date + 'T12:00:00').getDay());
    expect(eventIdsOnDate(date)).toHaveLength(weekend ? 2 : 0);
  }
  expect(upcomingDates(1).length).toBeGreaterThan(0);
});
test('dates reject invalid and overflowing values', () => {
  expect(validDate('2026-02-30')).toBe(false);
  expect(validDate('2026-11-01')).toBe(true);
  expect(validDate('tomorrow')).toBe(false);
});
