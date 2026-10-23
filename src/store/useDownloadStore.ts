import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DownloadItem, DownloadStatus } from '../types';

const DOWNLOADS_KEY = '@downloads';

export interface StorageBreakdown {
  audioBytes: number;
  pdfBytes: number;
  totalBytes: number;
  completedCount: number;
}

interface DownloadState {
  downloads: Record<string, DownloadItem>;
  isLoaded: boolean;

  loadDownloads: () => Promise<void>;
  addDownload: (item: Omit<DownloadItem, 'progress' | 'status' | 'downloadedBytes'> & { downloadedBytes?: number }) => void;
  updateProgress: (id: string, progress: number, downloadedBytes?: number, totalBytes?: number) => void;
  setStatus: (id: string, status: DownloadStatus, error?: string) => void;
  setResumeData: (id: string, resumeData: string | undefined, downloadedBytes?: number) => void;
  completeDownload: (id: string, fileUri: string, finalSize?: number) => void;
  removeDownload: (id: string) => void;
  clearAllDownloads: () => void;
  getDownloadByLessonId: (lessonId: string, format?: string) => DownloadItem | undefined;
  getStorageUsed: () => number;
  getStorageBreakdown: () => StorageBreakdown;
  getAllDownloads: () => DownloadItem[];
  clearCacheOnly: () => Promise<void>;
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloads: {},
  isLoaded: false,

  loadDownloads: async () => {
    try {
      const json = await AsyncStorage.getItem(DOWNLOADS_KEY);
      if (json) {
        const loaded: Record<string, DownloadItem> = JSON.parse(json);
        // Handle interrupted downloads upon app restart: if marked as downloading, reset to paused
        Object.keys(loaded).forEach(id => {
          if (loaded[id].status === 'downloading') {
            loaded[id].status = 'paused';
          }
        });
        set({ downloads: loaded, isLoaded: true });
      } else {
        set({ downloads: {}, isLoaded: true });
      }
    } catch (e) {
      console.error('Failed to load downloads:', e);
      set({ isLoaded: true });
    }
  },

  addDownload: (item) => {
    const { downloads } = get();
    const existing = downloads[item.id];
    const download: DownloadItem = {
      ...item,
      downloadedBytes: item.downloadedBytes ?? existing?.downloadedBytes ?? 0,
      progress: existing?.progress ?? 0,
      status: 'pending',
      retryCount: 0,
    };
    const updated = { ...downloads, [item.id]: download };
    set({ downloads: updated });
    AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated)).catch(console.error);
  },

  updateProgress: (id, progress, downloadedBytes, totalBytes) => {
    const { downloads } = get();
    const existing = downloads[id];
    if (!existing) return;

    const computedBytes = downloadedBytes ?? Math.round(progress * (totalBytes || existing.fileSize));
    const computedTotal = totalBytes && totalBytes > 0 ? totalBytes : existing.fileSize;

    const updated = {
      ...downloads,
      [id]: {
        ...existing,
        progress: Math.min(Math.max(progress, 0), 1),
        downloadedBytes: computedBytes,
        fileSize: computedTotal,
        status: 'downloading' as DownloadStatus,
      },
    };
    set({ downloads: updated });
  },

  setStatus: (id, status, error) => {
    const { downloads } = get();
    if (!downloads[id]) return;
    const current = downloads[id];
    const retryCount = status === 'failed' ? (current.retryCount || 0) + 1 : current.retryCount;
    const updated = {
      ...downloads,
      [id]: {
        ...current,
        status,
        error: error !== undefined ? error : current.error,
        retryCount,
      },
    };
    set({ downloads: updated });
    AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated)).catch(console.error);
  },

  setResumeData: (id, resumeData, downloadedBytes) => {
    const { downloads } = get();
    if (!downloads[id]) return;
    const current = downloads[id];
    const updated = {
      ...downloads,
      [id]: {
        ...current,
        resumeData,
        downloadedBytes: downloadedBytes !== undefined ? downloadedBytes : current.downloadedBytes,
      },
    };
    set({ downloads: updated });
    AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated)).catch(console.error);
  },

  completeDownload: (id, fileUri, finalSize) => {
    const { downloads } = get();
    const existing = downloads[id];
    if (!existing) return;

    const actualSize = finalSize && finalSize > 0 ? finalSize : existing.fileSize;
    const updated = {
      ...downloads,
      [id]: {
        ...existing,
        progress: 1,
        downloadedBytes: actualSize,
        fileSize: actualSize,
        status: 'completed' as DownloadStatus,
        fileUri,
        downloadedAt: new Date().toISOString(),
        error: undefined,
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

  getDownloadByLessonId: (lessonId, format) => {
    const items = Object.values(get().downloads);
    if (format) {
      return items.find(d => d.lessonId === lessonId && d.format === format);
    }
    return items.find(d => d.lessonId === lessonId);
  },

  getStorageUsed: () => {
    return Object.values(get().downloads)
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + (d.fileSize || d.downloadedBytes || 0), 0);
  },

  getStorageBreakdown: () => {
    const completed = Object.values(get().downloads).filter(d => d.status === 'completed');
    let audioBytes = 0;
    let pdfBytes = 0;

    completed.forEach(item => {
      const size = item.fileSize || item.downloadedBytes || 0;
      if (item.format === 'audio') {
        audioBytes += size;
      } else if (item.format === 'pdf') {
        pdfBytes += size;
      }
    });

    return {
      audioBytes,
      pdfBytes,
      totalBytes: audioBytes + pdfBytes,
      completedCount: completed.length,
    };
  },

  getAllDownloads: () => {
    return Object.values(get().downloads).sort(
      (a, b) => (b.downloadedAt || '').localeCompare(a.downloadedAt || '')
    );
  },

  clearCacheOnly: async () => {
    // Keeps completed downloads, removes failed or transient cached downloads
    const { downloads } = get();
    const cleaned: Record<string, DownloadItem> = {};
    Object.entries(downloads).forEach(([id, item]) => {
      if (item.status === 'completed') {
        cleaned[id] = item;
      }
    });
    set({ downloads: cleaned });
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(cleaned)).catch(console.error);
  },
}));
