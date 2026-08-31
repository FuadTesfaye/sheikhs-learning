import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont } from '../../src/hooks';
import { getCoursesByCategory, getCategoryById } from '../../src/data/mockData';
import { CourseCard } from '../../src/components';
import { EmptyState } from '../../src/components';
import { Spacing } from '../../src/theme';
import { Course } from '../../src/types';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();

  const category = useMemo(() => getCategoryById(id), [id]);
  const coursesInCategory = useMemo(() => getCoursesByCategory(id), [id]);

  const handleCoursePress = useCallback((course: Course) => {
    router.push(`/course/${course.id}`);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: category?.name || 'Category',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />

      {category && (
        <View style={[styles.banner, { backgroundColor: category.color + '12' }]}>
          <Text style={[styles.bannerTitle, { color: category.color, fontSize: fonts.xl }]}>
            {category.name}
          </Text>
          {category.arabicName && (
            <Text style={[styles.bannerArabic, { color: category.color, fontSize: fonts.lg }]}>
              {category.arabicName}
            </Text>
          )}
          <Text style={[styles.bannerDesc, { color: colors.textSecondary, fontSize: fonts.sm }]}>
            {category.description} · {coursesInCategory.length} courses
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
            title="No Courses Yet"
            subtitle="Courses will be added to this category soon."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 4,
  },
  bannerTitle: { fontWeight: '800' },
  bannerArabic: { fontWeight: '600' },
  bannerDesc: {},
  list: {
    padding: Spacing.lg,
  },
});
