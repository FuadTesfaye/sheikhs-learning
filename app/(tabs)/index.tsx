import React, { useCallback, useMemo } from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont } from '../../src/hooks';
import { useLearningStore } from '../../src/store';
import { categories, courses } from '../../src/data/mockData';
import { CategoryCard, ContinueLearningCard, CourseCard } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';
import { Category, Course } from '../../src/types';

export default function HomeScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();
  const progress = useLearningStore(s => s.progress);

  const continueLearning = useMemo(() => {
    return Object.values(progress)
      .filter(p => p.status === 'in_progress')
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5);
  }, [progress]);

  const handleCategoryPress = useCallback((cat: Category) => {
    router.push(`/category/${cat.id}`);
  }, []);

  const handleCoursePress = useCallback((course: Course) => {
    router.push(`/course/${course.id}`);
  }, []);

  const handleContinuePress = useCallback((lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  }, []);

  const featuredCourses = courses.slice(0, 4);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary, fontSize: fonts.sm }]}>
              Assalamu Alaikum
            </Text>
            <Text style={[styles.appTitle, { color: colors.text, fontSize: fonts.xxl }]}>
              Sheikh's Learning
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.surfaceVariant }]}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Ionicons name="search" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Bunyan & Dua Banner */}
        <TouchableOpacity
          style={[styles.duaBanner, { backgroundColor: colors.primaryLight + '15', borderColor: colors.primaryLight + '35' }]}
          onPress={() => router.push('/about')}
          activeOpacity={0.8}
        >
          <View style={[styles.duaBannerIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="heart" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.duaBannerContent}>
            <Text style={[styles.duaBannerTitle, { color: colors.text, fontSize: fonts.sm }]}>
              The Bunyan Initiative · ادْعُوا لِلشَّيْخِ
            </Text>
            <Text style={[styles.duaBannerSubtitle, { color: colors.textSecondary, fontSize: fonts.xs }]} numberOfLines={1}>
              Pray for the Sheikh & discover the Bunyan mission
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* Continue Learning */}
        {continueLearning.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fonts.lg }]}>
              Continue Learning
            </Text>
            <FlatList
              data={continueLearning}
              renderItem={({ item }) => (
                <ContinueLearningCard progress={item} onPress={handleContinuePress} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.lessonId}
              contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
            />
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fonts.lg }]}>
            Categories
          </Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat, idx) => (
              <View key={cat.id} style={styles.categoryItem}>
                <CategoryCard category={cat} onPress={handleCategoryPress} />
              </View>
            ))}
          </View>
        </View>

        {/* Featured Courses */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fonts.lg }]}>
            Featured Courses
          </Text>
          <View style={styles.coursesList}>
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} onPress={handleCoursePress} />
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    marginBottom: 2,
  },
  appTitle: {
    fontWeight: '800',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  duaBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duaBannerContent: {
    flex: 1,
  },
  duaBannerTitle: {
    fontWeight: '700',
    marginBottom: 2,
  },
  duaBannerSubtitle: {
    fontWeight: '500',
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontWeight: '700',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    justifyContent: 'flex-start',
  },
  categoryItem: {
    flexBasis: '50%',
    maxWidth: '50%',
    padding: Spacing.xs,
  },
  coursesList: {
    paddingHorizontal: Spacing.lg,
  },
});
