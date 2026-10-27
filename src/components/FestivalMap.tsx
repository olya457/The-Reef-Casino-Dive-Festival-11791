import { useResponsive } from '../hooks/useResponsive';
import React, { useRef, useState } from 'react';
import { View, PanResponder, Text } from 'react-native';
import Svg, { Rect, Path, G, Text as SvgText, Circle } from 'react-native-svg';
import { Minus, Plus, LocateFixed } from 'lucide-react-native';
import locations from '../data/locations.json';
import { colors, IconButton } from './ui';
export const zoneColors = [
  '#36d2eb',
  '#8380ff',
  '#efbd60',
  '#53d6ac',
  '#afc7d5',
];
export function FestivalMap({
  visible,
  selected,
  onSelect,
  route,
}: {
  visible: number[];
  selected: number | null;
  onSelect: (id: number) => void;
  route: boolean;
}) {
  const { height, contentWidth } = useResponsive();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const start = useRef({ x: 0, y: 0 });
  const current = useRef(offset);
  current.current = offset;
  const pinch = useRef(0);
  const scale = useRef(1);
  scale.current = zoom;
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) + Math.abs(g.dy) > 7,
      onPanResponderGrant: e => {
        start.current = current.current;
        const t = e.nativeEvent.touches;
        pinch.current =
          t.length === 2
            ? Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY)
            : 0;
      },
      onPanResponderMove: (e, g) => {
        const t = e.nativeEvent.touches;
        if (t.length === 2) {
          const distance = Math.hypot(
            t[0].pageX - t[1].pageX,
            t[0].pageY - t[1].pageY,
          );
          if (pinch.current)
            setZoom(z =>
              Math.max(1, Math.min(2.8, (z * distance) / pinch.current)),
            );
          pinch.current = distance;
        } else {
          const bound = 150 * (scale.current - 1);
          setOffset({
            x: Math.max(-bound, Math.min(bound, start.current.x + g.dx)),
            y: Math.max(-bound, Math.min(bound, start.current.y + g.dy)),
          });
        }
      },
    }),
  ).current;
  const destination = locations.find(l => l.id === selected);
  return (
    <View
      style={{
        height: Math.min(
          470,
          Math.max(320, Math.min(height * 0.65, contentWidth * 1.5)),
        ),
        borderRadius: 24,
        backgroundColor: '#0f2e35',
        borderWidth: 1,
        borderColor: '#29505a',
        overflow: 'hidden',
        marginBottom: 12,
      }}
    >
      <View {...responder.panHandlers} style={{ flex: 1 }}>
        <Svg width="100%" height="100%" viewBox="0 0 340 520">
          <G
            transform={`translate(${170 + offset.x},${
              260 + offset.y
            }) scale(${zoom}) translate(-170,-260)`}
          >
            <Path d="M0 60L170 0L340 110V410L170 520L0 400Z" fill="#102a34" />
            <Rect
              x="25"
              y="52"
              width="95"
              height="150"
              rx="35"
              fill="#0b9bb7"
            />
            <Rect
              x="235"
              y="125"
              width="80"
              height="115"
              rx="28"
              fill="#0b9bb7"
            />
            {[
              [145, 40, 65, 100],
              [125, 190, 82, 75],
              [35, 280, 105, 90],
              [225, 320, 90, 75],
              [115, 430, 140, 65],
            ].map(([x, y, w, h], i) => (
              <G key={i}>
                <Rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="7"
                  stroke="#2a5667"
                  strokeWidth="4"
                  fill="#193b4b"
                />
                <SvgText
                  x={x + w / 2}
                  y={y + h / 2 + 7}
                  textAnchor="middle"
                  fill="#7899a8"
                  fontSize="21"
                  fontWeight="bold"
                >
                  {'ABCDE'[i]}
                </SvgText>
              </G>
            ))}
            <Path
              d="M40 260L315 250M185 410L225 110M65 440L90 410L185 410"
              stroke="#44696c"
              strokeWidth="10"
              fill="none"
            />
            <Path
              d="M40 260L315 250M185 410L225 110M65 440L90 410L185 410"
              stroke="#6c8b87"
              strokeDasharray="2 3"
              strokeWidth="1"
              fill="none"
            />
            {route && destination && (
              <Path
                d={`M65 440 L90 410 L185 410 L211 255 L${destination.x} 255 L${destination.x} ${destination.y}`}
                fill="none"
                stroke={colors.gold}
                strokeWidth="4"
                strokeDasharray="7 5"
              />
            )}
            <SvgText
              x="50"
              y="25"
              fill="#9eb9bd"
              fontSize="7"
              fontWeight="bold"
              letterSpacing="2"
            >
              ≈ FESTIVAL MAP
            </SvgText>
            {locations
              .filter(l => visible.includes(l.id))
              .map(l => (
                <G
                  key={l.id}
                  onPress={() => onSelect(l.id)}
                  accessibilityLabel={l.name}
                  accessibilityRole="button"
                >
                  <Circle cx={l.x} cy={l.y} r="23" fill="transparent" />
                  {selected === l.id && (
                    <Circle cx={l.x} cy={l.y - 3} r="23" fill="#ffffff30" />
                  )}
                  <Path
                    d={`M ${l.x} ${l.y + 18} C ${l.x - 30} ${l.y - 8}, ${
                      l.x - 4
                    } ${l.y - 29}, ${l.x + 10} ${l.y - 15} C ${l.x + 23} ${
                      l.y - 3
                    }, ${l.x + 8} ${l.y + 9}, ${l.x} ${l.y + 18}`}
                    fill={zoneColors[Math.floor((l.id - 1) / 4)]}
                    stroke="#03202c"
                    strokeWidth="2"
                  />
                  <SvgText
                    x={l.x}
                    y={l.y + 1}
                    textAnchor="middle"
                    fill="#03202c"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {l.id}
                  </SvgText>
                </G>
              ))}
          </G>
        </Svg>
      </View>
      <View style={{ position: 'absolute', right: 10, bottom: 10, gap: 6 }}>
        <IconButton
          label="Zoom in"
          onPress={() => setZoom(Math.min(2.8, zoom + 0.3))}
        >
          <Plus color="white" />
        </IconButton>
        <IconButton
          label="Zoom out"
          onPress={() => setZoom(Math.max(1, zoom - 0.3))}
        >
          <Minus color="white" />
        </IconButton>
        <IconButton
          label="Reset map"
          onPress={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}
        >
          <LocateFixed color="white" />
        </IconButton>
      </View>
      <Text
        style={{
          position: 'absolute',
          left: 12,
          bottom: 10,
          color: colors.muted,
          fontSize: 9,
        }}
      >
        Drag to explore · Pinch to zoom
      </Text>
    </View>
  );
}
