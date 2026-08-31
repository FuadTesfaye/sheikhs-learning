import { create } from 'zustand';
import { courses, lessons, categories } from '../data/mockData';

export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  categoryName: string;
  enrolledUsers: number;
  completedUsers: number;
  completionRate: number; // 0 - 100
  totalHoursWatched: number;
  dropOffLessonTitle: string;
  dropOffLessonOrder: number;
}

export interface AdminAnalyticsData {
  totalLearners: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  newSignupsThisMonth: number;
  totalStudyHours: number;
  averageLessonsPerLearner: number;
  totalOfflineDownloads: number;
  coursesStarted: number;
  coursesCompleted: number;
  overallCompletionRate: number;
  courseAnalytics: CourseAnalytics[];
}

interface AdminState {
  analytics: AdminAnalyticsData;
  isUnlocked: boolean;
  unlockAdmin: (pin: string) => boolean;
  lockAdmin: () => void;
  exportReportCsv: () => string;
}

const INITIAL_ANALYTICS: AdminAnalyticsData = {
  totalLearners: 14820,
  dailyActiveUsers: 3450,
  weeklyActiveUsers: 8920,
  newSignupsThisMonth: 1240,
  totalStudyHours: 48900,
  averageLessonsPerLearner: 8.4,
  totalOfflineDownloads: 31200,
  coursesStarted: 22400,
  coursesCompleted: 11950,
  overallCompletionRate: 53.3,
  courseAnalytics: courses.map((course, idx) => {
    const enrolled = 1200 + Math.floor(Math.sin(idx + 1) * 600) + (idx === 0 ? 3200 : 800);
    const completed = Math.floor(enrolled * (0.45 + (idx % 3) * 0.15));
    const rate = Math.round((completed / enrolled) * 100);
    const hours = Math.round(enrolled * (course.totalLessons * 0.4));
    const courseLessons = lessons.filter(l => l.courseId === course.id);
    const dropOffIndex = Math.min(Math.floor(course.totalLessons * 0.35), courseLessons.length - 1);
    const dropOffLesson = courseLessons[dropOffIndex] || { title: 'Lesson 3', order: 3 };

    return {
      courseId: course.id,
      courseTitle: course.title,
      categoryName: categories.find(c => c.id === course.categoryId)?.name || 'General',
      enrolledUsers: enrolled,
      completedUsers: completed,
      completionRate: rate,
      totalHoursWatched: hours,
      dropOffLessonTitle: dropOffLesson.title,
      dropOffLessonOrder: dropOffLesson.order,
    };
  }),
};

export const useAdminStore = create<AdminState>((set, get) => ({
  analytics: INITIAL_ANALYTICS,
  isUnlocked: false,

  unlockAdmin: (pin: string) => {
    if (pin === '1234' || pin === 'ilm' || pin === 'admin') {
      set({ isUnlocked: true });
      return true;
    }
    return false;
  },

  lockAdmin: () => {
    set({ isUnlocked: false });
  },

  exportReportCsv: () => {
    const { analytics } = get();
    const headers = 'Course Title,Category,Enrolled Learners,Completed Learners,Completion Rate (%),Total Hours Watched,Drop-off Point\n';
    const rows = analytics.courseAnalytics
      .map(
        c =>
          `"${c.courseTitle}","${c.categoryName}",${c.enrolledUsers},${c.completedUsers},${c.completionRate}%,${c.totalHoursWatched} hrs,"Lesson ${c.dropOffLessonOrder}: ${c.dropOffLessonTitle}"`
      )
      .join('\n');

    const summary = `\n--- Overall Summary ---\nTotal Registered Learners,${analytics.totalLearners}\nDaily Active Users (DAU),${analytics.dailyActiveUsers}\nWeekly Active Users (WAU),${analytics.weeklyActiveUsers}\nTotal Study Hours,${analytics.totalStudyHours}\nTotal Offline Downloads,${analytics.totalOfflineDownloads}\nOverall Completion Rate,${analytics.overallCompletionRate}%\n`;

    return headers + rows + summary;
  },
}));
