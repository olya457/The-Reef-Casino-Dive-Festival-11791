import { useResponsive } from '../hooks/useResponsive';
import { MotionPressable as Pressable } from '../components/motion';
import React, { useState } from 'react';
import { Text, View, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Award, BookOpen, Compass, Check, Lock } from 'lucide-react-native';
import {
  Screen,
  Header,
  Button,
  Tag,
  RowLink,
  ProgressBar,
  styles,
  colors,
} from '../components/ui';
import { challenges } from '../data/challenges';
import locations from '../data/locations.json';
import secrets from '../data/secrets.json';
import { useApp } from '../store/AppStore';
import { earnedPoints, isComplete } from '../utils/progress';
import { Nav, StackParams, Progress } from '../types';
function badges(state: Progress) {
  const complete = challenges.filter(c => isComplete(c, state));
  return [
    { name: 'Ocean Rookie', unlocked: complete.length > 0 },
    ...challenges.map(c => ({ name: c.badge, unlocked: isComplete(c, state) })),
    {
      name: 'Deep Blue Champion',
      unlocked: complete.length === challenges.length,
    },
  ];
}
export function ChallengesScreen() {
  const { singleColumn } = useResponsive();
  const nav = useNavigation<Nav>();
  const { state } = useApp();
  const completed = challenges.filter(c => isComplete(c, state));
  const points = earnedPoints(state);
  const inProgress = challenges.filter(
    c =>
      !isComplete(c, state) &&
      (c.locations.some(id => state.visited.includes(id)) ||
        c.articles.some(id => state.read.includes(id)) ||
        (state.answers[c.id]?.length || 0) > 0),
  ).length;
  return (
    <Screen>
      <Header
        title="Dive Challenges"
        subtitle="Explore, learn & earn rewards"
      />
      <View style={[styles.card, { borderColor: '#5d6552', padding: 22 }]}>
        <Text style={styles.label}>YOUR FESTIVAL JOURNEY</Text>
        <View style={[styles.between, { marginTop: 25 }]}>
          <Text style={{ color: colors.gold, fontSize: 42, fontWeight: '700' }}>
            {points}
          </Text>
          <Text style={{ color: 'white' }}>
            {completed.length}/{challenges.length}
          </Text>
        </View>
        <Text style={[styles.body, { fontSize: 10, letterSpacing: 1 }]}>
          POINTS EARNED
        </Text>
        <ProgressBar value={points / 650} />
        <Text style={[styles.body, { fontSize: 11 }]}>
          {650 - points} points until Deep Blue Champion
        </Text>
      </View>
      <View
        style={[
          styles.row,
          {
            flexDirection: singleColumn ? 'column' : 'row',
            alignItems: 'stretch',
          },
        ]}
      >
        {[
          [completed.length, 'Completed'],
          [inProgress, 'In progress'],
          [badges(state).filter(b => b.unlocked).length, 'Badges'],
        ].map(([n, label]) => (
          <View
            key={label}
            style={[
              styles.card,
              { flex: 1, padding: 12, alignItems: 'center' },
            ]}
          >
            <Award color={colors.cyan} size={22} />
            <Text style={[styles.h2, { marginTop: 10, marginBottom: 5 }]}>
              {n}
            </Text>
            <Text style={{ fontSize: 10, color: colors.muted }}>{label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.h2}>Featured challenges</Text>
      {challenges.map(c => (
        <Pressable
          key={c.id}
          style={[styles.card, styles.row]}
          onPress={() => nav.navigate('Challenge', { id: c.id })}
        >
          {isComplete(c, state) ? (
            <Check color={colors.cyan} />
          ) : (
            <Compass color={colors.cyan} />
          )}
          <View style={{ flex: 1 }}>
            <Tag text={c.category} />
            <Text style={{ fontSize: 17, color: 'white' }}>{c.title}</Text>
            <Text style={[styles.body, { fontSize: 12, marginVertical: 8 }]}>
              {c.description}
            </Text>
            <Text style={{ fontSize: 11, color: colors.gold }}>
              {isComplete(c, state) ? 'Completed · ' : ''}
              {c.points} points · {c.duration}
            </Text>
          </View>
        </Pressable>
      ))}
      <RowLink
        title="Achievements"
        subtitle={`${
          badges(state).filter(b => b.unlocked).length
        } badges earned`}
        icon={<Award color={colors.gold} />}
        onPress={() => nav.navigate('Achievements')}
      />
      {completed.length === 0 && (
        <Text style={styles.body}>
          No challenges completed yet. Start exploring to earn your first badge.
        </Text>
      )}
    </Screen>
  );
}
export function ChallengeScreen() {
  const { id } = useRoute<RouteProp<StackParams, 'Challenge'>>().params;
  const nav = useNavigation<Nav>();
  const { state, update } = useApp();
  const c = challenges.find(x => x.id === id)!;
  const [quiz, setQuiz] = useState(false);
  const [index, setIndex] = useState(
    Math.min(
      state.answers[id]?.length || 0,
      Math.max(0, c.questions.length - 1),
    ),
  );
  const [selection, setSelection] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const done = isComplete(c, state);
  const requirements =
    c.locations.every(l => state.visited.includes(l)) &&
    c.articles.every(a => state.read.includes(a));
  const question = c.questions[index];
  const check = async () => {
    if (selection === null) return;
    if (selection !== question.correct) {
      setFeedback('Not quite. Review the options and try again.');
      return;
    }
    setBusy(true);
    try {
      await update(s => ({
        ...s,
        answers: {
          ...s.answers,
          [id]: [...(s.answers[id] || []).slice(0, index), selection],
        },
        passed:
          index === c.questions.length - 1
            ? [...new Set([...s.passed, id])]
            : s.passed,
      }));
      setSelection(null);
      setFeedback(null);
      if (index < c.questions.length - 1) setIndex(index + 1);
      else setQuiz(false);
    } finally {
      setBusy(false);
    }
  };
  if (quiz && question)
    return (
      <Screen animationKey={`${id}-${index}`}>
        <Header
          title={c.title}
          subtitle={`Question ${index + 1} of ${c.questions.length}`}
          back={() => setQuiz(false)}
        />
        <ProgressBar value={(index + 1) / c.questions.length} />
        <View style={{ marginTop: 35, marginBottom: 25 }}>
          <BookOpen color={colors.cyan} size={35} />
        </View>
        <Text
          style={[
            styles.title,
            { fontSize: 25, lineHeight: 34, marginBottom: 25 },
          ]}
        >
          {question.title}
        </Text>
        {question.options.map((option, i) => (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected: selection === i }}
            onPress={() => {
              setSelection(i);
              setFeedback(null);
            }}
            style={[
              styles.card,
              styles.row,
              { borderColor: selection === i ? colors.cyan : colors.border },
            ]}
          >
            <Text style={{ color: colors.muted, fontWeight: '800' }}>
              {'ABCD'[i]}
            </Text>
            <Text style={{ color: colors.white, flex: 1, lineHeight: 22 }}>
              {option}
            </Text>
          </Pressable>
        ))}
        {feedback && (
          <Text
            accessibilityLiveRegion="polite"
            style={{ color: colors.gold, marginVertical: 15 }}
          >
            {feedback}
          </Text>
        )}
        <Button
          title={
            index === c.questions.length - 1
              ? 'Complete Challenge'
              : 'Check Answer'
          }
          disabled={selection === null || busy}
          onPress={() => {
            check().catch(() =>
              setFeedback('Could not save your answer. Try again.'),
            );
          }}
        />
      </Screen>
    );
  return (
    <Screen>
      <Header
        title={c.title}
        subtitle={`${c.difficulty} · ${c.duration} · +${c.points} points`}
        back={() => nav.goBack()}
      />
      <View style={styles.card}>
        <Tag text={done ? 'Completed' : c.category} />
        <Text style={styles.body}>{c.description}</Text>
      </View>
      {c.locations.map(locationId => {
        const l = locations.find(x => x.id === locationId)!;
        return (
          <RowLink
            key={locationId}
            title={l.name}
            subtitle={
              state.visited.includes(locationId)
                ? 'Discovered'
                : 'Open in Dive Map'
            }
            icon={
              state.visited.includes(locationId) ? (
                <Check color={colors.cyan} />
              ) : (
                <Compass color={colors.muted} />
              )
            }
            onPress={() =>
              nav.navigate('Tabs', { screen: 'Map', params: { locationId } })
            }
          />
        );
      })}
      {c.articles.map(articleId => {
        const article = secrets.find(s => s.id === articleId)!;
        return (
          <RowLink
            key={articleId}
            title={article.title}
            subtitle={
              state.read.includes(articleId)
                ? 'Read'
                : 'Read this discovery and mark it as read'
            }
            icon={
              <BookOpen
                color={
                  state.read.includes(articleId) ? colors.cyan : colors.muted
                }
              />
            }
            onPress={() => nav.navigate('SecretDetail', { id: articleId })}
          />
        );
      })}
      {c.questions.length > 0 && !state.passed.includes(id) && (
        <Button
          title={
            requirements
              ? 'Start / Continue Quiz'
              : 'Complete the exploration tasks first'
          }
          disabled={!requirements}
          onPress={() => {
            setIndex(
              Math.min(state.answers[id]?.length || 0, c.questions.length - 1),
            );
            setQuiz(true);
          }}
        />
      )}
      {done && (
        <View
          style={[styles.card, { alignItems: 'center', paddingVertical: 30 }]}
        >
          <Award color={colors.gold} size={65} />
          <Text style={[styles.h2, { textAlign: 'center' }]}>
            {c.title} Completed!
          </Text>
          <Text style={styles.body}>
            {c.points} points earned · {c.badge}
          </Text>
          <Button
            title="Share Achievement"
            onPress={() => {
              Share.share({
                message: `I completed ${c.title} and earned the ${c.badge} badge at The Reef Dive Festival!`,
              }).catch(() => {});
            }}
          />
        </View>
      )}
      <Button
        title="Back to Challenges"
        secondary
        onPress={() => nav.goBack()}
      />
    </Screen>
  );
}
export function AchievementsScreen() {
  const nav = useNavigation<Nav>();
  const { state } = useApp();
  return (
    <Screen>
      <Header
        title="Achievements"
        subtitle="Every discovery is a step forward"
        back={() => nav.goBack()}
      />
      {badges(state).map(b => (
        <View
          key={b.name}
          style={[styles.card, styles.row, { opacity: b.unlocked ? 1 : 0.55 }]}
        >
          {b.unlocked ? (
            <Award color={colors.gold} size={35} />
          ) : (
            <Lock color={colors.muted} size={30} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.white, fontSize: 18 }}>{b.name}</Text>
            <Text style={styles.body}>
              {b.unlocked ? 'Earned' : 'Keep exploring to unlock'}
            </Text>
          </View>
        </View>
      ))}
    </Screen>
  );
}
