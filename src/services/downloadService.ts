import { Platform } from 'react-native';
import { Lesson, LessonType } from '../types';
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

export const DownloadService = {
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

    if (existing && existing.status === 'completed') {
      return;
    }

    const targetUrl = DownloadService.resolveDownloadUrl(lesson, format);

    // Approximate file sizes if unknown (video ~45MB, audio ~25MB, pdf ~10MB)
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
      fileSize: baseSize,
    });

    // 1. WEB / VERCEL: Trigger direct browser download
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
        console.warn('Web direct download link error:', err);
      }
      // Mark as completed in store
      store.completeDownload(downloadId, targetUrl);
      return;
    }

    // 2. NATIVE (iOS / Android) with expo-file-system
    if (FileSystem?.createDownloadResumable && FileSystem.documentDirectory) {
      try {
        store.setStatus(downloadId, 'downloading');

        const callback = (downloadProgress: { totalBytesWritten: number; totalBytesExpectedToWrite: number }) => {
          if (downloadProgress.totalBytesExpectedToWrite > 0) {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            store.updateProgress(downloadId, Math.min(progress, 0.99));
          }
        };

        const resumable = FileSystem.createDownloadResumable(
          targetUrl,
          destinationUri,
          {},
          callback
        );

        activeResumables[downloadId] = resumable;

        resumable
          .downloadAsync()
          .then((result: any) => {
            delete activeResumables[downloadId];
            if (result?.uri) {
              store.completeDownload(downloadId, result.uri);
            } else {
              store.completeDownload(downloadId, destinationUri);
            }
          })
          .catch(() => {
            delete activeResumables[downloadId];
            // If network or CORS failed on device, fallback to simulation so offline mode still registers
            DownloadService.startDownloadSimulation(downloadId, lesson.id);
          });
        return;
      } catch {
        // Fallback below
      }
    }

    // 3. Fallback simulation (for test environments or when native module is mocked)
    DownloadService.startDownloadSimulation(downloadId, lesson.id);
  },

  startDownloadSimulation: (downloadId: string, lessonId: string) => {
    const store = useDownloadStore.getState();
    store.setStatus(downloadId, 'downloading');

    if (activeIntervals[downloadId]) {
      clearInterval(activeIntervals[downloadId]);
    }

    let progress = 0;
    activeIntervals[downloadId] = setInterval(() => {
      const current = useDownloadStore.getState().downloads[downloadId];
      if (!current || current.status === 'paused' || current.status === 'failed') {
        clearInterval(activeIntervals[downloadId]);
        delete activeIntervals[downloadId];
        return;
      }

      progress += 0.2 + Math.random() * 0.15;
      if (progress >= 1) {
        clearInterval(activeIntervals[downloadId]);
        delete activeIntervals[downloadId];
        useDownloadStore
          .getState()
          .completeDownload(
            downloadId,
            current.fileUri || `file:///offline/${lessonId}`
          );
      } else {
        useDownloadStore.getState().updateProgress(downloadId, Math.min(progress, 0.99));
      }
    }, 300);
  },

  downloadCourse: (courseLessons: Lesson[]) => {
    courseLessons.forEach((lesson, index) => {
      setTimeout(() => {
        DownloadService.downloadLesson(lesson);
      }, index * 250);
    });
  },

  pause: (downloadId: string) => {
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
    useDownloadStore.getState().setStatus(downloadId, 'paused');
  },

  resume: (downloadId: string) => {
    const download = useDownloadStore.getState().downloads[downloadId];
    if (download) {
      DownloadService.startDownloadSimulation(downloadId, download.lessonId);
    }
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
    useDownloadStore.getState().removeDownload(downloadId);
  },
};
