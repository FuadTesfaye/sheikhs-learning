import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LessonProgress, Bookmark } from '../types';

const PROGRESS_KEY = '@learning_progress';
const BOOKMARKS_KEY = '@bookmarks';

interface LearningState {
  progress: Record<string, LessonProgress>;
  bookmarks: Bookmark[];
  isLoaded: boolean;

  loadData: () => Promise<void>;
  saveProgress: (lessonId: string, courseId: string, position: number, duration: number) => void;
  markCompleted: (lessonId: string, courseId: string, duration: number) => void;
  toggleBookmark: (lessonId: string, courseId: string) => void;
  isBookmarked: (lessonId: string) => boolean;
  getProgress: (lessonId: string) => LessonProgress | undefined;
  getCourseProgress: (courseId: string, totalLessons: number) => { completed: number; percentage: number };
  getContinueLearning: () => LessonProgress[];
  clearAll: () => void;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  progress: {},
  bookmarks: [],
  isLoaded: false,

  loadData: async () => {
    try {
      const [progressJson, bookmarksJson] = await Promise.all([
        AsyncStorage.getItem(PROGRESS_KEY),
        AsyncStorage.getItem(BOOKMARKS_KEY),
      ]);
      set({
        progress: progressJson ? JSON.parse(progressJson) : {},
        bookmarks: bookmarksJson ? JSON.parse(bookmarksJson) : [],
        isLoaded: true,
      });
    } catch (e) {
      console.error('Failed to load learning data:', e);
      set({ isLoaded: true });
    }
  },

  saveProgress: (lessonId, courseId, position, duration) => {
    const { progress } = get();
    const existing = progress[lessonId];
    const isCompleted = position >= duration * 0.95;
    const updated: LessonProgress = {
      lessonId,
      courseId,
      status: isCompleted ? 'completed' : 'in_progress',
      lastPositionSeconds: position,
      durationSeconds: duration,
      lastUpdated: new Date().toISOString(),
      completedAt: isCompleted ? new Date().toISOString() : existing?.completedAt,
    };
    const newProgress = { ...progress, [lessonId]: updated };
    set({ progress: newProgress });
    AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress)).catch(console.error);
  },

  markCompleted: (lessonId, courseId, duration) => {
    const { progress } = get();
    const updated: LessonProgress = {
      lessonId,
      courseId,
      status: 'completed',
      lastPositionSeconds: duration,
      durationSeconds: duration,
      lastUpdated: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    const newProgress = { ...progress, [lessonId]: updated };
    set({ progress: newProgress });
    AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress)).catch(console.error);
  },

  toggleBookmark: (lessonId, courseId) => {
    const { bookmarks } = get();
    const exists = bookmarks.find(b => b.lessonId === lessonId);
    const updated = exists
      ? bookmarks.filter(b => b.lessonId !== lessonId)
      : [...bookmarks, { lessonId, courseId, createdAt: new Date().toISOString() }];
    set({ bookmarks: updated });
    AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated)).catch(console.error);
  },

  isBookmarked: (lessonId) => {
    return get().bookmarks.some(b => b.lessonId === lessonId);
  },

  getProgress: (lessonId) => {
    return get().progress[lessonId];
  },

  getCourseProgress: (courseId, totalLessons) => {
    const { progress } = get();
    const completed = Object.values(progress).filter(
      p => p.courseId === courseId && p.status === 'completed'
    ).length;
    return {
      completed,
      percentage: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
    };
  },

  getContinueLearning: () => {
    const { progress } = get();
    return Object.values(progress)
      .filter(p => p.status === 'in_progress')
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5);
  },

  clearAll: () => {
    set({ progress: {}, bookmarks: [] });
    AsyncStorage.multiRemove([PROGRESS_KEY, BOOKMARKS_KEY]).catch(console.error);
  },
}));
