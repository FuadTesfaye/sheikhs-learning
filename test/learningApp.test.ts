import './setup';
import { describe, it, expect } from 'bun:test';
import { categories, courses, lessons, getCoursesByCategory, getLessonsByCourse } from '../src/data/mockData';
import { useLearningStore, useDownloadStore, useSettingsStore, useAdminStore } from '../src/store';
import { DownloadService } from '../src/services/downloadService';
import { scale, moderateScale, FontSize } from '../src/theme/spacing';

describe("Sheikh's Islamic Learning App Core Tests", () => {
  it('loads all core categories correctly', () => {
    expect(categories.length).toBeGreaterThanOrEqual(8);
    const names = categories.map(c => c.name);
    expect(names).toContain('Aqeedah');
    expect(names).toContain('Tafsir');
    expect(names).toContain('Hadith');
    expect(names).toContain('Fiqh');
    expect(names).toContain('Seerah');
    expect(names).toContain('Arabic Grammar');
    expect(names).toContain('Tajweed');
    expect(names).toContain('Adab');
  });

  it('filters courses by category and lessons by course', () => {
    const aqeedahCourses = getCoursesByCategory('cat-1');
    expect(aqeedahCourses.length).toBeGreaterThan(0);

    const firstCourseLessons = getLessonsByCourse(aqeedahCourses[0].id);
    expect(firstCourseLessons.length).toBe(aqeedahCourses[0].totalLessons);
  });

  it('calculates course progress and continue learning properly', () => {
    const learningStore = useLearningStore.getState();

    learningStore.saveProgress('crs-1-les-1', 'crs-1', 300, 1200);
    const progress = useLearningStore.getState().getProgress('crs-1-les-1');
    expect(progress?.status).toBe('in_progress');
    expect(progress?.lastPositionSeconds).toBe(300);

    const continueList = useLearningStore.getState().getContinueLearning();
    expect(continueList.length).toBeGreaterThan(0);
    expect(continueList[0].lessonId).toBe('crs-1-les-1');

    learningStore.markCompleted('crs-1-les-1', 'crs-1', 1200);
    const updated = useLearningStore.getState().getProgress('crs-1-les-1');
    expect(updated?.status).toBe('completed');

    const courseProgress = useLearningStore.getState().getCourseProgress('crs-1', 12);
    expect(courseProgress.completed).toBe(1);
    expect(courseProgress.percentage).toBe(Math.round((1 / 12) * 100));
  });

  it('toggles bookmarks reliably', () => {
    const learningStore = useLearningStore.getState();
    expect(learningStore.isBookmarked('crs-3-les-1')).toBe(false);

    learningStore.toggleBookmark('crs-3-les-1', 'crs-3');
    expect(useLearningStore.getState().isBookmarked('crs-3-les-1')).toBe(true);

    learningStore.toggleBookmark('crs-3-les-1', 'crs-3');
    expect(useLearningStore.getState().isBookmarked('crs-3-les-1')).toBe(false);
  });

  it('handles download lifecycle and storage math', () => {
    const downloadStore = useDownloadStore.getState();
    downloadStore.clearAllDownloads();

    const sampleLesson = lessons[0];
    DownloadService.downloadLesson(sampleLesson, 'audio');

    const downloads = useDownloadStore.getState().getAllDownloads();
    expect(downloads.length).toBe(1);
    expect(downloads[0].lessonId).toBe(sampleLesson.id);
    expect(downloads[0].format).toBe('audio');

    // Simulate completion
    useDownloadStore.getState().completeDownload(downloads[0].id, 'file:///offline/test.mp3');
    const completed = useDownloadStore.getState().getDownloadByLessonId(sampleLesson.id);
    expect(completed?.status).toBe('completed');
    expect(useDownloadStore.getState().getStorageUsed()).toBeGreaterThan(0);
  });

  it('calculates font scaling and small-device dimensions correctly', () => {
    const settings = useSettingsStore.getState();
    settings.setTextSize('large');
    expect(useSettingsStore.getState().fontScale).toBe(1.2);

    settings.setTextSize('small');
    expect(useSettingsStore.getState().fontScale).toBe(0.85);

    expect(scale(16)).toBeGreaterThan(0);
    expect(moderateScale(16)).toBeGreaterThan(0);
  });

  it('validates admin analytics and CSV export generation', () => {
    const admin = useAdminStore.getState();
    expect(admin.unlockAdmin('wrong')).toBe(false);
    expect(admin.unlockAdmin('1234')).toBe(true);

    const csv = admin.exportReportCsv();
    expect(csv).toContain('Course Title');
    expect(csv).toContain('Foundations of Aqeedah');
    expect(csv).toContain('Total Registered Learners');
  });
});
