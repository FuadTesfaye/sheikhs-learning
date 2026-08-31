import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LessonProgress } from '../types';
import { getLessonById, getCourseById } from '../data/mockData';
import { useTheme, useScaledFont } from '../hooks';
import { Spacing, BorderRadius } from '../theme';

interface Props {
  progress: LessonProgress;
  onPress: (lessonId: string) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const ContinueLearningCard = memo(({ progress, onPress }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const lesson = getLessonById(progress.lessonId);
  const course = lesson ? getCourseById(lesson.courseId) : undefined;

  if (!lesson) return null;

  const percent = Math.round((progress.lastPositionSeconds / progress.durationSeconds) * 100);
  const remaining = progress.durationSeconds - progress.lastPositionSeconds;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => onPress(progress.lessonId)}
      activeOpacity={0.7}
    >
      <View style={[styles.playIcon, { backgroundColor: colors.primary }]}>
        <Ionicons name="play" size={20} color="#fff" />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text, fontSize: fonts.md }]} numberOfLines={1}>
          {lesson.title}
        </Text>
        {course && (
          <Text style={[styles.course, { color: colors.textSecondary, fontSize: fonts.xs }]} numberOfLines={1}>
            {course.title}
          </Text>
        )}
        <View style={styles.progressRow}>
          <View style={[styles.progressBar, { backgroundColor: colors.progressTrack }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.progressFill, width: `${percent}%` }]} />
          </View>
          <Text style={[styles.remaining, { color: colors.textTertiary, fontSize: fonts.xs }]}>
            {formatDuration(Math.round(remaining))} left
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginRight: Spacing.md,
    width: 280,
    gap: Spacing.md,
  },
  playIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  course: {
    marginBottom: 6,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  remaining: {
    minWidth: 52,
  },
});
