import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Share,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont } from '../../src/hooks';
import { getLessonById, getCourseById } from '../../src/data/mockData';
import { useLearningStore, useDownloadStore } from '../../src/store';
import { DownloadService } from '../../src/services/downloadService';
import { Spacing, BorderRadius } from '../../src/theme';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const fonts = useScaledFont();

  const lesson = getLessonById(id);
  const course = lesson ? getCourseById(lesson.courseId) : undefined;

  const progressMap = useLearningStore(s => s.progress);
  const bookmarks = useLearningStore(s => s.bookmarks);
  const saveProgress = useLearningStore(s => s.saveProgress);
  const markCompleted = useLearningStore(s => s.markCompleted);
  const toggleBookmark = useLearningStore(s => s.toggleBookmark);

  const existingProgress = progressMap[id];
  const bookmarked = bookmarks.some(b => b.lessonId === id);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(existingProgress?.lastPositionSeconds || 0);
  const [speed, setSpeed] = useState(1.0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const downloadsMap = useDownloadStore(s => s.downloads);
  const downloadItem = Object.values(downloadsMap).find(d => d.lessonId === id);
  const isDownloaded = downloadItem?.status === 'completed';
  const isDownloading = downloadItem?.status === 'downloading';

  const handleDownload = () => {
    if (isDownloaded) {
      Alert.alert('Downloaded', 'This lesson is already available offline.');
      return;
    }
    if (lesson) {
      DownloadService.downloadLesson(lesson);
      Alert.alert('Download Started', 'Lesson is downloading for offline playback.');
    }
  };

  const handleShare = async () => {
    if (!lesson) return;
    try {
      await Share.share({
        title: lesson.title,
        message: `Listen to "${lesson.title}" from the course "${course?.title || "Sheikh's Lessons"}" on the Sheikh's Islamic Learning App!`,
      });
    } catch (e) {
      // Ignored
    }
  };

  const handleResumeClick = () => {
    if (existingProgress?.lastPositionSeconds) {
      setCurrentTime(existingProgress.lastPositionSeconds);
      setIsPlaying(true);
    }
  };

  const duration = lesson?.duration || 0;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Simulated playback timer
  useEffect(() => {
    if (isPlaying && lesson) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + speed;
          if (next >= duration) {
            setIsPlaying(false);
            markCompleted(id, lesson.courseId, duration);
            return duration;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  // Auto-save progress every 5 seconds
  useEffect(() => {
    if (lesson && currentTime > 0 && currentTime < duration) {
      const save = setTimeout(() => {
        saveProgress(id, lesson.courseId, currentTime, duration);
      }, 5000);
      return () => clearTimeout(save);
    }
  }, [Math.floor(currentTime / 5)]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (lesson && currentTime > 0) {
        saveProgress(id, lesson.courseId, currentTime, duration);
      }
    };
  }, [currentTime]);

  const togglePlay = () => setIsPlaying(prev => !prev);

  const seekBy = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(duration, prev + seconds)));
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const idx = speeds.indexOf(speed);
    setSpeed(speeds[(idx + 1) % speeds.length]);
  };

  if (!lesson) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 100 }}>Lesson not found</Text>
      </View>
    );
  }

  const typeIcon = lesson.type === 'video' ? 'videocam' : lesson.type === 'audio' ? 'musical-notes' : 'document-text';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Player Area */}
        <View style={[styles.playerArea, { backgroundColor: colors.surfaceVariant }]}>
          <Ionicons name={typeIcon as any} size={64} color={colors.primary} />
          <Text style={[styles.typeLabel, { color: colors.textSecondary, fontSize: fonts.sm }]}>
            {lesson.type.toUpperCase()}
          </Text>
        </View>

        {/* Title & Course */}
        <View style={styles.info}>
          <Text style={[styles.lessonTitle, { color: colors.text, fontSize: fonts.xl }]}>
            {lesson.title}
          </Text>
          {course && (
            <Text style={[styles.courseName, { color: colors.textSecondary, fontSize: fonts.sm }]}>
              {course.title}
            </Text>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={[styles.seekTrack, { backgroundColor: colors.progressTrack }]}>
            <View style={[styles.seekFill, { backgroundColor: colors.progressFill, width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
              {formatTime(currentTime)}
            </Text>
            <Text style={[styles.timeText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={cycleSpeed} style={styles.speedBtn}>
            <Text style={[styles.speedText, { color: colors.text, fontSize: fonts.sm }]}>
              {speed}x
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => seekBy(-10)}>
            <Ionicons name="play-back" size={32} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlay}
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => seekBy(10)}>
            <Ionicons name="play-forward" size={32} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => toggleBookmark(id, lesson.courseId)}>
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={28}
              color={bookmarked ? colors.accent : colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: isDownloaded ? colors.success + '18' : colors.surfaceVariant }]}
            onPress={handleDownload}
          >
            <Ionicons
              name={isDownloaded ? 'checkmark-circle-outline' : isDownloading ? 'arrow-down-circle-outline' : 'cloud-download-outline'}
              size={20}
              color={isDownloaded ? colors.success : colors.text}
            />
            <Text
              style={[
                styles.actionText,
                { color: isDownloaded ? colors.success : colors.text, fontSize: fonts.sm },
              ]}
            >
              {isDownloaded
                ? 'Downloaded ✓'
                : isDownloading
                ? `Downloading ${Math.round((downloadItem?.progress || 0) * 100)}%`
                : 'Download'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant }]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text, fontSize: fonts.sm }]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Description / Transcript */}
        <View style={[styles.transcriptSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.transcriptTitle, { color: colors.text, fontSize: fonts.lg }]}>
            {lesson.type === 'pdf' ? 'Notes' : 'Description'}
          </Text>
          <Text style={[styles.transcriptText, { color: colors.textSecondary, fontSize: fonts.md }]}>
            {lesson.description}
          </Text>
          {lesson.transcriptText && (
            <>
              <Text style={[styles.transcriptTitle, { color: colors.text, fontSize: fonts.lg, marginTop: Spacing.lg }]}>
                Transcript
              </Text>
              <Text style={[styles.transcriptText, { color: colors.textSecondary, fontSize: fonts.md }]}>
                {lesson.transcriptText}
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  playerArea: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  typeLabel: { fontWeight: '600', letterSpacing: 1 },
  info: {
    padding: Spacing.lg,
    gap: 4,
  },
  lessonTitle: { fontWeight: '800' },
  courseName: {},
  progressSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  seekTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  seekFill: {
    height: '100%',
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {},
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: Spacing.xl,
  },
  speedBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  speedText: { fontWeight: '700' },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  actionText: { fontWeight: '600' },
  transcriptSection: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  transcriptTitle: { fontWeight: '700', marginBottom: Spacing.sm },
  transcriptText: { lineHeight: 22 },
});
