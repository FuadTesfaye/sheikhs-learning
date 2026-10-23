import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { useTheme, useScaledFont, useTranslation } from '../hooks';
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
  const { t, isRTL } = useTranslation();

  const localized = t.categories[category.id];
  const displayName = localized?.name || category.name;

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
      accessibilityLabel={displayName}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color + '18' }]}>
        <Ionicons
          name={ICON_MAP[category.icon] || 'book'}
          size={28}
          color={category.color}
        />
      </View>
      <Text
        style={[
          styles.name,
          {
            color: colors.text,
            fontSize: fonts.sm,
            writingDirection: isRTL ? 'rtl' : 'ltr',
          },
        ]}
        numberOfLines={2}
      >
        {displayName}
      </Text>
      <Text style={[styles.count, { color: colors.textTertiary, fontSize: fonts.xs }]}>
        {t.common.lessonsCount(category.courseCount)}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    margin: Spacing.xs,
    minHeight: 115,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 16,
  },
  count: {
    textAlign: 'center',
    marginTop: 'auto',
  },
});
