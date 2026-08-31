import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, useScaledFont } from '../hooks';

interface Props {
  percentage: number;
  completed: number;
  total: number;
  showLabel?: boolean;
  height?: number;
}

export const ProgressBar = memo(({ percentage, completed, total, showLabel = true, height = 8 }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: colors.progressTrack, height }]}>
        <View style={[styles.fill, { backgroundColor: colors.progressFill, width: `${percentage}%`, height }]} />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary, fontSize: fonts.xs }]}>
          {percentage}% · {completed}/{total} lessons
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  track: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  label: {
    fontWeight: '500',
  },
});
