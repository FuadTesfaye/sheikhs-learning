import { Lesson, LessonType } from '../types';
import { useDownloadStore } from '../store';

const activeIntervals: Record<string, ReturnType<typeof setInterval>> = {};

export const DownloadService = {
  downloadLesson: (lesson: Lesson, format: LessonType = lesson.type) => {
    const store = useDownloadStore.getState();
    const existing = store.getDownloadByLessonId(lesson.id);

    if (existing && existing.status === 'completed') {
      return;
    }

    const downloadId = `dl-${lesson.id}`;
    // Approximate file size: video ~45MB, audio ~12MB, pdf ~3MB
    const baseSize =
      format === 'video'
        ? 45 * 1024 * 1024
        : format === 'audio'
        ? 12 * 1024 * 1024
        : 3 * 1024 * 1024;

    store.addDownload({
      id: downloadId,
      lessonId: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      format,
      fileUri: `file:///data/user/0/com.sheikh.learning/files/${downloadId}.${format === 'pdf' ? 'pdf' : format === 'audio' ? 'mp3' : 'mp4'}`,
      fileSize: baseSize,
    });

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

      progress += 0.15 + Math.random() * 0.1;
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
    }, 400);
  },

  downloadCourse: (courseLessons: Lesson[]) => {
    courseLessons.forEach((lesson, index) => {
      setTimeout(() => {
        DownloadService.downloadLesson(lesson);
      }, index * 300);
    });
  },

  pause: (downloadId: string) => {
    if (activeIntervals[downloadId]) {
      clearInterval(activeIntervals[downloadId]);
      delete activeIntervals[downloadId];
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
    useDownloadStore.getState().removeDownload(downloadId);
  },
};
