import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = React.ComponentProps<typeof LinearGradient>;

export default function GradientSurface({
  children,
  style,
  ...gradientProps
}: Props) {
  return (
    <View style={style}>
      <LinearGradient
        {...gradientProps}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}
