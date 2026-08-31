import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont } from '../../src/hooks';
import { useLearningStore, useDownloadStore } from '../../src/store';
import { getLessonById } from '../../src/data/mockData';
import { LessonRow, EmptyState } from '../../src/components';
import { Spacing } from '../../src/theme';
import { Lesson } from '../../src/types';

export default function BookmarksScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();
  const bookmarks = useLearningStore(s => s.bookmarks);
  const progress = useLearningStore(s => s.progress);
  const toggleBookmark = useLearningStore(s => s.toggleBookmark);
  const downloads = useDownloadStore(s => s.downloads);

  const bookmarkedLessons = useMemo(() => {
    return bookmarks
      .map(b => getLessonById(b.lessonId))
      .filter((l): l is NonNullable<typeof l> => l !== undefined);
  }, [bookmarks]);

  const handlePress = useCallback((lesson: Lesson) => {
    router.push(`/lesson/${lesson.id}`);
  }, []);

  const handleBookmark = useCallback((lessonId: string, courseId: string) => {
    toggleBookmark(lessonId, courseId);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontSize: fonts.xxl }]}>Bookmarks</Text>
        <Text style={[styles.count, { color: colors.textSecondary, fontSize: fonts.sm }]}>
          {bookmarkedLessons.length} saved
        </Text>
      </View>

      <FlatList
        data={bookmarkedLessons}
        renderItem={({ item, index }) => (
          <LessonRow
            lesson={item}
            index={index + 1}
            progress={progress[item.id]}
            isBookmarked={true}
            isDownloaded={Object.values(downloads).some(d => d.lessonId === item.id && d.status === 'completed')}
            onPress={handlePress}
            onBookmark={handleBookmark}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="No Bookmarks Yet"
            subtitle="Tap the bookmark icon on any lesson to save it here for quick access."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { fontWeight: '800' },
  count: { marginTop: 2 },
  list: { paddingHorizontal: Spacing.lg, flexGrow: 1 },
});
