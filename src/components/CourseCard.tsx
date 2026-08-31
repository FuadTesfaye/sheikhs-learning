import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '../types';
import { useTheme, useScaledFont } from '../hooks';
import { useLearningStore } from '../store';
import { Spacing, BorderRadius } from '../theme';

interface Props {
  course: Course;
  onPress: (course: Course) => void;
}

const LEVEL_COLORS = {
  Beginner: '#4CAF50',
  Intermediate: '#FF9800',
  Advanced: '#F44336',
};

export const CourseCard = memo(({ course, onPress }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const progress = useLearningStore(s => s.progress);

  const { completed, percentage } = useMemo(() => {
    const completedCount = Object.values(progress).filter(
      p => p.courseId === course.id && p.status === 'completed'
    ).length;
    return {
      completed: completedCount,
      percentage: course.totalLessons > 0 ? Math.round((completedCount / course.totalLessons) * 100) : 0,
    };
  }, [progress, course.id, course.totalLessons]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => onPress(course)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text, fontSize: fonts.lg }]} numberOfLines={2}>
            {course.title}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary, fontSize: fonts.sm }]} numberOfLines={2}>
            {course.description}
          </Text>
        </View>
        <View style={[styles.levelBadge, { backgroundColor: LEVEL_COLORS[course.level] + '20' }]}>
          <Text style={[styles.levelText, { color: LEVEL_COLORS[course.level], fontSize: fonts.xs }]}>
            {course.level}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.lessonsInfo}>
          <Ionicons name="play-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.lessonsText, { color: colors.textSecondary, fontSize: fonts.sm }]}>
            {course.totalLessons} lessons
          </Text>
        </View>

        {percentage > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.progressTrack }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: colors.progressFill, width: `${percentage}%` },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.primaryLight, fontSize: fonts.xs }]}>
              {percentage}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    lineHeight: 18,
  },
  levelBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonsText: {},
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginLeft: Spacing.lg,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'right',
  },
});
