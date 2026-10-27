import { WaveImage } from '../components/WaveMedia';
import { useResponsive } from '../hooks/useResponsive';
import { MotionPressable as Pressable } from '../components/motion';
import React, { useState } from 'react';
import { Text, View, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Heart, Sparkles } from 'lucide-react-native';
import {
  Screen,
  Header,
  Hero,
  Button,
  RowLink,
  Empty,
  Tag,
  Chips,
  Section,
  styles,
  colors,
  IconButton,
} from '../components/ui';
import { images } from '../data/images';
import secrets from '../data/secrets.json';
import equipment from '../data/equipment.json';
import locations from '../data/locations.json';
import { Nav, StackParams } from '../types';
import { useApp } from '../store/AppStore';
import { toggle } from '../utils/progress';
export function SecretsScreen() {
  const { singleColumn } = useResponsive();
  const nav = useNavigation<Nav>();
  const { state } = useApp();
  return (
    <Screen>
      <Hero
        title="Discover the Secrets of the Ocean"
        source={images.secrets[13]}
        label="THE OCEAN ARCHIVE"
        height={370}
      >
        <Text style={[styles.body, { marginTop: 14 }]}>
          Explore mysterious creatures, incredible phenomena, and discoveries
          from the world's oceans.
        </Text>
        <Button
          title="Discover Random Secret"
          onPress={() =>
            nav.navigate('SecretDetail', {
              id: secrets[Math.floor(Math.random() * secrets.length)].id,
            })
          }
        />
      </Hero>
      <RowLink
        title="Nature’s living lights"
        subtitle="Discover how organisms create light in the deep ocean."
        icon={<Sparkles color={colors.gold} />}
        onPress={() => nav.navigate('SecretDetail', { id: 15 })}
      />
      <Text style={styles.h2}>Explore the collection</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {[
          'Deep Sea Mysteries',
          'Marine Life',
          'Ocean Phenomena',
          'Underwater Discoveries',
        ].map((category, i) => (
          <Pressable
            key={category}
            style={{ width: singleColumn ? '100%' : '47%' }}
            onPress={() => nav.navigate('SecretList', { category })}
          >
            <Hero
              title={category}
              source={images.secrets[[0, 10, 14, 19][i]]}
              label="6 STORIES"
              height={235}
            />
          </Pressable>
        ))}
      </View>
      <Text style={styles.h2}>Your ocean archive</Text>
      <RowLink
        title="Saved Secrets"
        subtitle={
          state.saved.length
            ? `${state.saved.length} saved discoveries`
            : 'Your collection is ready to begin'
        }
        icon={<Heart color={colors.cyan} />}
        onPress={() => nav.navigate('SecretList', { saved: true })}
      />
    </Screen>
  );
}
export function SecretListScreen() {
  const { singleColumn, compact } = useResponsive();
  const nav = useNavigation<Nav>();
  const params = useRoute<RouteProp<StackParams, 'SecretList'>>().params;
  const { state } = useApp();
  const list = secrets.filter(s =>
    params.saved ? state.saved.includes(s.id) : s.category === params.category,
  );
  return (
    <Screen>
      <Header
        title={
          params.saved ? 'Saved Secrets' : params.category || 'Ocean Secrets'
        }
        subtitle={`${list.length} ocean discoveries`}
        back={() => nav.goBack()}
      />
      {!list.length && (
        <Empty
          title="No Saved Secrets"
          body="Tap the heart on a discovery to add it to your ocean archive."
        />
      )}
      {list.map(s => (
        <Pressable
          key={s.id}
          onPress={() => nav.navigate('SecretDetail', { id: s.id })}
          style={[
            styles.card,
            styles.row,
            {
              padding: 10,
              alignItems: 'flex-start',
              flexDirection: singleColumn ? 'column' : 'row',
            },
          ]}
        >
          <WaveImage
            source={images.secrets[s.id - 1]}
            style={{
              width: singleColumn ? '100%' : compact ? 68 : 90,
              height: singleColumn ? 160 : compact ? 100 : 125,
              borderRadius: 12,
            }}
          />
          <View style={{ flex: 1 }}>
            <Tag text={s.category} />
            <Text
              style={{ fontSize: 17, color: colors.white, marginBottom: 8 }}
            >
              {s.title}
            </Text>
            <Text
              style={[styles.body, { fontSize: 11, lineHeight: 17 }]}
              numberOfLines={3}
            >
              {s.description}
            </Text>
            <Text style={styles.link}>Read discovery ›</Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}
export function SecretDetailScreen() {
  const { id } = useRoute<RouteProp<StackParams, 'SecretDetail'>>().params;
  const nav = useNavigation<Nav>();
  const { state, update } = useApp();
  const secret = secrets.find(s => s.id === id)!;
  const save = () => {
    update(s => ({ ...s, saved: toggle(s.saved, id) })).catch(() => {});
  };
  return (
    <Screen>
      <Header
        title="Ocean discovery"
        back={() => nav.goBack()}
        action={
          <IconButton label="Save secret" onPress={save}>
            <Heart
              color={colors.cyan}
              fill={state.saved.includes(id) ? colors.cyan : 'transparent'}
            />
          </IconButton>
        }
      />
      <Hero
        title={secret.title}
        source={images.secrets[id - 1]}
        label={secret.category}
        height={360}
      />
      <Text style={styles.body}>5 minute discovery</Text>
      <Section title="Dive deeper" body={secret.description} />
      <Text style={[styles.body, { marginTop: 20 }]}>{secret.content}</Text>
      <Text style={styles.h2}>Remarkable facts</Text>
      {secret.facts.map((fact, i) => (
        <View
          key={fact}
          style={[
            styles.row,
            {
              alignItems: 'flex-start',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={{ color: colors.gold, fontSize: 11, marginTop: 4 }}>
            0{i + 1}
          </Text>
          <Text style={[styles.body, { flex: 1 }]}>
            {fact.replace(/\.\.$/, '.')}
          </Text>
        </View>
      ))}
      <Button
        title={state.read.includes(id) ? '✓ Discovery read' : 'Mark as Read'}
        secondary
        onPress={() => {
          update(s =>
            s.read.includes(id) ? s : { ...s, read: [...s.read, id] },
          ).catch(() => {});
        }}
      />
      <Button
        title={state.saved.includes(id) ? '♥ Saved' : 'Save Secret'}
        onPress={save}
      />
      <Button
        title="Share"
        secondary
        onPress={() => {
          Share.share({
            message: `${secret.title}\n\n${secret.description}\n\n${secret.content}\n\nDeep Blue · The Reef Casino`,
          }).catch(() => {});
        }}
      />
      <Button
        title="Discover Another Secret"
        secondary
        onPress={() =>
          nav.replace('SecretDetail', {
            id: secrets.filter(s => s.id !== id)[
              Math.floor(Math.random() * (secrets.length - 1))
            ].id,
          })
        }
      />
    </Screen>
  );
}
export function EquipmentScreen() {
  const { singleColumn } = useResponsive();
  const nav = useNavigation<Nav>();
  const [category, setCategory] = useState('All Gear');
  const list = equipment.filter(
    e => category === 'All Gear' || e.category === category,
  );
  return (
    <Screen>
      <Header
        title="Equipment Guide"
        subtitle="Technology beneath the surface"
      />
      <Hero
        title="Explore Diving Equipment"
        source={images.events[0]}
        label="INTERACTIVE GUIDE"
        height={240}
      >
        <Text style={[styles.body, { fontSize: 12, marginTop: 10 }]}>
          Discover the essential tools and technologies used by divers around
          the world.
        </Text>
      </Hero>
      <Chips
        items={['All Gear', ...new Set(equipment.map(e => e.category))]}
        value={category}
        onChange={setCategory}
      />
      <Text style={[styles.body, { marginVertical: 12 }]}>
        {list.length} equipment profiles
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {list.map(e => (
          <Pressable
            key={e.id}
            style={[
              styles.card,
              {
                width: singleColumn ? '100%' : '48%',
                padding: 0,
                overflow: 'hidden',
              },
            ]}
            onPress={() => nav.navigate('EquipmentDetail', { id: e.id })}
          >
            <WaveImage
              source={images.gear[e.id - 1]}
              resizeMode="contain"
              style={{ width: '100%', height: 140, backgroundColor: '#e6eeee' }}
            />
            <View style={{ padding: 12 }}>
              <Tag text={e.category} />
              <Text
                style={{ fontSize: 16, color: colors.white, marginBottom: 9 }}
              >
                {e.title}
              </Text>
              <Text
                style={[styles.body, { fontSize: 11, lineHeight: 17 }]}
                numberOfLines={3}
              >
                {e.overview}
              </Text>
              <Text style={[styles.link, { fontSize: 10, marginTop: 16 }]}>
                Explore equipment ›
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.body, { fontSize: 12 }]}>
        Equipment explanations are educational and do not replace professional
        diving instruction.
      </Text>
    </Screen>
  );
}
export function EquipmentDetailScreen() {
  const { id } = useRoute<RouteProp<StackParams, 'EquipmentDetail'>>().params;
  const nav = useNavigation<Nav>();
  const item = equipment.find(e => e.id === id)!;
  const location = locations.find(l => l.id === item.locationId)!;
  return (
    <Screen>
      <Header title="Equipment Guide" back={() => nav.goBack()} />
      <WaveImage
        source={images.gear[id - 1]}
        resizeMode="contain"
        style={{
          height: 270,
          width: '100%',
          borderRadius: 20,
          backgroundColor: '#e7eeee',
          marginBottom: 24,
        }}
      />
      <Tag text={item.category} />
      <Text style={[styles.label, { marginVertical: 20 }]}>
        EQUIPMENT GUIDE
      </Text>
      <Text style={styles.title}>{item.title}</Text>
      <Section title="Overview" body={item.overview} />
      <Text style={styles.h2}>Key Features</Text>
      {item.features.map(f => (
        <Text key={f} style={[styles.body, { marginBottom: 10 }]}>
          • {f}
        </Text>
      ))}
      <Section title="How It Works" body={item.how} />
      <Section title="Safety Notes" body={item.safety} />
      <View style={[styles.card, { marginTop: 24 }]}>
        <Text style={styles.label}>WHERE TO EXPLORE</Text>
        <Text style={styles.h2}>{location.name}</Text>
        <Text style={styles.body}>
          Zone {location.zone} · {location.category}
        </Text>
      </View>
      <Button
        title="Find at Festival"
        onPress={() =>
          nav.navigate('Tabs', {
            screen: 'Map',
            params: { locationId: item.locationId },
          })
        }
      />
    </Screen>
  );
}
