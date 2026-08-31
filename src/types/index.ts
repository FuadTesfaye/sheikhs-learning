export type LessonType = 'video' | 'audio' | 'pdf';
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';
export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'paused' | 'failed';
export type ThemeMode = 'light' | 'dark' | 'system';
export type TextSize = 'small' | 'medium' | 'large';

export interface Category {
  id: string;
  name: string;
  arabicName?: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
}

export interface Course {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  order: number;
  thumbnailUrl: string;
  instructor: string;
  totalLessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  type: LessonType;
  mediaUrl: string;
  audioOnlyUrl?: string;
  pdfUrl?: string;
  transcriptText?: string;
  thumbnailUrl?: string;
}

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  status: LessonStatus;
  lastPositionSeconds: number;
  durationSeconds: number;
  lastUpdated: string;
  completedAt?: string;
}

export interface DownloadItem {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  format: LessonType;
  fileUri: string;
  fileSize: number;
  progress: number;
  status: DownloadStatus;
  downloadedAt?: string;
}

export interface Bookmark {
  lessonId: string;
  courseId: string;
  createdAt: string;
}

export interface UserSettings {
  theme: ThemeMode;
  textSize: TextSize;
  language: string;
  onboardingCompleted: boolean;
}

export interface AdminStats {
  totalUsers: number;
  dailyActiveUsers: number;
  totalStudyHours: number;
  averageCourseCompletion: number;
  coursesStarted: number;
  coursesCompleted: number;
  lessonsWatched: number;
}
