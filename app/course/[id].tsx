import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont } from '../../src/hooks';
import { getCourseById, getLessonsByCourse } from '../../src/data/mockData';
import { useLearningStore, useDownloadStore } from '../../src/store';
import { LessonRow, ProgressBar, EmptyState, KitabCover } from '../../src/components';
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

  const downloadableLessons = useMemo(() => {
    return lessons.filter(l => Boolean(l.mediaUrl || l.audioOnlyUrl || l.pdfUrl));
  }, [lessons]);

  const handleLessonPress = useCallback((lesson: Lesson) => {
    router.push(`/lesson/${lesson.id}`);
  }, []);

  const handleBookmark = useCallback((lessonId: string, courseId: string) => {
    toggleBookmark(lessonId, courseId);
  }, []);

  const handleDownloadAll = () => {
    if (downloadableLessons.length === 0) {
      Alert.alert('تنبيه', 'التسجيلات الصوتية لهذا المتن قيد التسجيل والإعداد حالياً، وسيتم إتاحتها قريباً بإذن الله.');
      return;
    }

    Alert.alert(
      'تحميل جميع الدروس',
      `هل ترغب في تحميل ${downloadableLessons.length} درساً للاستماع دون اتصال؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تحميل الكل',
          onPress: () => {
            DownloadService.downloadCourse(downloadableLessons);
            Alert.alert('بدأ التحميل', `جاري تحميل ${downloadableLessons.length} درساً في الخلفية. يمكنك متابعة التقدم في تبويب التحميلات.`);
          },
        },
      ]
    );
  };

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState icon="alert-circle-outline" title="الكتاب غير موجود" subtitle="ربما تم نقل هذا الكتاب أو تعديل مساره." />
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
            {/* Authentic Kitab Hero Header */}
            <View style={styles.heroRow}>
              <KitabCover
                coverUrl={course.coverUrl || course.thumbnailUrl}
                arabicTitle={course.title}
                author={course.instructor}
                width={110}
                height={150}
                variant="detail"
              />
              <View style={styles.heroInfo}>
                <Text style={[styles.courseTitle, { color: colors.text, fontSize: fonts.xxl }]}>
                  {course.title}
                </Text>
                <View style={styles.authorBadgeRow}>
                  <Ionicons name="person" size={13} color={colors.primary} />
                  <Text style={[styles.instructorText, { color: colors.primary, fontSize: fonts.sm }]}>
                    {course.instructor}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <View style={[styles.metaBadge, { backgroundColor: colors.surfaceVariant }]}>
                    <Ionicons name="school-outline" size={13} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                      {course.level === 'Beginner' ? 'مبتدئ' : course.level === 'Intermediate' ? 'متوسط' : 'متقدم'}
                    </Text>
                  </View>
                  <View style={[styles.metaBadge, { backgroundColor: colors.surfaceVariant }]}>
                    <Ionicons name="play-circle-outline" size={13} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                      {course.totalLessons} {course.totalLessons <= 10 ? 'دروس' : 'درساً'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={[styles.courseDesc, { color: colors.textSecondary, fontSize: fonts.md }]}>
              {course.description}
            </Text>

            <ProgressBar
              percentage={courseProgress.percentage}
              completed={courseProgress.completed}
              total={course.totalLessons}
            />

            {downloadableLessons.length > 0 ? (
              <TouchableOpacity
                style={[styles.downloadAllBtn, { backgroundColor: colors.primary }]}
                onPress={handleDownloadAll}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-download-outline" size={20} color="#fff" />
                <Text style={styles.downloadAllText}>تحميل جميع الدروس المتاحة</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.prepNoticeBox, { backgroundColor: colors.primaryLight + '12', borderColor: colors.primaryLight + '30' }]}>
                <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
                <Text style={[styles.prepNoticeText, { color: colors.text }]}>
                  المنهج الدراسي معتمد ومكتمل. التسجيلات الصوتية قيد الإعداد والمراجعة.
                </Text>
              </View>
            )}

            <Text style={[styles.lessonsHeader, { color: colors.text, fontSize: fonts.lg }]}>
              فهرس الأبواب والدروس
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState icon="list-outline" title="لا توجد دروس حالياً" subtitle="سيتم إضافة الفهرس قريباً بإذن الله." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    padding: Spacing.lg,
  },
  headerSection: { marginBottom: Spacing.lg },
  heroRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroInfo: {
    flex: 1,
    gap: 6,
  },
  courseTitle: {
    fontWeight: '800',
    writingDirection: 'rtl',
    lineHeight: 28,
  },
  authorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instructorText: {
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  courseDesc: {
    lineHeight: 22,
    marginBottom: Spacing.lg,
    writingDirection: 'rtl',
    textAlign: 'left',
  },
  metaRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: 2 },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  metaText: { fontWeight: '600' },
  downloadAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: BorderRadius.lg,
    gap: 8,
    marginBottom: Spacing.xl,
    marginTop: Spacing.sm,
  },
  downloadAllText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  prepNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  prepNoticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    writingDirection: 'rtl',
  },
  lessonsHeader: {
    fontWeight: '800',
    marginBottom: Spacing.sm,
    writingDirection: 'rtl',
    textAlign: 'left',
  },
});
