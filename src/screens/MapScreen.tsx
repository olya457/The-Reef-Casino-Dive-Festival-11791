import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Heart, MapPin } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  Screen,
  Header,
  SearchField,
  Chips,
  styles,
  colors,
  IconButton,
  Button,
  Tag,
  Empty,
  RowLink,
} from '../components/ui';
import { FestivalMap, zoneColors } from '../components/FestivalMap';
import locations from '../data/locations.json';
import { useApp } from '../store/AppStore';
import { toggle } from '../utils/progress';
import { Nav, TabParams } from '../types';
export function MapScreen() {
  const nav = useNavigation<Nav>();
  const params = useRoute<RouteProp<TabParams, 'Map'>>().params;
  const { state, update } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All locations');
  const [favorites, setFavorites] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [route, setRoute] = useState(false);
  const select = (id: number) => {
    setSelected(id);
    setRoute(false);
    update(s =>
      s.visited.includes(id) ? s : { ...s, visited: [...s.visited, id] },
    ).catch(() => {});
  };
  useEffect(() => {
    if (params?.locationId) {
      setSelected(params.locationId);
      setCategory('All locations');
      setSearch('');
      setFavorites(false);
      setRoute(false);
      update(s =>
        s.visited.includes(params.locationId!)
          ? s
          : { ...s, visited: [...s.visited, params.locationId!] },
      ).catch(() => {});
    }
  }, [params?.locationId, update]);
  const list = locations.filter(
    l =>
      (category === 'All locations' || l.category === category) &&
      l.name.toLowerCase().includes(search.toLowerCase()) &&
      (!favorites || state.favorites.includes(l.id)),
  );
  const location = locations.find(l => l.id === selected);
  return (
    <Screen>
      <Header
        title="Dive Map"
        subtitle="Explore the festival complex"
        action={
          <IconButton
            label="Favorite locations"
            active={favorites}
            onPress={() => setFavorites(!favorites)}
          >
            <Heart
              color={favorites ? colors.cyan : 'white'}
              fill={favorites ? colors.cyan : 'transparent'}
            />
          </IconButton>
        }
      />
      <SearchField
        value={search}
        onChange={setSearch}
        placeholder="Search locations"
      />
      <Chips
        items={['All locations', ...new Set(locations.map(l => l.category))]}
        value={category}
        onChange={setCategory}
      />
      <FestivalMap
        visible={list.map(l => l.id)}
        selected={selected}
        route={route}
        onSelect={select}
      />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 9,
          marginBottom: 16,
        }}
      >
        {['Diving', 'Exhibitions', 'Training', 'Relaxation', 'Services'].map(
          (t, i) => (
            <Text key={t} style={{ fontSize: 9, color: zoneColors[i] }}>
              ● {t}
            </Text>
          ),
        )}
      </View>
      {location ? (
        <View style={styles.card}>
          <View style={styles.between}>
            <Tag text={location.category} />
            <IconButton
              label="Save location"
              active={state.favorites.includes(location.id)}
              onPress={() => {
                update(s => ({
                  ...s,
                  favorites: toggle(s.favorites, location.id),
                })).catch(() => {});
              }}
            >
              <Heart
                color={colors.cyan}
                fill={
                  state.favorites.includes(location.id)
                    ? colors.cyan
                    : 'transparent'
                }
              />
            </IconButton>
          </View>
          <Text style={styles.h2}>{location.name}</Text>
          <Text style={styles.body}>Zone {location.zone}</Text>
          <Text style={[styles.body, { marginVertical: 12 }]}>
            {location.description}
          </Text>
          {route && (
            <Text style={{ color: colors.gold, marginBottom: 10 }}>
              Walking route from Main Entrance · follow the gold path
            </Text>
          )}
          <Button
            title={route ? 'Hide Route' : 'Show Route'}
            onPress={() => setRoute(!route)}
          />
          <Button
            title="View Events"
            secondary
            onPress={() =>
              nav.navigate('Tabs', {
                screen: 'Events',
                params: { locationId: location.id },
              })
            }
          />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.body}>
            {list.length} locations across 5 zones · Tap any marker to explore
          </Text>
        </View>
      )}
      {!list.length && (
        <Empty
          title="No locations found"
          body="Try another search or show all locations."
        />
      )}
      {(search || favorites || category !== 'All locations') &&
        list.map(l => (
          <RowLink
            key={l.id}
            title={l.name}
            subtitle={l.category}
            icon={<MapPin color={colors.cyan} />}
            onPress={() => select(l.id)}
          />
        ))}
      <Button
        title="Show All Locations"
        secondary
        onPress={() => {
          setCategory('All locations');
          setSearch('');
          setFavorites(false);
          setSelected(null);
          setRoute(false);
        }}
      />
      <Text style={[styles.body, { fontSize: 11, textAlign: 'center' }]}>
        Organized by The Reef Casino
      </Text>
    </Screen>
  );
}
