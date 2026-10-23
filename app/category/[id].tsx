import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme, useScaledFont, useTranslation } from '../../src/hooks';
import { getCoursesByCategory, getCategoryById } from '../../src/data/mockData';
import { CourseCard, EmptyState } from '../../src/components';
import { Spacing } from '../../src/theme';
import { Course } from '../../src/types';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();
  const router = useRouter();

  const category = useMemo(() => getCategoryById(id), [id]);
  const coursesInCategory = useMemo(() => getCoursesByCategory(id), [id]);
  const localizedCat = category ? t.categories[category.id] : undefined;

  const handleCoursePress = useCallback((course: Course) => {
    router.push(`/course/${course.id}`);
  }, []);

  const categoryTitle = localizedCat?.name || category?.name || '';
  const categoryDesc = localizedCat?.description || category?.description || '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: categoryTitle,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />

      {category && (
        <View style={[styles.banner, { backgroundColor: category.color + '12' }]}>
          <Text style={[styles.bannerTitle, { color: category.color, fontSize: fonts.xl, writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            {categoryTitle}
          </Text>
          {category.arabicName && (
            <Text style={[styles.bannerArabic, { color: category.color, fontSize: fonts.lg }]}>
              {category.arabicName}
            </Text>
          )}
          <Text style={[styles.bannerDesc, { color: colors.textSecondary, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' }]}>
            {categoryDesc} · {t.common.lessonsCount(coursesInCategory.length)}
          </Text>
        </View>
      )}

      <FlatList
        data={coursesInCategory}
        renderItem={({ item }) => <CourseCard course={item} onPress={handleCoursePress} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="school-outline"
            title={t.course.noLessonsTitle}
            subtitle={t.course.noLessonsDesc}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 4,
  },
  bannerTitle: { fontWeight: '800' },
  bannerArabic: { fontWeight: '600' },
  bannerDesc: {},
  list: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    padding: Spacing.lg,
  },
});
