import { challenges, Challenge } from '../data/challenges';
import { Progress, Booking } from '../types';
export const initialProgress: Progress = {
  onboarded: false,
  favorites: [],
  saved: [],
  visited: [],
  read: [],
  passed: [],
  answers: {},
  bookings: [],
};
export function isComplete(c: Challenge, s: Progress) {
  return (
    c.locations.every(id => s.visited.includes(id)) &&
    c.articles.every(id => s.read.includes(id)) &&
    (!c.questions.length || s.passed.includes(c.id))
  );
}
export function earnedPoints(s: Progress) {
  return challenges
    .filter(c => isComplete(c, s))
    .reduce((total, c) => total + c.points, 0);
}
export function toggle(items: number[], id: number) {
  return items.includes(id) ? items.filter(x => x !== id) : [...items, id];
}
export function bookingConflict(
  bookings: Booking[],
  event: { id: number; start: string; end: string },
  date: string,
  events: { id: number; start: string; end: string }[],
) {
  return bookings.find(b => {
    const other = events.find(e => e.id === b.eventId);
    return (
      b.status === 'confirmed' &&
      b.date === date &&
      other &&
      event.start < other.end &&
      event.end > other.start
    );
  });
}
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00');
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(d.getDate()).padStart(2, '0')}`;
}
