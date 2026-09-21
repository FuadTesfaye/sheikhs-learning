export interface WelcomeHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface WelcomeCategoryPreview {
  name: string;
  arabic: string;
  color: string;
}

export interface WelcomePillar {
  title: string;
  subtitle: string;
  icon: string;
}

export interface WelcomeSlide {
  id: 'sheikhs' | 'courses' | 'bunyan';
  badge: string;
  arabicBadge: string;
  icon: string;
  title: string;
  arabicQuote: string;
  quoteTranslation: string;
  description: string;
  highlightColor: string;
  accentColor: string;
  buttonLabel: string;
  nextStepTitle: string;
  highlights: WelcomeHighlight[];
  duaCard?: {
    tag: string;
    arabic: string;
    translation: string;
    buttonText: string;
    buttonActiveText: string;
  };
  curriculumCategories?: WelcomeCategoryPreview[];
  pillars?: WelcomePillar[];
}

export const welcomeSlides: WelcomeSlide[] = [
  {
    id: 'sheikhs',
    badge: 'Honoring the Sheikhs',
    arabicBadge: 'ادْعُوا لِلشَّيْخِ',
    icon: 'heart-circle-outline',
    title: 'The Sheikhs: Custodians of Sacred Knowledge',
    arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
    quoteTranslation: 'May Allah reward our teachers with the highest good, forgive them, and cause their sacred knowledge to benefit the Ummah.',
    description:
      'Sacred knowledge in Islam is an inherited trust, faithfully transmitted through dedicated scholars and sincere teachers. Every series, audio recording, and lesson hosted here honors the lifelong devotion of the Sheikhs who taught the Quran and Sunnah. We invite every seeker to pray for their continuous reward and elevated status.',
    highlightColor: '#1B5E20',
    accentColor: '#D4AF37',
    buttonLabel: 'Continue to The Courses',
    nextStepTitle: 'Next: The Courses',
    highlights: [
      {
        icon: 'ribbon-outline',
        title: 'Authentic Heritage',
        description: 'Sound scholarly understanding rooted in the Quran, authentic Sunnah, and classical consensus.',
      },
      {
        icon: 'archive-outline',
        title: 'Preserved & Faithful',
        description: 'Recorded lectures, study materials, and transcripts preserved without modification or interruption.',
      },
      {
        icon: 'heart-outline',
        title: 'Sincere Supplication',
        description: 'Upholding the student-teacher ethic by remembering the Sheikhs in our daily prayers.',
      },
    ],
    duaCard: {
      tag: 'A Sincere Prayer for the Sheikh',
      arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاجْعَلْ عِلْمَهُ صَدَقَةً جَارِيَةً',
      translation:
        'O Allah! Forgive him, have mercy upon him, grant him well-being, make his final abode honorable, and let his beneficial knowledge be an ongoing charity (Sadaqah Jariyah) benefiting him until the Day of Judgment.',
      buttonText: 'Say Ameen for the Sheikh',
      buttonActiveText: 'Ameen · جَزَاكَ ٱللَّٰهُ خَيْرًا',
    },
  },
  {
    id: 'courses',
    badge: 'Curriculum & Courses',
    arabicBadge: 'مَنَاهِجُ الدِّرَاسَةِ',
    icon: 'book-outline',
    title: 'Comprehensive Courses & Guided Paths',
    arabicQuote: '« مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ »',
    quoteTranslation: 'Whoever treads a path seeking knowledge, Allah makes easy for him a path to Paradise. (Sahih Muslim)',
    description:
      'Step into a structured educational curriculum spanning the foundational and advanced sciences of Islam. Each course is carefully organized into bite-sized lessons with audio, video, transcripts, and tracking so you can progress at your own pace.',
    highlightColor: '#0D47A1',
    accentColor: '#00ACC1',
    buttonLabel: 'Continue to Bunyan',
    nextStepTitle: 'Next: About Bunyan',
    highlights: [
      {
        icon: 'layers-outline',
        title: 'Step-by-Step Curricula',
        description: 'Progressive levels from beginner primers to intermediate and advanced classical texts.',
      },
      {
        icon: 'headset-outline',
        title: 'Audio & Video Anywhere',
        description: 'Seamless media playback designed for listening during commutes, daily routines, or focused study.',
      },
      {
        icon: 'cloud-download-outline',
        title: '100% Offline Study Mode',
        description: 'Download whole courses or individual lessons to study anytime without requiring an internet connection.',
      },
      {
        icon: 'checkmark-circle-outline',
        title: 'Smart Progress Tracking',
        description: 'Auto-saves playback positions and highlights completed lessons so you never lose your place.',
      },
    ],
    curriculumCategories: [
      { name: 'Aqeedah', arabic: 'عقيدة', color: '#1B5E20' },
      { name: 'Tafsir', arabic: 'تفسير', color: '#0D47A1' },
      { name: 'Hadith', arabic: 'حديث', color: '#BF360C' },
      { name: 'Fiqh', arabic: 'فقه', color: '#4A148C' },
      { name: 'Seerah', arabic: 'سيرة', color: '#006064' },
      { name: 'Arabic', arabic: 'نحو وصرف', color: '#E65100' },
    ],
  },
  {
    id: 'bunyan',
    badge: 'The Bunyan Platform',
    arabicBadge: 'مُبَادَرَةُ بُنْيَان',
    icon: 'layers-outline',
    title: 'Bunyan: A Digital Fortress of Knowledge',
    arabicQuote: '« الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا »',
    quoteTranslation: 'The believer to another believer is like a solid structure, each part strengthening the other. (Sahih al-Bukhari)',
    description:
      'Bunyan (بُنْيَان) is an independent non-profit digital initiative built to unite authentic Islamic scholarship with modern technology. Established purely as an open perpetual Waqf and continuous charity (Sadaqah Jariyah), Bunyan provides a clean, distraction-free sanctuary for Muslims around the world.',
    highlightColor: '#BF360C',
    accentColor: '#FF8F00',
    buttonLabel: 'Start Seeking Knowledge',
    nextStepTitle: 'Start Seeking Knowledge',
    highlights: [
      {
        icon: 'gift-outline',
        title: '100% Free · Sadaqah Jariyah',
        description: 'A perpetual Waqf for the Ummah with zero advertisements, paywalls, or subscriptions—ever.',
      },
      {
        icon: 'people-outline',
        title: 'Strengthening the Ummah',
        description: 'Built to empower individuals, families, and study circles with reliable knowledge.',
      },
      {
        icon: 'phone-portrait-outline',
        title: 'Universal Accessibility',
        description: 'Clean typography, adjustable font sizes, and dark mode for comfortable reading on any screen.',
      },
    ],
    pillars: [
      { title: 'Perpetual Waqf', subtitle: 'Zero monetization, 100% free', icon: 'sparkles-outline' },
      { title: 'Authentic Transmission', subtitle: 'Preserving sound knowledge', icon: 'shield-checkmark-outline' },
      { title: 'Digital Fortress', subtitle: 'Offline, secure & reliable', icon: 'server-outline' },
    ],
  },
];
