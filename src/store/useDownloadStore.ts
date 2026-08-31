import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DownloadItem, DownloadStatus } from '../types';

const DOWNLOADS_KEY = '@downloads';

interface DownloadState {
  downloads: Record<string, DownloadItem>;
  isLoaded: boolean;

  loadDownloads: () => Promise<void>;
  addDownload: (item: Omit<DownloadItem, 'progress' | 'status'>) => void;
  updateProgress: (id: string, progress: number) => void;
  setStatus: (id: string, status: DownloadStatus) => void;
  completeDownload: (id: string, fileUri: string) => void;
  removeDownload: (id: string) => void;
  clearAllDownloads: () => void;
  getDownloadByLessonId: (lessonId: string) => DownloadItem | undefined;
  getStorageUsed: () => number;
  getAllDownloads: () => DownloadItem[];
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloads: {},
  isLoaded: false,

  loadDownloads: async () => {
    try {
      const json = await AsyncStorage.getItem(DOWNLOADS_KEY);
      set({
        downloads: json ? JSON.parse(json) : {},
        isLoaded: true,
      });
    } catch (e) {
      console.error('Failed to load downloads:', e);
      set({ isLoaded: true });
    }
  },

  addDownload: (item) => {
    const { downloads } = get();
    const download: DownloadItem = {
      ...item,
      progress: 0,
      status: 'pending',
    };
    const updated = { ...downloads, [item.id]: download };
    set({ downloads: updated });
    AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated)).catch(console.error);
  },

  updateProgress: (id, progress) => {
    const { downloads } = get();
    if (!downloads[id]) return;
    const updated = {
      ...downloads,
      [id]: { ...downloads[id], progress, status: 'downloading' as DownloadStatus },
    };
    set({ downloads: updated });
  },

  setStatus: (id, status) => {
    const { downloads } = get();
    if (!downloads[id]) return;
    const updated = {
      ...downloads,
      [id]: { ...downloads[id], status },
    };
    set({ downloads: updated });
    AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated)).catch(console.error);
  },

  completeDownload: (id, fileUri) => {
    const { downloads } = get();
    if (!downloads[id]) return;
    const updated = {
      ...downloads,
      [id]: {
        ...downloads[id],
        progress: 1,
        status: 'completed' as DownloadStatus,
        fileUri,
        downloadedAt: new Date().toISOString(),
      },
    };
    set({ downloads: updated });
    AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated)).catch(console.error);
  },

  removeDownload: (id) => {
    const { downloads } = get();
    const { [id]: removed, ...rest } = downloads;
    set({ downloads: rest });
    AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(rest)).catch(console.error);
  },

  clearAllDownloads: () => {
    set({ downloads: {} });
    AsyncStorage.removeItem(DOWNLOADS_KEY).catch(console.error);
  },

  getDownloadByLessonId: (lessonId) => {
    return Object.values(get().downloads).find(d => d.lessonId === lessonId);
  },

  getStorageUsed: () => {
    return Object.values(get().downloads)
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.fileSize, 0);
  },

  getAllDownloads: () => {
    return Object.values(get().downloads).sort(
      (a, b) => (b.downloadedAt || '').localeCompare(a.downloadedAt || '')
    );
  },
}));
