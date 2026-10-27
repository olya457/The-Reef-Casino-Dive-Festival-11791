import events from '../data/events.json';
import { Booking } from '../types';
import { today } from './progress';
export const SESSION_CAPACITY = 30;
export function eventIdsOnDate(value: string) {
  const d = new Date(value + 'T12:00:00');
  const day = d.getDay();
  if (day !== 0 && day !== 6) return [];
  const first = new Date(d.getFullYear(), d.getMonth(), 1, 12);
  const firstSaturday = 1 + ((6 - first.getDay() + 7) % 7);
  const saturdayDay = day === 0 ? d.getDate() - 1 : d.getDate();
  const weekend = Math.max(0, Math.floor((saturdayDay - firstSaturday) / 7));
  const offset = ((weekend * 2 + (day === 0 ? 1 : 0)) % 6) * 2;
  return [offset + 1, offset + 2];
}
export function upcomingDates(eventId?: number) {
  const dates: string[] = [];
  const start = new Date(today() + 'T12:00:00');
  for (let i = 0; i < 120; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(d.getDate()).padStart(2, '0')}`;
    const ids = eventIdsOnDate(value);
    if (
      ids.length &&
      (!eventId || ids.includes(eventId)) &&
      (!eventId ||
        new Date(
          `${value}T${events.find(e => e.id === eventId)!.start}:00`,
        ).getTime() > Date.now())
    )
      dates.push(value);
  }
  return dates;
}
export function remainingPlaces(
  bookings: Booking[],
  eventId: number,
  date: string,
) {
  return Math.max(
    0,
    SESSION_CAPACITY -
      bookings
        .filter(
          b =>
            b.eventId === eventId &&
            b.date === date &&
            b.status === 'confirmed',
        )
        .reduce((sum, b) => sum + b.guests, 0),
  );
}
export function dateLabel(value: string) {
  return new Date(value + 'T12:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
