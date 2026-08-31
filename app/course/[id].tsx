import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont } from '../../src/hooks';
import { getCourseById, getLessonsByCourse } from '../../src/data/mockData';
import { useLearningStore, useDownloadStore } from '../../src/store';
import { LessonRow, ProgressBar, EmptyState } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';
import { Lesson } from '../../src/types';
import { DownloadService } from '../../src/services/downloadService';

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();

  const course = useMemo(() => getCourseById(id), [id]);
  const lessons = useMemo(() => getLessonsByCourse(id), [id]);

  const progress = useLearningStore(s => s.progress);
  const bookmarks = useLearningStore(s => s.bookmarks);
  const toggleBookmark = useLearningStore(s => s.toggleBookmark);
  const downloads = useDownloadStore(s => s.downloads);

  const courseProgress = useMemo(() => {
    const totalLessons = course?.totalLessons || 0;
    const completed = Object.values(progress).filter(
      p => p.courseId === id && p.status === 'completed'
    ).length;
    return {
      completed,
      percentage: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
    };
  }, [id, progress, course?.totalLessons]);

  const handleLessonPress = useCallback((lesson: Lesson) => {
    router.push(`/lesson/${lesson.id}`);
  }, []);

  const handleBookmark = useCallback((lessonId: string, courseId: string) => {
    toggleBookmark(lessonId, courseId);
  }, []);

  const handleDownloadAll = () => {
    Alert.alert(
      'Download All',
      `Download all ${lessons.length} lessons for offline access?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            DownloadService.downloadCourse(lessons);
            Alert.alert('Downloads Started', `${lessons.length} lessons are now downloading. You can track progress in the Downloads tab.`);
          },
        },
      ]
    );
  };

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState icon="alert-circle-outline" title="Course Not Found" subtitle="This course may have been removed." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: course.title,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />

      <FlatList
        data={lessons}
        renderItem={({ item, index }) => (
          <LessonRow
            lesson={item}
            index={index + 1}
            progress={progress[item.id]}
            isBookmarked={bookmarks.some(b => b.lessonId === item.id)}
            isDownloaded={Object.values(downloads).some(d => d.lessonId === item.id && d.status === 'completed')}
            onPress={handleLessonPress}
            onBookmark={handleBookmark}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <Text style={[styles.courseTitle, { color: colors.text, fontSize: fonts.xxl }]}>
              {course.title}
            </Text>
            <Text style={[styles.courseDesc, { color: colors.textSecondary, fontSize: fonts.md }]}>
              {course.description}
            </Text>

            <View style={styles.metaRow}>
              <View style={[styles.metaBadge, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="school-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                  {course.level}
                </Text>
              </View>
              <View style={[styles.metaBadge, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="play-circle-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                  {course.totalLessons} lessons
                </Text>
              </View>
            </View>

            <ProgressBar
              percentage={courseProgress.percentage}
              completed={courseProgress.completed}
              total={course.totalLessons}
            />

            <TouchableOpacity
              style={[styles.downloadAllBtn, { backgroundColor: colors.primary }]}
              onPress={handleDownloadAll}
            >
              <Ionicons name="cloud-download-outline" size={20} color="#fff" />
              <Text style={styles.downloadAllText}>Download All Lessons</Text>
            </TouchableOpacity>

            <Text style={[styles.lessonsHeader, { color: colors.text, fontSize: fonts.lg }]}>
              Lessons
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState icon="list-outline" title="No Lessons" subtitle="Lessons will be added soon." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: Spacing.lg },
  headerSection: { marginBottom: Spacing.lg },
  courseTitle: { fontWeight: '800', marginBottom: Spacing.sm },
  courseDesc: { lineHeight: 22, marginBottom: Spacing.lg },
  metaRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  metaText: { fontWeight: '500' },
  downloadAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    gap: 8,
    marginBottom: Spacing.xl,
  },
  downloadAllText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  lessonsHeader: { fontWeight: '700', marginBottom: Spacing.sm },
});
