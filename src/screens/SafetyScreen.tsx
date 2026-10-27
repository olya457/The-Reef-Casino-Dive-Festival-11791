import React, { useState } from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  TriangleAlert,
} from 'lucide-react-native';
import {
  Screen,
  Header,
  Hero,
  Chips,
  Tag,
  Button,
  RowLink,
  colors,
  styles,
} from '../components/ui';
import { MotionPressable } from '../components/motion';
import { safetyRules, safetySources } from '../data/safety';
import { Nav } from '../types';
const safetyImage = require('../assets/diving-safety-buddies.png');
export function SafetyScreen() {
  const navigation = useNavigation<Nav>();
  const [category, setCategory] = useState('All Rules');
  const [expanded, setExpanded] = useState<string[]>(['training', 'breathing']);
  const list = safetyRules.filter(
    rule => category === 'All Rules' || rule.category === category,
  );
  const openSource = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert(
        'Unable to open source',
        'Check your connection and try again. The safety guide remains available offline.',
      ),
    );
  };
  return (
    <Screen>
      <Header
        title="Diving Safety"
        subtitle="Prepare with care. Explore with confidence."
        action={<ShieldCheck size={28} color={colors.cyan} />}
      />
      <Hero
        source={safetyImage}
        title="A safer dive starts here"
        label="DIVE SMART · STAY TOGETHER"
        height={300}
      >
        <Text style={[styles.body, { marginTop: 12 }]}>
          Simple reminders for every stage of your scuba experience.
        </Text>
      </Hero>
      <View
        style={[
          styles.card,
          { borderColor: '#76603a', backgroundColor: '#252b27' },
        ]}
      >
        <Text style={[styles.label, { marginBottom: 10 }]}>
          YOUR INSTRUCTOR COMES FIRST
        </Text>
        <Text style={styles.body}>
          This guide supports your briefing; it does not replace certified
          training or medical clearance. Festival water activities require
          on-site instructor approval.
        </Text>
      </View>
      <Chips
        items={['All Rules', 'Before Diving', 'Underwater', 'After Diving']}
        value={category}
        onChange={setCategory}
      />
      <Text style={[styles.body, { fontSize: 12, marginBottom: 16 }]}>
        {list.length} reminders · Tap a rule to read more
      </Text>
      {list.map(rule => {
        const open = expanded.includes(rule.id);
        const source = safetySources.find(item => item.id === rule.source)!;
        return (
          <View key={rule.id} style={styles.card}>
            <MotionPressable
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              onPress={() =>
                setExpanded(current =>
                  current.includes(rule.id)
                    ? current.filter(id => id !== rule.id)
                    : [...current, rule.id],
                )
              }
              style={[styles.row, { minHeight: 48 }]}
            >
              <View style={{ flex: 1 }}>
                <Tag text={rule.category} />
                <Text
                  style={{ color: colors.white, fontSize: 18, lineHeight: 25 }}
                >
                  {rule.title}
                </Text>
              </View>
              {open ? (
                <ChevronUp color={colors.cyan} />
              ) : (
                <ChevronDown color={colors.muted} />
              )}
            </MotionPressable>
            {open && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.body}>{rule.body}</Text>
                <MotionPressable
                  accessibilityRole="link"
                  onPress={() => openSource(source.url)}
                  style={[styles.row, { minHeight: 44, marginTop: 8 }]}
                >
                  <ExternalLink size={14} color={colors.cyan} />
                  <Text style={[styles.link, { flex: 1, fontSize: 11 }]}>
                    {source.title}
                  </Text>
                </MotionPressable>
              </View>
            )}
          </View>
        );
      })}
      <View style={[styles.card, { borderColor: '#76534b', marginTop: 14 }]}>
        <View style={styles.row}>
          <TriangleAlert color={colors.gold} />
          <Text style={[styles.h2, { flex: 1, marginTop: 0, marginBottom: 0 }]}>
            If something goes wrong
          </Text>
        </View>
        <Text style={[styles.body, { marginTop: 16 }]}>
          Underwater: signal your buddy or instructor and follow the emergency
          procedures from your training. On the surface: alert festival staff
          and activate local emergency medical services for a suspected diving
          injury.
        </Text>
        <Text style={[styles.body, { marginTop: 12 }]}>
          Breathing difficulty, weakness, numbness, dizziness or unusual pain
          after diving need urgent medical assessment. Trained responders should
          provide emergency oxygen when available. Do not return underwater to
          treat symptoms.
        </Text>
        <Button
          title="Find Medical & Safety Station"
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'Map',
              params: { locationId: 20 },
            })
          }
        />
        <Text style={[styles.body, { fontSize: 11 }]}>
          The map shows the festival station; it does not contact emergency
          services.
        </Text>
      </View>
      <RowLink
        title="Safety Training Center"
        subtitle="Find the festival briefing and training area"
        icon={<MapPin color={colors.cyan} />}
        onPress={() =>
          navigation.navigate('Tabs', {
            screen: 'Map',
            params: { locationId: 10 },
          })
        }
      />
      <Text style={styles.h2}>Trusted learning resources</Text>
      <Text style={[styles.body, { fontSize: 12, marginBottom: 14 }]}>
        Based on DAN and PADI guidance, reviewed October 2026. External sources
        require an internet connection.
      </Text>
      {safetySources.map(source => (
        <RowLink
          key={source.id}
          title={source.title}
          icon={<ExternalLink color={colors.cyan} size={18} />}
          onPress={() => openSource(source.url)}
        />
      ))}
    </Screen>
  );
}
