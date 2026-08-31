import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lesson, LessonProgress } from '../types';
import { useTheme, useScaledFont } from '../hooks';
import { Spacing, BorderRadius } from '../theme';

interface Props {
  lesson: Lesson;
  index: number;
  progress?: LessonProgress;
  isBookmarked: boolean;
  isDownloaded: boolean;
  onPress: (lesson: Lesson) => void;
  onBookmark: (lessonId: string, courseId: string) => void;
}

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  video: 'videocam-outline',
  audio: 'musical-notes-outline',
  pdf: 'document-text-outline',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const LessonRow = memo(({ lesson, index, progress, isBookmarked, isDownloaded, onPress, onBookmark }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const isCompleted = progress?.status === 'completed';
  const isInProgress = progress?.status === 'in_progress';

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => onPress(lesson)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.indexCircle,
        {
          backgroundColor: isCompleted ? colors.success : isInProgress ? colors.primaryLight : colors.surfaceVariant,
        },
      ]}>
        {isCompleted ? (
          <Ionicons name="checkmark" size={16} color="#fff" />
        ) : (
          <Text style={[styles.indexText, { color: isInProgress ? '#fff' : colors.textSecondary, fontSize: fonts.sm }]}>
            {index}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text, fontSize: fonts.md }]} numberOfLines={1}>
          {lesson.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons name={TYPE_ICONS[lesson.type] || 'play-outline'} size={14} color={colors.textTertiary} />
          <Text style={[styles.metaText, { color: colors.textTertiary, fontSize: fonts.xs }]}>
            {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} · {formatDuration(lesson.duration)}
          </Text>
          {isDownloaded && (
            <Ionicons name="cloud-done-outline" size={14} color={colors.success} style={{ marginLeft: 6 }} />
          )}
        </View>
        {isInProgress && progress && (
          <View style={styles.resumeRow}>
            <View style={[styles.miniProgress, { backgroundColor: colors.progressTrack }]}>
              <View
                style={[
                  styles.miniProgressFill,
                  {
                    backgroundColor: colors.progressFill,
                    width: `${Math.round((progress.lastPositionSeconds / progress.durationSeconds) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.resumeText, { color: colors.primaryLight, fontSize: fonts.xs }]}>
              {formatDuration(Math.round(progress.lastPositionSeconds))} / {formatDuration(progress.durationSeconds)}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={() => onBookmark(lesson.id, lesson.courseId)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={22}
          color={isBookmarked ? colors.accent : colors.textTertiary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  indexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {},
  resumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  miniProgress: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  resumeText: {
    fontWeight: '500',
  },
});
