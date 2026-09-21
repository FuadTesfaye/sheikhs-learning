import { Category, Course, Lesson } from '../types';
import { getR2Url } from '../config/cloudflare';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Aqeedah', arabicName: 'عقيدة', description: 'Islamic Creed and Belief', icon: 'book', color: '#1B5E20', courseCount: 4 },
  { id: 'cat-2', name: 'Tafsir', arabicName: 'تفسير', description: 'Quranic Exegesis', icon: 'book-open', color: '#0D47A1', courseCount: 3 },
  { id: 'cat-3', name: 'Hadith', arabicName: 'حديث', description: 'Prophetic Traditions', icon: 'bookmark', color: '#BF360C', courseCount: 3 },
  { id: 'cat-4', name: 'Fiqh', arabicName: 'فقه', description: 'Islamic Jurisprudence', icon: 'scale', color: '#4A148C', courseCount: 2 },
  { id: 'cat-5', name: 'Seerah', arabicName: 'سيرة', description: 'Prophetic Biography', icon: 'clock', color: '#006064', courseCount: 2 },
  { id: 'cat-6', name: 'Arabic Grammar', arabicName: 'نحو وصرف', description: 'Nahu & Sarf', icon: 'type', color: '#E65100', courseCount: 2 },
  { id: 'cat-7', name: 'Tajweed', arabicName: 'تجويد', description: 'Quran Recitation Rules', icon: 'mic', color: '#880E4F', courseCount: 2 },
  { id: 'cat-8', name: 'Adab', arabicName: 'أدب', description: 'Islamic Ethics & Manners', icon: 'heart', color: '#1A237E', courseCount: 1 },
];

export const courses: Course[] = [
  { id: 'crs-1', categoryId: 'cat-1', title: 'Kitab At-Tawheed: Foundations of Aqeedah', description: 'The comprehensive foundational study of Islamic monotheism (Tawheed), its reality, virtues, and protection against polytheism.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 12, level: 'Beginner' },
  { id: 'crs-2', categoryId: 'cat-1', title: 'Advanced Tawheed Studies', description: 'Deep dive into the categories of Tawheed and their implications.', order: 2, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 8, level: 'Advanced' },
  { id: 'crs-3', categoryId: 'cat-2', title: 'Tafsir of Surah Al-Fatiha', description: 'Detailed exegesis of the opening chapter of the Quran.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 6, level: 'Beginner' },
  { id: 'crs-4', categoryId: 'cat-2', title: 'Tafsir of Juz Amma', description: 'Explanation of the 30th part of the Quran, surah by surah.', order: 2, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 15, level: 'Intermediate' },
  { id: 'crs-5', categoryId: 'cat-3', title: '40 Hadith of Imam Nawawi', description: 'Study of the essential forty hadith collection with commentary.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 10, level: 'Beginner' },
  { id: 'crs-6', categoryId: 'cat-4', title: 'Fiqh of Salah', description: 'Complete guide to the rulings of prayer in Islam.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 8, level: 'Beginner' },
  { id: 'crs-7', categoryId: 'cat-5', title: 'Life of the Prophet ﷺ', description: 'The complete Seerah from birth to the farewell sermon.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 20, level: 'Beginner' },
  { id: 'crs-8', categoryId: 'cat-6', title: 'Arabic for Beginners', description: 'Learn the foundations of Arabic grammar - Nahu and Sarf.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 10, level: 'Beginner' },
  { id: 'crs-9', categoryId: 'cat-7', title: 'Tajweed Fundamentals', description: 'Master the rules of Quran recitation from Noon Sakinah to Madd.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 8, level: 'Beginner' },
];

const generateLessons = (courseId: string, count: number, type: 'video' | 'audio' | 'pdf' = 'audio'): Lesson[] => {
  const titles: Record<string, string[]> = {
    'crs-1': [
      'Introduction to Kitab At-Tawheed',
      'The Obligation of Tawheed and Its Virtues',
      'Whoever Purifies Tawheed Enters Paradise without Reckoning',
      'Fear of Shirk (Associating Partners with Allah)',
      'The Call to the Testimony of La ilaha illallah',
      'Explanation of Tawheed and the Shahadah',
      'Ruqyah, Amulets, and Superstitions',
      'Seeking Blessings from Trees, Stones, and Relics',
      'Slaughtering for Other than Allah',
      'Vows and Seeking Refuge in Other than Allah',
      'Intercession (Shafa’ah) and Its Categories',
      'Summary and Review of Foundations',
    ],
    'crs-3': [
      'Introduction to Al-Fatiha',
      'Bismillah ir-Rahman ir-Raheem',
      'Alhamdulillahi Rabbil Alameen',
      'Ar-Rahman Ar-Raheem',
      'Maliki Yawm id-Deen',
      'Iyyaka Na\'budu wa Iyyaka Nasta\'een',
    ],
    'crs-5': [
      'Hadith 1: Actions by Intentions',
      'Hadith 2: Hadith of Jibreel',
      'Hadith 3: Pillars of Islam',
      'Hadith 4: Stages of Creation',
      'Hadith 5: Rejection of Innovations',
      'Hadith 6: The Halal and Haram',
      'Hadith 7: The Religion is Advice',
      'Hadith 8: Sanctity of a Muslim',
      'Hadith 9: Obligations within Capacity',
      'Hadith 10: Wholesome Earnings',
    ],
  };

  return Array.from({ length: count }, (_, i) => {
    const lessonNum = String(i + 1).padStart(2, '0');
    // Real Cloudflare R2 audio & pdf for Kitab At-Tawheed
    const isTawheed = courseId === 'crs-1';
    const audioUrl = isTawheed
      ? getR2Url(`kitabu-tawhid/lesson-${lessonNum}.mp3`)
      : `https://example.com/media/${courseId}/lesson-${i + 1}.mp3`;
    const pdfUrl = isTawheed && i === 0
      ? getR2Url('kitabu-tawhid/lesson-01.pdf')
      : (i % 5 === 4 ? `https://example.com/media/${courseId}/lesson-${i + 1}.pdf` : undefined);

    return {
      id: `${courseId}-les-${i + 1}`,
      courseId,
      title: titles[courseId]?.[i] || `Lesson ${i + 1}`,
      description: isTawheed
        ? `Comprehensive explanation of Kitab At-Tawheed lesson ${i + 1} with authentic audio from the Sheikh.`
        : `Part ${i + 1} of the course series.`,
      duration: isTawheed ? (i === 0 ? 3360 : 1800 + (i * 120)) : (1200 + Math.floor(Math.random() * 1800)),
      order: i + 1,
      type: isTawheed ? 'audio' : (i % 5 === 4 ? 'pdf' : (i % 3 === 2 ? 'audio' : type)),
      mediaUrl: audioUrl,
      audioOnlyUrl: audioUrl,
      pdfUrl,
      transcriptText: isTawheed
        ? 'Full transcription and study notes for Kitab At-Tawheed.'
        : 'Transcript content will appear here when available.',
    };
  });
};

export const lessons: Lesson[] = [
  ...generateLessons('crs-1', 12),
  ...generateLessons('crs-2', 8),
  ...generateLessons('crs-3', 6),
  ...generateLessons('crs-4', 15),
  ...generateLessons('crs-5', 10),
  ...generateLessons('crs-6', 8),
  ...generateLessons('crs-7', 20),
  ...generateLessons('crs-8', 10),
  ...generateLessons('crs-9', 8),
];

export const getCoursesByCategory = (categoryId: string): Course[] =>
  courses.filter(c => c.categoryId === categoryId);

export const getLessonsByCourse = (courseId: string): Lesson[] =>
  lessons.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);

export const getCourseById = (courseId: string): Course | undefined =>
  courses.find(c => c.id === courseId);

export const getLessonById = (lessonId: string): Lesson | undefined =>
  lessons.find(l => l.id === lessonId);

export const getCategoryById = (categoryId: string): Category | undefined =>
  categories.find(c => c.id === categoryId);
