import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont, useAudioPlayer } from '../../src/hooks';
import { getLessonById, getCourseById, getLessonsByCourse } from '../../src/data/mockData';
import { useLearningStore, useDownloadStore } from '../../src/store';
import { DownloadService } from '../../src/services/downloadService';
import { PdfViewer } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const fonts = useScaledFont();

  const lesson = getLessonById(id);
  const course = lesson ? getCourseById(lesson.courseId) : undefined;
  const courseLessons = lesson ? getLessonsByCourse(lesson.courseId) : [];

  const currentIndex = courseLessons.findIndex(l => l.id === id);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  const progressMap = useLearningStore(s => s.progress);
  const bookmarks = useLearningStore(s => s.bookmarks);
  const saveProgress = useLearningStore(s => s.saveProgress);
  const markCompleted = useLearningStore(s => s.markCompleted);
  const toggleBookmark = useLearningStore(s => s.toggleBookmark);

  const existingProgress = progressMap[id];
  const bookmarked = bookmarks.some(b => b.lessonId === id);

  // Tab mode: Default to PDF when available as requested!
  const hasPdf = Boolean(lesson?.pdfUrl);
  const [activeTab, setActiveTab] = useState<'pdf' | 'notes'>(hasPdf ? 'pdf' : 'notes');

  // Sync tab if lesson changes
  useEffect(() => {
    if (lesson?.pdfUrl) {
      setActiveTab('pdf');
    } else {
      setActiveTab('notes');
    }
  }, [lesson?.id, hasPdf]);

  // Downloads state
  const downloadsMap = useDownloadStore(s => s.downloads);
  const audioDownload = downloadsMap[`dl-${id}`] || Object.values(downloadsMap).find(d => d.lessonId === id && d.format !== 'pdf');
  const isAudioDownloaded = audioDownload?.status === 'completed';
  const isAudioDownloading = audioDownload?.status === 'downloading';

  const pdfDownload = downloadsMap[`dl-${id}-pdf`] || Object.values(downloadsMap).find(d => d.lessonId === id && d.format === 'pdf');
  const isPdfDownloaded = pdfDownload?.status === 'completed';
  const isPdfDownloading = pdfDownload?.status === 'downloading';

  // Determine active audio source: local offline file if downloaded, else R2 streaming URL
  const audioSource = useMemo(() => {
    if (isAudioDownloaded && audioDownload?.fileUri) {
      return audioDownload.fileUri;
    }
    return lesson?.audioOnlyUrl || lesson?.mediaUrl || '';
  }, [isAudioDownloaded, audioDownload?.fileUri, lesson?.audioOnlyUrl, lesson?.mediaUrl]);

  // Real Audio Player Hook
  const {
    isPlaying,
    isLoading: isAudioLoading,
    currentTime,
    duration,
    speed,
    error: audioError,
    togglePlay,
    seekBy,
    seekTo,
    setSpeed,
  } = useAudioPlayer(
    audioSource,
    existingProgress?.lastPositionSeconds || 0,
    lesson?.duration || 1800,
    () => {
      if (lesson) {
        markCompleted(id, lesson.courseId, duration);
      }
    }
  );

  // Auto-save learning progress every 5 seconds of playback
  useEffect(() => {
    if (lesson && currentTime > 0 && currentTime < duration) {
      const timer = setTimeout(() => {
        saveProgress(id, lesson.courseId, Math.round(currentTime), Math.round(duration));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [Math.floor(currentTime / 5)]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (lesson && currentTime > 0) {
        saveProgress(id, lesson.courseId, Math.round(currentTime), Math.round(duration));
      }
    };
  }, [currentTime, duration]);

  const handleDownloadAudio = () => {
    if (isAudioDownloaded) {
      Alert.alert('Downloaded', 'Audio is already downloaded for offline playback.');
      return;
    }
    if (lesson) {
      DownloadService.downloadLesson(lesson, 'audio');
      Alert.alert('Download Started', 'Audio is downloading from Cloudflare storage.');
    }
  };

  const handleDownloadPdf = () => {
    if (isPdfDownloaded) {
      Alert.alert('Downloaded', 'PDF study text is already saved.');
      return;
    }
    if (lesson && lesson.pdfUrl) {
      DownloadService.downloadLesson(lesson, 'pdf');
      Alert.alert('Download Started', 'PDF study text is downloading.');
    }
  };

  const handleShare = async () => {
    if (!lesson) return;
    try {
      await Share.share({
        title: lesson.title,
        message: `Listen to "${lesson.title}" from "${course?.title || "Sheikh's Lessons"}" on Bunyan!`,
      });
    } catch {}
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!lesson) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 100 }}>
          Lesson not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: course?.title || 'Lesson',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerBackTitle: 'Back',
        }}
      />

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header & Breadcrumb */}
        <View style={styles.topInfo}>
          <View style={styles.courseBadgeRow}>
            <Text style={[styles.courseBadge, { color: colors.primary, backgroundColor: colors.primary + '15' }]}>
              {course?.title || 'Course'}
            </Text>
            <Text style={[styles.lessonOrder, { color: colors.textSecondary }]}>
              Lesson {lesson.order} of {courseLessons.length || course?.totalLessons}
            </Text>
          </View>
          <Text style={[styles.lessonTitle, { color: colors.text, fontSize: fonts.xl }]}>
            {lesson.title}
          </Text>
        </View>

        {/* Tab Switcher if PDF is present */}
        {hasPdf && (
          <View style={[styles.tabBar, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'pdf' && [styles.activeTabItem, { backgroundColor: colors.surface }]]}
              onPress={() => setActiveTab('pdf')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="document-text"
                size={16}
                color={activeTab === 'pdf' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'pdf' ? colors.text : colors.textSecondary },
                ]}
              >
                PDF Study Text (Default)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'notes' && [styles.activeTabItem, { backgroundColor: colors.surface }]]}
              onPress={() => setActiveTab('notes')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={activeTab === 'notes' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'notes' ? colors.text : colors.textSecondary },
                ]}
              >
                Overview & Notes
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 1. PDF VIEWER: Opened by default on screen */}
        {hasPdf && activeTab === 'pdf' && lesson.pdfUrl && (
          <PdfViewer
            pdfUrl={lesson.pdfUrl}
            title={lesson.title}
            isDownloaded={isPdfDownloaded}
            isDownloading={isPdfDownloading}
            onDownload={handleDownloadPdf}
            height={520}
          />
        )}

        {/* 2. OVERVIEW & TRANSCRIPT SECTION */}
        {(activeTab === 'notes' || !hasPdf) && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconBox, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="book-outline" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fonts.md }]}>
                Lesson Summary & Commentary
              </Text>
            </View>

            <Text style={[styles.cardBody, { color: colors.textSecondary, fontSize: fonts.sm }]}>
              {lesson.description}
            </Text>

            {hasPdf && (
              <TouchableOpacity
                style={[styles.pdfNoticeBtn, { borderColor: colors.primary + '30', backgroundColor: colors.primary + '10' }]}
                onPress={() => setActiveTab('pdf')}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                <Text style={[styles.pdfNoticeText, { color: colors.primary }]}>
                  This lesson has accompanying PDF notes. Tap to view study text.
                </Text>
              </TouchableOpacity>
            )}

            {lesson.transcriptText && (
              <View style={{ marginTop: Spacing.md }}>
                <Text style={[styles.sectionSubtitle, { color: colors.text }]}>
                  Study Notes
                </Text>
                <Text style={[styles.transcriptText, { color: colors.textSecondary, fontSize: fonts.sm }]}>
                  {lesson.transcriptText}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons Row */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: isAudioDownloaded ? colors.success + '15' : colors.surface, borderColor: colors.border }]}
            onPress={handleDownloadAudio}
          >
            <Ionicons
              name={isAudioDownloaded ? 'checkmark-circle' : isAudioDownloading ? 'arrow-down-circle' : 'cloud-download-outline'}
              size={18}
              color={isAudioDownloaded ? colors.success : colors.text}
            />
            <Text style={[styles.actionBtnText, { color: isAudioDownloaded ? colors.success : colors.text }]}>
              {isAudioDownloaded ? 'Audio Saved' : isAudioDownloading ? 'Downloading...' : 'Download Audio'}
            </Text>
          </TouchableOpacity>

          {hasPdf && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: isPdfDownloaded ? colors.success + '15' : colors.surface, borderColor: colors.border }]}
              onPress={handleDownloadPdf}
            >
              <Ionicons
                name={isPdfDownloaded ? 'checkmark-circle' : isPdfDownloading ? 'arrow-down-circle' : 'document-text-outline'}
                size={18}
                color={isPdfDownloaded ? colors.success : colors.text}
              />
              <Text style={[styles.actionBtnText, { color: isPdfDownloaded ? colors.success : colors.text }]}>
                {isPdfDownloaded ? 'PDF Saved' : isPdfDownloading ? 'Downloading...' : 'Download PDF'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={18} color={colors.text} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Next / Previous Navigation Links */}
        <View style={styles.navRow}>
          {prevLesson ? (
            <TouchableOpacity
              style={[styles.navBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={() => router.replace(`/lesson/${prevLesson.id}`)}
            >
              <Ionicons name="chevron-back" size={18} color={colors.text} />
              <Text style={[styles.navBtnText, { color: colors.text }]} numberOfLines={1}>
                Previous: Lesson {prevLesson.order}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {nextLesson && (
            <TouchableOpacity
              style={[styles.navBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={() => router.replace(`/lesson/${nextLesson.id}`)}
            >
              <Text style={[styles.navBtnText, { color: colors.text }]} numberOfLines={1}>
                Next: Lesson {nextLesson.order}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom padding so content is not hidden by sticky audio player */}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* DOCKED STICKY AUDIO PLAYER AT THE BOTTOM */}
      <View
        style={[
          styles.bottomPlayer,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            shadowColor: '#000',
          },
        ]}
      >
        {/* Scrubber Progress Bar */}
        <TouchableOpacity
          style={styles.scrubberContainer}
          activeOpacity={0.9}
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            // Approximate seek ratio across average container width
            const seekRatio = Math.max(0, Math.min(1, locationX / 340));
            seekTo(seekRatio * duration);
          }}
        >
          <View style={[styles.scrubberTrack, { backgroundColor: colors.progressTrack }]}>
            <View style={[styles.scrubberFill, { backgroundColor: colors.primary, width: `${progressPercent}%` }]} />
            <View style={[styles.scrubberKnob, { backgroundColor: colors.primary, left: `${Math.min(98, progressPercent)}%` }]} />
          </View>
        </TouchableOpacity>

        {/* Player Bar Content */}
        <View style={styles.playerInner}>
          {/* Top Row: Mini Info + Timestamps */}
          <View style={styles.playerHeaderRow}>
            <View style={styles.playerTitleGroup}>
              <Text style={[styles.miniLessonTitle, { color: colors.text }]} numberOfLines={1}>
                {lesson.title}
              </Text>
              <View style={styles.streamingBadgeRow}>
                <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.miniSourceText, { color: colors.textSecondary }]}>
                  {isAudioDownloaded ? 'Offline Storage' : 'Cloudflare R2 Audio'}
                </Text>
              </View>
            </View>

            <Text style={[styles.timeDisplay, { color: colors.textSecondary }]}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>

          {/* Controls Row */}
          <View style={styles.playerControlsRow}>
            {/* Speed Button */}
            <TouchableOpacity style={[styles.speedChip, { backgroundColor: colors.surfaceVariant }]} onPress={cycleSpeed}>
              <Text style={[styles.speedChipText, { color: colors.text }]}>{speed}x</Text>
            </TouchableOpacity>

            {/* Seek -10s */}
            <TouchableOpacity style={styles.seekBtn} onPress={() => seekBy(-10)} activeOpacity={0.7}>
              <Ionicons name="play-back" size={26} color={colors.text} />
              <Text style={[styles.seekSubText, { color: colors.textSecondary }]}>-10s</Text>
            </TouchableOpacity>

            {/* Main Big Play / Pause Button */}
            <TouchableOpacity
              style={[styles.playPauseBtn, { backgroundColor: colors.primary }]}
              onPress={togglePlay}
              activeOpacity={0.85}
              accessibilityLabel={isPlaying ? 'Pause lesson audio' : 'Play lesson audio'}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Seek +10s */}
            <TouchableOpacity style={styles.seekBtn} onPress={() => seekBy(10)} activeOpacity={0.7}>
              <Ionicons name="play-forward" size={26} color={colors.text} />
              <Text style={[styles.seekSubText, { color: colors.textSecondary }]}>+10s</Text>
            </TouchableOpacity>

            {/* Bookmark Toggle */}
            <TouchableOpacity
              style={styles.utilBtn}
              onPress={() => toggleBookmark(id, lesson.courseId)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={bookmarked ? colors.accent : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: 880,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  topInfo: {
    marginBottom: Spacing.md,
  },
  courseBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  courseBadge: {
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
  },
  lessonOrder: {
    fontSize: 12,
    fontWeight: '600',
  },
  lessonTitle: {
    fontWeight: '800',
    lineHeight: 28,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 3,
    marginBottom: Spacing.md,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  activeTabItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: '700',
  },
  cardBody: {
    lineHeight: 21,
  },
  pdfNoticeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
    marginTop: 6,
  },
  pdfNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  transcriptText: {
    lineHeight: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing.lg,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  scrubberContainer: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: Spacing.lg,
  },
  scrubberTrack: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
  },
  scrubberFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrubberKnob: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
  },
  playerInner: {
    maxWidth: 880,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
  },
  playerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  playerTitleGroup: {
    flex: 1,
    marginRight: 12,
  },
  miniLessonTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  streamingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  miniSourceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timeDisplay: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  playerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  speedChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  seekBtn: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  seekSubText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: -2,
  },
  playPauseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  utilBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
