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

  it('validates exactly 3 welcome pages covering The Sheikhs, The Courses, and Bunyan', async () => {
    const { welcomeSlides } = await import('../src/data/welcomeData');
    expect(welcomeSlides.length).toBe(3);

    // Page 1: The Sheikhs
    const sheikhsSlide = welcomeSlides[0];
    expect(sheikhsSlide.id).toBe('sheikhs');
    expect(sheikhsSlide.title).toContain('Sheikhs');
    expect(sheikhsSlide.badge).toContain('Sheikhs');
    expect(sheikhsSlide.arabicBadge).toBe('ادْعُوا لِلشَّيْخِ');
    expect(sheikhsSlide.duaCard).toBeDefined();
    expect(sheikhsSlide.duaCard?.arabic).toContain('اللَّهُمَّ اغْفِرْ لَهُ');
    expect(sheikhsSlide.duaCard?.buttonText).toContain('Say Ameen');
    expect(sheikhsSlide.highlights.length).toBeGreaterThanOrEqual(3);

    // Page 2: The Courses
    const coursesSlide = welcomeSlides[1];
    expect(coursesSlide.id).toBe('courses');
    expect(coursesSlide.title).toContain('Courses');
    expect(coursesSlide.badge).toContain('Courses');
    expect(coursesSlide.arabicBadge).toBe('مَنَاهِجُ الدِّرَاسَةِ');
    expect(coursesSlide.curriculumCategories).toBeDefined();
    expect(coursesSlide.curriculumCategories?.length).toBeGreaterThanOrEqual(6);
    const categoryNames = coursesSlide.curriculumCategories?.map(c => c.name);
    expect(categoryNames).toContain('Aqeedah');
    expect(categoryNames).toContain('Tafsir');
    expect(categoryNames).toContain('Hadith');
    expect(categoryNames).toContain('Fiqh');
    expect(coursesSlide.highlights.some(h => h.title.includes('Offline'))).toBe(true);

    // Page 3: Bunyan
    const bunyanSlide = welcomeSlides[2];
    expect(bunyanSlide.id).toBe('bunyan');
    expect(bunyanSlide.title).toContain('Bunyan');
    expect(bunyanSlide.badge).toContain('Bunyan');
    expect(bunyanSlide.arabicBadge).toBe('مُبَادَرَةُ بُنْيَان');
    expect(bunyanSlide.pillars).toBeDefined();
    expect(bunyanSlide.pillars?.length).toBe(3);
    expect(bunyanSlide.highlights.some(h => h.title.includes('Sadaqah Jariyah'))).toBe(true);
    expect(bunyanSlide.buttonLabel).toBe('Start Seeking Knowledge');
  });

  it('manages onboarding completion state in settings store', () => {
    const settings = useSettingsStore.getState();
    
    // Set completed
    settings.setOnboardingCompleted(true);
    expect(useSettingsStore.getState().onboardingCompleted).toBe(true);

    // Can be reset to replay onboarding
    settings.setOnboardingCompleted(false);
    expect(useSettingsStore.getState().onboardingCompleted).toBe(false);

    // Set back to completed
    settings.setOnboardingCompleted(true);
    expect(useSettingsStore.getState().onboardingCompleted).toBe(true);
  });
});

