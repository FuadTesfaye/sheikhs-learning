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
  {
    id: 'crs-1',
    categoryId: 'cat-1',
    title: 'Kitab At-Tawheed: Foundations of Aqeedah',
    description: 'The comprehensive classical study of Islamic monotheism (Tawheed), its reality, virtues, and protection against polytheism. Features 32 authentic audio lectures from the Sheikh with complete study text.',
    order: 1,
    thumbnailUrl: '',
    instructor: 'Sheikh',
    totalLessons: 32,
    level: 'Beginner',
  },
  { id: 'crs-2', categoryId: 'cat-1', title: 'Advanced Tawheed Studies', description: 'Deep dive into the categories of Tawheed and their implications.', order: 2, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 8, level: 'Advanced' },
  { id: 'crs-3', categoryId: 'cat-2', title: 'Tafsir of Surah Al-Fatiha', description: 'Detailed exegesis of the opening chapter of the Quran.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 6, level: 'Beginner' },
  { id: 'crs-4', categoryId: 'cat-2', title: 'Tafsir of Juz Amma', description: 'Explanation of the 30th part of the Quran, surah by surah.', order: 2, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 15, level: 'Intermediate' },
  { id: 'crs-5', categoryId: 'cat-3', title: '40 Hadith of Imam Nawawi', description: 'Study of the essential forty hadith collection with commentary.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 10, level: 'Beginner' },
  { id: 'crs-6', categoryId: 'cat-4', title: 'Fiqh of Salah', description: 'Complete guide to the rulings of prayer in Islam.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 8, level: 'Beginner' },
  { id: 'crs-7', categoryId: 'cat-5', title: 'Life of the Prophet ﷺ', description: 'The complete Seerah from birth to the farewell sermon.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 20, level: 'Beginner' },
  { id: 'crs-8', categoryId: 'cat-6', title: 'Arabic for Beginners', description: 'Learn the foundations of Arabic grammar - Nahu and Sarf.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 10, level: 'Beginner' },
  { id: 'crs-9', categoryId: 'cat-7', title: 'Tajweed Fundamentals', description: 'Master the rules of Quran recitation from Noon Sakinah to Madd.', order: 1, thumbnailUrl: '', instructor: 'Sheikh', totalLessons: 8, level: 'Beginner' },
];

const tawheedDurations = [
  3360, 1820, 1940, 2370, 1590, 1560, 1410, 2800, 2880, 1470,
  3450, 2350, 2550, 3010, 2030, 3720, 3100, 2820, 2110, 3330,
  3450, 430, 3680, 4240, 2940, 2120, 2650, 3610, 2270, 1440,
  3400, 2450,
];

const generateLessons = (courseId: string, count: number, type: 'video' | 'audio' | 'pdf' = 'audio'): Lesson[] => {
  const titles: Record<string, string[]> = {
    'crs-1': [
      'Lesson 1: Introduction & The Obligation of Tawheed',
      'Lesson 2: Virtues of Tawheed & Sins it Expiates',
      'Lesson 3: Realizing Tawheed and Entering Jannah without Reckoning',
      'Lesson 4: Fear of Falling into Shirk (Polytheism)',
      'Lesson 5: Calling to the Testimony: La ilaha illallah',
      'Lesson 6: Explanation of Tawheed and the Shahadah',
      'Lesson 7: Wearing Rings and Threads to Ward Off Harm',
      'Lesson 8: Ruqyah (Incantations), Amulets, and Superstitions',
      'Lesson 9: Seeking Blessings from Trees, Stones, and Relics',
      'Lesson 10: Slaughtering Sacrifices for Other than Allah',
      'Lesson 11: Taking Vows for Other than Allah',
      'Lesson 12: Seeking Refuge in Other than Allah',
      'Lesson 13: Seeking Deliverance from Other than Allah (Istighathah)',
      'Lesson 14: Associating Partners with Allah in Worship',
      'Lesson 15: The Angels Trembling at the Speech of Allah',
      'Lesson 16: Intercession (Shafa’ah) and Its Conditions',
      'Lesson 17: Guidance Belongs to Allah Alone',
      'Lesson 18: Exaggeration Regarding the Pious Leading to Disbelief',
      'Lesson 19: Severe Warning against Worshipping Allah at Graves',
      'Lesson 20: Extremism with the Graves of Righteous Men',
      'Lesson 21: Protecting Tawheed: Closing the Avenues to Shirk',
      'Lesson 22: Sorcery and Magic (Sihr) and Its Rulings',
      'Lesson 23: Types and Categorization of Magic',
      'Lesson 24: Diviners, Astrologers, and Soothsayers',
      'Lesson 25: Evil Omens and Superstitions (Tiyarah)',
      'Lesson 26: Astrology (Tanjeem) and the Influence of Stars',
      'Lesson 27: Seeking Rain through Constellations (Istisqa)',
      'Lesson 28: Sincere Love for Allah Alone',
      'Lesson 29: Pure Fear of Allah Alone',
      'Lesson 30: Sincere Trust and Reliance on Allah (Tawakkul)',
      'Lesson 31: Feeling Secure from Allah’s Plan and Despair of Mercy',
      'Lesson 32: Patience with the Decrees of Allah (Sabr ala Qadarillah)',
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
    const isTawheed = courseId === 'crs-1';

    // Real Cloudflare R2 audio & pdf for Kitab At-Tawheed
    const audioUrl = isTawheed
      ? getR2Url(`kitabu-tawhid/lesson-${lessonNum}.mp3`)
      : `https://example.com/media/${courseId}/lesson-${i + 1}.mp3`;

    // Real Cloudflare R2 PDF study text for Kitab At-Tawheed
    const pdfUrl = isTawheed && i === 0
      ? getR2Url('kitabu-tawhid/lesson-01.pdf')
      : (i % 5 === 4 ? `https://example.com/media/${courseId}/lesson-${i + 1}.pdf` : undefined);

    const calculatedDuration = isTawheed
      ? (tawheedDurations[i] || 1800)
      : (1200 + Math.floor(Math.random() * 1800));

    return {
      id: `${courseId}-les-${i + 1}`,
      courseId,
      title: titles[courseId]?.[i] || `Lesson ${i + 1}`,
      description: isTawheed
        ? `Comprehensive explanation of Kitab At-Tawheed Chapter ${i + 1} with authentic audio from the Sheikh.`
        : `Part ${i + 1} of the course series.`,
      duration: calculatedDuration,
      order: i + 1,
      type: isTawheed ? 'audio' : (i % 5 === 4 ? 'pdf' : (i % 3 === 2 ? 'audio' : type)),
      mediaUrl: audioUrl,
      audioOnlyUrl: audioUrl,
      pdfUrl,
      transcriptText: isTawheed
        ? 'Full classical study notes and textbook references for Kitab At-Tawheed.'
        : 'Transcript content will appear here when available.',
    };
  });
};

export const lessons: Lesson[] = [
  ...generateLessons('crs-1', 32),
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
