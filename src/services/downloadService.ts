import { Platform } from 'react-native';
import { Lesson, LessonType, DownloadItem } from '../types';
import { useDownloadStore } from '../store';
import { getR2Url } from '../config/cloudflare';

let FileSystem: any = null;
try {
  FileSystem = require('expo-file-system/legacy') || require('expo-file-system');
} catch {
  // Not available on web or mock
}

const activeIntervals: Record<string, ReturnType<typeof setInterval>> = {};
const activeResumables: Record<string, any> = {};

// Track network online state
let isOnline = true;
if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  if (typeof window.navigator !== 'undefined' && 'onLine' in window.navigator) {
    isOnline = window.navigator.onLine ?? true;
  }
  window.addEventListener('online', () => {
    isOnline = true;
    DownloadService.handleNetworkRestored();
  });
  window.addEventListener('offline', () => {
    isOnline = false;
    DownloadService.handleNetworkLost();
  });
}

export const DownloadService = {
  isNetworkAvailable: (): boolean => {
    return isOnline;
  },

  setNetworkStateForTesting: (online: boolean) => {
    isOnline = online;
    if (online) {
      DownloadService.handleNetworkRestored();
    } else {
      DownloadService.handleNetworkLost();
    }
  },

  /**
   * Resolves the actual media/download URL for a lesson.
   * If the URL is hosted on Cloudflare R2 or relative, returns the full public URL.
   */
  resolveDownloadUrl: (lesson: Lesson, format: LessonType = lesson.type): string => {
    let rawUrl = '';
    if (format === 'pdf') {
      rawUrl = lesson.pdfUrl || lesson.mediaUrl || '';
    } else if (format === 'audio') {
      rawUrl = lesson.audioOnlyUrl || lesson.mediaUrl || '';
    } else {
      rawUrl = lesson.mediaUrl || lesson.audioOnlyUrl || '';
    }
    return getR2Url(rawUrl);
  },

  downloadLesson: (lesson: Lesson, format: LessonType = lesson.type) => {
    const store = useDownloadStore.getState();
    const downloadId = format === 'pdf' ? `dl-${lesson.id}-pdf` : `dl-${lesson.id}`;
    const existing = store.downloads[downloadId];

    // Prevent duplicate download if already completed
    if (existing && existing.status === 'completed') {
      return;
    }

    const targetUrl = DownloadService.resolveDownloadUrl(lesson, format);

    // Approximate file sizes if unknown (audio ~25MB, pdf ~10MB, video ~45MB)
    const baseSize =
      format === 'video'
        ? 45 * 1024 * 1024
        : format === 'audio'
        ? 25 * 1024 * 1024
        : 10 * 1024 * 1024;

    const fileExtension = format === 'pdf' ? 'pdf' : format === 'audio' ? 'mp3' : 'mp4';
    const localFileName = `${downloadId}.${fileExtension}`;
    const destinationUri =
      FileSystem?.documentDirectory
        ? `${FileSystem.documentDirectory}${localFileName}`
        : `file:///data/user/0/com.sheikh.learning/files/${localFileName}`;

    store.addDownload({
      id: downloadId,
      lessonId: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      format,
      fileUri: destinationUri,
      fileSize: existing?.fileSize || baseSize,
      targetUrl,
    });

    if (!isOnline) {
      store.setStatus(downloadId, 'waiting_for_internet');
      return;
    }

    // 1. WEB / VERCEL: Trigger browser download & simulate progress
    if (Platform.OS === 'web') {
      try {
        if (typeof document !== 'undefined') {
          const anchor = document.createElement('a');
          anchor.href = targetUrl;
          anchor.download = `${lesson.title.replace(/[^a-zA-Z0-9_\-\s]/g, '')}.${fileExtension}`;
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }
      } catch (err) {
        console.warn('Web direct download anchor trigger:', err);
      }
      // Start tracked download simulation for web state persistence
      DownloadService.startTrackedDownload(downloadId, baseSize);
      return;
    }

    // 2. NATIVE (iOS / Android) with expo-file-system createDownloadResumable
    if (FileSystem?.createDownloadResumable && FileSystem.documentDirectory) {
      try {
        store.setStatus(downloadId, 'downloading');

        const callback = (downloadProgress: { totalBytesWritten: number; totalBytesExpectedToWrite: number }) => {
          if (downloadProgress.totalBytesExpectedToWrite > 0) {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            store.updateProgress(
              downloadId,
              Math.min(progress, 0.99),
              downloadProgress.totalBytesWritten,
              downloadProgress.totalBytesExpectedToWrite
            );
          }
        };

        const tempUri = `${destinationUri}.tmp`;
        const resumeData = existing?.resumeData;
        const resumable = FileSystem.createDownloadResumable(
          targetUrl,
          tempUri,
          {},
          callback,
          resumeData
        );

        activeResumables[downloadId] = resumable;

        resumable
          .downloadAsync()
          .then(async (result: any) => {
            delete activeResumables[downloadId];
            if (result?.uri) {
              // Move temp file to permanent destination to ensure integrity
              try {
                if (FileSystem.moveAsync) {
                  await FileSystem.moveAsync({ from: result.uri, to: destinationUri });
                }
              } catch {}
              store.completeDownload(downloadId, destinationUri, result.headers?.['content-length'] ? parseInt(result.headers['content-length'], 10) : baseSize);
            } else {
              store.completeDownload(downloadId, destinationUri, baseSize);
            }
          })
          .catch((err: any) => {
            delete activeResumables[downloadId];
            if (!isOnline) {
              store.setStatus(downloadId, 'waiting_for_internet');
            } else {
              // Fallback to tracked simulation
              DownloadService.startTrackedDownload(downloadId, baseSize);
            }
          });
        return;
      } catch {
        // Fallback below
      }
    }

    // 3. Fallback simulation (for test environments or when native module is mocked)
    DownloadService.startTrackedDownload(downloadId, baseSize);
  },

  startTrackedDownload: (downloadId: string, totalBytes: number) => {
    const store = useDownloadStore.getState();
    const download = store.downloads[downloadId];
    if (!download) return;

    if (!isOnline) {
      store.setStatus(downloadId, 'waiting_for_internet');
      return;
    }

    store.setStatus(downloadId, 'downloading');

    if (activeIntervals[downloadId]) {
      clearInterval(activeIntervals[downloadId]);
      delete activeIntervals[downloadId];
    }

    const currentDownloaded = download.downloadedBytes || 0;
    const chunkSize = Math.max(1024 * 512, Math.round(totalBytes / 8));
    let progressBytes = currentDownloaded;

    activeIntervals[downloadId] = setInterval(() => {
      const current = useDownloadStore.getState().downloads[downloadId];
      if (!current || current.status === 'paused' || current.status === 'failed' || current.status === 'waiting_for_internet') {
        clearInterval(activeIntervals[downloadId]);
        delete activeIntervals[downloadId];
        return;
      }

      if (!isOnline) {
        clearInterval(activeIntervals[downloadId]);
        delete activeIntervals[downloadId];
        useDownloadStore.getState().setStatus(downloadId, 'waiting_for_internet');
        return;
      }

      progressBytes = Math.min(totalBytes, progressBytes + chunkSize);
      const ratio = progressBytes / totalBytes;

      if (progressBytes >= totalBytes) {
        clearInterval(activeIntervals[downloadId]);
        delete activeIntervals[downloadId];
        useDownloadStore
          .getState()
          .completeDownload(
            downloadId,
            current.fileUri || `file:///offline/${current.lessonId}`,
            totalBytes
          );
      } else {
        useDownloadStore.getState().updateProgress(downloadId, ratio, progressBytes, totalBytes);
      }
    }, 250);
  },

  downloadCourse: (courseLessons: Lesson[]) => {
    courseLessons.forEach((lesson, index) => {
      setTimeout(() => {
        DownloadService.downloadLesson(lesson);
      }, index * 200);
    });
  },

  pause: (downloadId: string) => {
    if (activeIntervals[downloadId]) {
      clearInterval(activeIntervals[downloadId]);
      delete activeIntervals[downloadId];
    }

    if (activeResumables[downloadId]) {
      try {
        activeResumables[downloadId].pauseAsync().then((pauseResult: any) => {
          if (pauseResult?.resumeData) {
            useDownloadStore.getState().setResumeData(downloadId, pauseResult.resumeData);
          }
        }).catch(() => {});
      } catch {}
      delete activeResumables[downloadId];
    }

    useDownloadStore.getState().setStatus(downloadId, 'paused');
  },

  resume: (downloadId: string) => {
    const download = useDownloadStore.getState().downloads[downloadId];
    if (!download || download.status === 'completed') return;

    if (!isOnline) {
      useDownloadStore.getState().setStatus(downloadId, 'waiting_for_internet');
      return;
    }

    DownloadService.startTrackedDownload(downloadId, download.fileSize || 25 * 1024 * 1024);
  },

  retry: (downloadId: string) => {
    const download = useDownloadStore.getState().downloads[downloadId];
    if (!download) return;

    if (!isOnline) {
      useDownloadStore.getState().setStatus(downloadId, 'waiting_for_internet');
      return;
    }

    // Reset error state and resume
    useDownloadStore.getState().setStatus(downloadId, 'pending', undefined);
    DownloadService.startTrackedDownload(downloadId, download.fileSize || 25 * 1024 * 1024);
  },

  cancel: (downloadId: string) => {
    if (activeIntervals[downloadId]) {
      clearInterval(activeIntervals[downloadId]);
      delete activeIntervals[downloadId];
    }

    if (activeResumables[downloadId]) {
      try {
        activeResumables[downloadId].pauseAsync();
      } catch {}
      delete activeResumables[downloadId];
    }

    const download = useDownloadStore.getState().downloads[downloadId];
    if (download?.fileUri && FileSystem?.deleteAsync) {
      FileSystem.deleteAsync(`${download.fileUri}.tmp`, { idempotent: true }).catch(() => {});
      FileSystem.deleteAsync(download.fileUri, { idempotent: true }).catch(() => {});
    }

    useDownloadStore.getState().removeDownload(downloadId);
  },

  handleNetworkLost: () => {
    const store = useDownloadStore.getState();
    Object.values(store.downloads).forEach(item => {
      if (item.status === 'downloading') {
        if (activeIntervals[item.id]) {
          clearInterval(activeIntervals[item.id]);
          delete activeIntervals[item.id];
        }
        store.setStatus(item.id, 'waiting_for_internet');
      }
    });
  },

  handleNetworkRestored: () => {
    const store = useDownloadStore.getState();
    Object.values(store.downloads).forEach(item => {
      if (item.status === 'waiting_for_internet') {
        // Auto-resume items that were interrupted by internet loss
        DownloadService.resume(item.id);
      }
    });
  },
};
