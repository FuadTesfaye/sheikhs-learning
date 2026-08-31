import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { useTheme, useScaledFont } from '../hooks';
import { Spacing, BorderRadius } from '../theme';

interface Props {
  category: Category;
  onPress: (category: Category) => void;
}

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  book: 'book',
  'book-open': 'book-outline',
  bookmark: 'bookmark',
  scale: 'scale-outline',
  clock: 'time-outline',
  type: 'text-outline',
  mic: 'mic-outline',
  heart: 'heart-outline',
};

export const CategoryCard = memo(({ category, onPress }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color + '18' }]}>
        <Ionicons
          name={ICON_MAP[category.icon] || 'book'}
          size={28}
          color={category.color}
        />
      </View>
      <Text style={[styles.name, { color: colors.text, fontSize: fonts.md }]} numberOfLines={1}>
        {category.name}
      </Text>
      {category.arabicName && (
        <Text style={[styles.arabic, { color: colors.textSecondary, fontSize: fonts.sm }]} numberOfLines={1}>
          {category.arabicName}
        </Text>
      )}
      <Text style={[styles.count, { color: colors.textTertiary, fontSize: fonts.xs }]}>
        {category.courseCount} courses
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    margin: Spacing.xs,
    minWidth: 100,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  arabic: {
    textAlign: 'center',
    marginBottom: 4,
  },
  count: {
    textAlign: 'center',
  },
});
