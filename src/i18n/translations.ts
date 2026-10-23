import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  // Common & Tabs
  tabs: {
    home: string;
    search: string;
    downloads: string;
    bookmarks: string;
    settings: string;
  };
  common: {
    cancel: string;
    clear: string;
    clearAll: string;
    confirm: string;
    back: string;
    retry: string;
    done: string;
    saved: string;
    download: string;
    share: string;
    lessons: string;
    lessonsCount: (count: number) => string;
    formatBytes: (bytes: number) => string;
  };
  home: {
    greeting: string;
    appTitle: string;
    bunyanBannerTitle: string;
    bunyanBannerSubtitle: string;
    continueLearning: string;
    categories: string;
    featuredCourses: string;
    remainingTime: (timeStr: string) => string;
  };
  categories: Record<string, { name: string; description: string }>;
  course: {
    author: string;
    level: {
      Beginner: string;
      Intermediate: string;
      Advanced: string;
    };
    downloadAll: string;
    downloadAllPrompt: (count: number) => string;
    downloadsStartedTitle: string;
    downloadsStartedMsg: (count: number) => string;
    prepNotice: string;
    lessonsHeader: string;
    notFoundTitle: string;
    notFoundDesc: string;
    noLessonsTitle: string;
    noLessonsDesc: string;
  };
  lesson: {
    pdfTab: string;
    notesTab: string;
    summaryHeader: string;
    pdfNoticeText: string;
    studyNotesHeader: string;
    downloadAudio: string;
    audioDownloading: string;
    audioSaved: string;
    downloadPdf: string;
    pdfDownloading: string;
    pdfSaved: string;
    prevLesson: (order: number) => string;
    nextLesson: (order: number) => string;
    offlineSource: string;
    onlineSource: string;
    notFound: string;
    pageOneLoading: string;
  };
  downloads: {
    title: string;
    storageInfo: (used: string) => string;
    clearAlertTitle: string;
    clearAlertDesc: string;
    offlineBanner: string;
    status: {
      downloading: string;
      paused: string;
      waiting_for_internet: string;
      completed: string;
      failed: string;
      pending: string;
    };
    format: {
      audio: string;
      pdf: string;
    };
    emptyTitle: string;
    emptySubtitle: string;
  };
  bookmarks: {
    title: string;
    savedCount: (count: number) => string;
    emptyTitle: string;
    emptySubtitle: string;
  };
  search: {
    title: string;
    inputPlaceholder: string;
    emptyQueryTitle: string;
    emptyQuerySubtitle: string;
    noResultsTitle: string;
    noResultsSubtitle: (q: string) => string;
    lessonAudioBadge: string;
    lessonPdfBadge: string;
  };
  settings: {
    title: string;
    appearance: string;
    theme: string;
    themeModes: {
      light: string;
      dark: string;
      system: string;
    };
    textSize: string;
    textSizes: {
      small: string;
      medium: string;
      large: string;
    };
    previewText: string;
    language: string;
    languages: {
      ar: string;
      en: string;
      am: string;
      om: string;
    };
    storage: string;
    audioStorage: string;
    pdfStorage: string;
    totalStorage: string;
    clearCacheBtn: string;
    clearCacheSuccessTitle: string;
    clearCacheSuccessDesc: string;
    general: string;
    aboutMenu: string;
    adminMenu: string;
    walkthroughMenu: string;
    clearAllData: string;
    clearDataConfirmTitle: string;
    clearDataConfirmDesc: string;
    aboutSection: string;
    version: string;
    content: string;
    contentFree: string;
    privacy: string;
    privacyText: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  // ==========================================
  // 1. ARABIC (العربية)
  // ==========================================
  ar: {
    tabs: {
      home: 'الرئيسية',
      search: 'البحث',
      downloads: 'التحميلات',
      bookmarks: 'المحفوظات',
      settings: 'الإعدادات',
    },
    common: {
      cancel: 'إلغاء',
      clear: 'مسح',
      clearAll: 'مسح الكل',
      confirm: 'تأكيد',
      back: 'رجوع',
      retry: 'إعادة المحاولة',
      done: 'تم',
      saved: 'تم الحفظ',
      download: 'تحميل',
      share: 'مشاركة',
      lessons: 'دروس',
      lessonsCount: count => (count <= 10 ? `${count} دروس` : `${count} درساً`),
      formatBytes: bytes => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
      },
    },
    home: {
      greeting: 'السلام عليكم ورحمة الله',
      appTitle: 'تعليم الشيخ',
      bunyanBannerTitle: 'مبادرة بُنْيَان · ادْعُوا لِلشَّيْخِ',
      bunyanBannerSubtitle: 'ادعوا للشيخ واكتشف رسالة مبادرة بنيان في نشر العلم',
      continueLearning: 'متابعة التعلم',
      categories: 'الأقسام العلمية',
      featuredCourses: 'المتون والكتب المختارة',
      remainingTime: timeStr => `متبقي ${timeStr}`,
    },
    categories: {
      'cat-1': { name: 'العقيدة', description: 'أصول الإيمان والتوحيد الخالص' },
      'cat-2': { name: 'التفسير', description: 'تفسير القرآن الكريم وبيان معانيه' },
      'cat-3': { name: 'الحديث', description: 'السنة النبوية والأحاديث الشريفة' },
      'cat-4': { name: 'الفقه', description: 'الأحكام الشرعية والعبادات' },
      'cat-5': { name: 'السيرة', description: 'سيرة النبي ﷺ وهديه المبارك' },
      'cat-6': { name: 'اللغة العربية', description: 'قواعد النحو والصرف وفهم اللسان' },
      'cat-7': { name: 'التجويد', description: 'أحكام تلاوة القرآن ومخارج الحروف' },
      'cat-8': { name: 'الآداب والأخلاق', description: 'آداب طالب العلم وتزكية النفس' },
    },
    course: {
      author: 'المؤلف',
      level: {
        Beginner: 'مبتدئ',
        Intermediate: 'متوسط',
        Advanced: 'متقدم',
      },
      downloadAll: 'تحميل جميع الدروس المتاحة',
      downloadAllPrompt: count => `هل ترغب في تحميل ${count} درساً للاستماع دون اتصال؟`,
      downloadsStartedTitle: 'بدأ التحميل',
      downloadsStartedMsg: count => `جاري تحميل ${count} درساً في الخلفية. يمكنك متابعة التقدم في تبويب التحميلات.`,
      prepNotice: 'المنهج الدراسي معتمد ومكتمل. التسجيلات الصوتية قيد الإعداد والمراجعة.',
      lessonsHeader: 'فهرس الأبواب والدروس',
      notFoundTitle: 'الكتاب غير موجود',
      notFoundDesc: 'ربما تم نقل هذا الكتاب أو تعديل مساره.',
      noLessonsTitle: 'لا توجد دروس حالياً',
      noLessonsDesc: 'سيتم إضافة الفهرس قريباً بإذن الله.',
    },
    lesson: {
      pdfTab: 'متن الكتاب (PDF)',
      notesTab: 'نظرة عامة والفوائد',
      summaryHeader: 'ملخص الدرس والشرح',
      pdfNoticeText: 'يتوفر مع هذا الدرس متن دراسي PDF. اضغط للاطلاع عليه.',
      studyNotesHeader: 'الفوائد والتعليقات المعتمدة',
      downloadAudio: 'تحميل الصوت',
      audioDownloading: 'جاري التحميل...',
      audioSaved: 'تم حفظ الصوت',
      downloadPdf: 'تحميل PDF',
      pdfDownloading: 'جاري الحفظ...',
      pdfSaved: 'تم حفظ الكتاب',
      prevLesson: order => `السابق: الدرس ${order}`,
      nextLesson: order => `التالي: الدرس ${order}`,
      offlineSource: 'مساحة التخزين المحلية (دون اتصال)',
      onlineSource: 'بث صوتي مباشر (R2 Audio)',
      notFound: 'الدرس غير موجود',
      pageOneLoading: 'جاري فتح الصفحة الأولى...',
    },
    downloads: {
      title: 'التحميلات',
      storageInfo: used => `${used} مستخدم · متاح للقراءة والاستماع دون اتصال`,
      clearAlertTitle: 'حذف جميع التحميلات',
      clearAlertDesc: 'سيؤدي هذا إلى مسح الملفات المحفوظة محلياً من جهازك. يمكنك إعادة تحميلها في أي وقت.',
      offlineBanner: 'أنت غير متصل بالإنترنت حالياً. تم حفظ تقدم التحميل وسيمكنك الاستئناف فور عودة الاتصال.',
      status: {
        downloading: 'جاري التحميل',
        paused: 'مؤقت',
        waiting_for_internet: 'في انتظار الاتصال',
        completed: 'تم الحفظ',
        failed: 'تعذر التحميل',
        pending: 'قيد الانتظار',
      },
      format: {
        audio: 'صوتي (MP3)',
        pdf: 'كتاب (PDF)',
      },
      emptyTitle: 'لا توجد تحميلات',
      emptySubtitle: 'قم بتحميل الدروس والكتب لقراءتها والاستماع إليها دون الحاجة للاتصال بالإنترنت.',
    },
    bookmarks: {
      title: 'المحفوظات',
      savedCount: count => `${count} درس محفوظ`,
      emptyTitle: 'لا توجد محفوظات',
      emptySubtitle: 'اضغط على رمز الحفظ في أي درس لتتمكن من الوصول إليه سريعاً من هنا.',
    },
    search: {
      title: 'البحث',
      inputPlaceholder: 'ابحث عن كتاب، باب، أو موضوع...',
      emptyQueryTitle: 'البحث في المكتبة',
      emptyQuerySubtitle: 'اكتب حرفين أو أكثر للبحث في جميع الكتب والأبواب والدروس',
      noResultsTitle: 'لا توجد نتائج',
      noResultsSubtitle: q => `لم نجد نتائج مطابقة لـ "${q}"`,
      lessonAudioBadge: 'درس صوتي',
      lessonPdfBadge: 'كتاب PDF',
    },
    settings: {
      title: 'الإعدادات',
      appearance: 'المظهر',
      theme: 'نمط العرض',
      themeModes: {
        light: 'فاتح',
        dark: 'داكن',
        system: 'النظام',
      },
      textSize: 'حجم الخط',
      textSizes: {
        small: 'صغير',
        medium: 'متوسط',
        large: 'كبير',
      },
      previewText: 'معاينة حجم الخط الحالي. يمكنك ضبطه بما يناسب راحتك في القراءة.',
      language: 'اللغة (Language)',
      languages: {
        ar: 'العربية (Arabic)',
        en: 'English (الإنجليزية)',
        am: 'አማርኛ (Amharic)',
        om: 'Afaan Oromoo (الأورومية)',
      },
      storage: 'إدارة المساحة والذاكرة (Storage)',
      audioStorage: 'الدروس الصوتية المحفوظة (Audio)',
      pdfStorage: 'الكتب ومتون الدراسة (PDF)',
      totalStorage: 'إجمالي المساحة المستخدمة',
      clearCacheBtn: 'تنظيف الذاكرة المؤقتة (Clear Cache)',
      clearCacheSuccessTitle: 'تم تنظيف الذاكرة المؤقتة',
      clearCacheSuccessDesc: 'تم تفريغ الملفات المؤقتة بنجاح مع الحفاظ الكامل على كتبك ودروسك المحفوظة دون اتصال.',
      general: 'عام',
      aboutMenu: 'عن مبادرة بنيان والمشايخ',
      adminMenu: 'بوابة إحصائيات الإدارة',
      walkthroughMenu: 'جولة الترحيب التعريفية',
      clearAllData: 'مسح جميع البيانات',
      clearDataConfirmTitle: 'مسح جميع البيانات',
      clearDataConfirmDesc: 'سيؤدي هذا إلى إعادة تعيين تقدم التعلم والمحفوظات والتحميلات. لا يمكن التراجع عن هذا الإجراء.',
      aboutSection: 'حول التطبيق',
      version: 'الإصدار',
      content: 'المحتوى',
      contentFree: 'مجاني 100% وبلا إعلانات',
      privacy: 'الخصوصية',
      privacyText: 'لا تتم مشاركة أي بيانات شخصية',
    },
  },

  // ==========================================
  // 2. ENGLISH
  // ==========================================
  en: {
    tabs: {
      home: 'Home',
      search: 'Search',
      downloads: 'Downloads',
      bookmarks: 'Bookmarks',
      settings: 'Settings',
    },
    common: {
      cancel: 'Cancel',
      clear: 'Clear',
      clearAll: 'Clear All',
      confirm: 'Confirm',
      back: 'Back',
      retry: 'Retry',
      done: 'Done',
      saved: 'Saved',
      download: 'Download',
      share: 'Share',
      lessons: 'lessons',
      lessonsCount: count => `${count} lessons`,
      formatBytes: bytes => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
      },
    },
    home: {
      greeting: 'Assalamu Alaikum wa Rahmatullah',
      appTitle: "Sheikh's Learning",
      bunyanBannerTitle: 'The Bunyan Initiative · Pray for the Sheikh',
      bunyanBannerSubtitle: 'Pray for the Sheikh & discover the Bunyan mission in spreading Islamic knowledge',
      continueLearning: 'Continue Learning',
      categories: 'Curriculum Categories',
      featuredCourses: 'Featured Classical Kitabs',
      remainingTime: timeStr => `${timeStr} left`,
    },
    categories: {
      'cat-1': { name: 'Aqeedah', description: 'Islamic Creed and Pure Monotheism' },
      'cat-2': { name: 'Tafsir', description: 'Quranic Exegesis and Meanings' },
      'cat-3': { name: 'Hadith', description: 'Prophetic Traditions and Teachings' },
      'cat-4': { name: 'Fiqh', description: 'Islamic Jurisprudence and Worship' },
      'cat-5': { name: 'Seerah', description: 'Prophetic Biography and Guidance' },
      'cat-6': { name: 'Arabic Grammar', description: 'Nahu, Sarf and Arabic Language' },
      'cat-7': { name: 'Tajweed', description: 'Quran Recitation and Articulation Rules' },
      'cat-8': { name: 'Adab & Ethics', description: 'Student Manners and Soul Purification' },
    },
    course: {
      author: 'Author',
      level: {
        Beginner: 'Beginner',
        Intermediate: 'Intermediate',
        Advanced: 'Advanced',
      },
      downloadAll: 'Download All Lessons',
      downloadAllPrompt: count => `Download all ${count} lessons for offline listening?`,
      downloadsStartedTitle: 'Downloads Started',
      downloadsStartedMsg: count => `${count} lessons are downloading in the background. Track them in the Downloads tab.`,
      prepNotice: 'Curriculum is verified and complete. Audio lectures are in preparation.',
      lessonsHeader: 'Table of Contents & Chapters',
      notFoundTitle: 'Course Not Found',
      notFoundDesc: 'This course may have been relocated or updated.',
      noLessonsTitle: 'No Lessons Yet',
      noLessonsDesc: 'Lessons will be added soon inshaAllah.',
    },
    lesson: {
      pdfTab: 'Study Text (PDF)',
      notesTab: 'Overview & Commentary',
      summaryHeader: 'Lesson Summary & Commentary',
      pdfNoticeText: 'This lesson includes a study PDF text. Tap to view.',
      studyNotesHeader: 'Verified Study Notes & References',
      downloadAudio: 'Download Audio',
      audioDownloading: 'Downloading...',
      audioSaved: 'Audio Saved',
      downloadPdf: 'Download PDF',
      pdfDownloading: 'Saving...',
      pdfSaved: 'PDF Saved',
      prevLesson: order => `Previous: Lesson ${order}`,
      nextLesson: order => `Next: Lesson ${order}`,
      offlineSource: 'Offline Local Storage',
      onlineSource: 'Cloudflare R2 Streaming',
      notFound: 'Lesson not found',
      pageOneLoading: 'Loading Page 1...',
    },
    downloads: {
      title: 'Downloads',
      storageInfo: used => `${used} used · Ready for offline reading and listening`,
      clearAlertTitle: 'Clear All Downloads',
      clearAlertDesc: 'This will remove all downloaded files from your device. You can re-download anytime.',
      offlineBanner: 'You are currently offline. Download progress is preserved and will resume once connected.',
      status: {
        downloading: 'Downloading',
        paused: 'Paused',
        waiting_for_internet: 'Waiting for internet',
        completed: 'Downloaded',
        failed: 'Failed',
        pending: 'Pending',
      },
      format: {
        audio: 'Audio (MP3)',
        pdf: 'Book (PDF)',
      },
      emptyTitle: 'No Downloads',
      emptySubtitle: 'Download lessons and books to access them offline without internet connectivity.',
    },
    bookmarks: {
      title: 'Bookmarks',
      savedCount: count => `${count} saved lessons`,
      emptyTitle: 'No Bookmarks Yet',
      emptySubtitle: 'Tap the bookmark icon on any lesson to save it here for fast access.',
    },
    search: {
      title: 'Search',
      inputPlaceholder: 'Search books, lessons, chapters...',
      emptyQueryTitle: 'Search Library',
      emptyQuerySubtitle: 'Type 2 or more characters to search across all kitabs and lessons',
      noResultsTitle: 'No Results',
      noResultsSubtitle: q => `No matches found for "${q}"`,
      lessonAudioBadge: 'Audio Lesson',
      lessonPdfBadge: 'PDF Book',
    },
    settings: {
      title: 'Settings',
      appearance: 'APPEARANCE',
      theme: 'Theme',
      themeModes: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
      textSize: 'TEXT SIZE',
      textSizes: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
      },
      previewText: 'This is a preview of the current text size. Adjust to your reading preference.',
      language: 'LANGUAGE (اللغة)',
      languages: {
        ar: 'العربية (Arabic)',
        en: 'English',
        am: 'አማርኛ (Amharic)',
        om: 'Afaan Oromoo',
      },
      storage: 'STORAGE & CACHE',
      audioStorage: 'Downloaded Audio Lectures',
      pdfStorage: 'Downloaded Study Books (PDF)',
      totalStorage: 'Total Storage Used',
      clearCacheBtn: 'Clear Temp Cache',
      clearCacheSuccessTitle: 'Cache Cleared',
      clearCacheSuccessDesc: 'Temporary cache cleared successfully without affecting your offline downloads.',
      general: 'GENERAL',
      aboutMenu: 'About (Sheikhs, Courses & Bunyan)',
      adminMenu: 'Admin Analytics Portal',
      walkthroughMenu: 'Welcome Walkthrough (3 Pages)',
      clearAllData: 'Clear All Data',
      clearDataConfirmTitle: 'Clear All Data',
      clearDataConfirmDesc: 'This will reset all progress, bookmarks, and downloads. This action cannot be undone.',
      aboutSection: 'ABOUT',
      version: 'Version',
      content: 'Content',
      contentFree: '100% Free & Ad-Free',
      privacy: 'Privacy',
      privacyText: 'No personal data collected or shared',
    },
  },

  // ==========================================
  // 3. AMHARIC (አማርኛ)
  // ==========================================
  am: {
    tabs: {
      home: 'መነሻ',
      search: 'ፍለጋ',
      downloads: 'የወረዱ',
      bookmarks: 'የተቀመጡ',
      settings: 'ቅንብሮች',
    },
    common: {
      cancel: 'ሰርዝ',
      clear: 'አጽዳ',
      clearAll: 'ሁሉንም አጥፋ',
      confirm: 'አረጋግጥ',
      back: 'ተመለስ',
      retry: 'እንደገና ሞክር',
      done: 'ተከናውኗል',
      saved: 'ተቀምጧል',
      download: 'አውርድ',
      share: 'አጋራ',
      lessons: 'ትምህርቶች',
      lessonsCount: count => `${count} ትምህርቶች`,
      formatBytes: bytes => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
      },
    },
    home: {
      greeting: 'አሰላሙ አለይኩም ወረሕመቱላህ',
      appTitle: 'የሼኩ የትምህርት መድረክ',
      bunyanBannerTitle: 'የቡንያን ተነሳሽነት · ለሼኩ ዱዓ ያድርጉ',
      bunyanBannerSubtitle: 'ለሼኩ ዱዓ ያድርጉ እና የቡንያንን የእውቀት ስርጭት ተልዕኮ ይወቁ',
      continueLearning: 'ትምህርቱን ይቀጥሉ',
      categories: 'የትምህርት ክፍሎች',
      featuredCourses: 'ተመራጭ የኪታብ ትምህርቶች',
      remainingTime: timeStr => `${timeStr} ቀርቷል`,
    },
    categories: {
      'cat-1': { name: 'አቂዳ (የእምነት መሠረት)', description: 'የተወሂድ እና የትክክለኛ እምነት መሠረቶች' },
      'cat-2': { name: 'ተፍሲር', description: 'የቅዱስ ቁርኣን ማብራሪያ እና ትርጓሜ' },
      'cat-3': { name: 'ሐዲስ', description: 'የነቢዩ ﷺ ትምህርቶችና ንግግሮች' },
      'cat-4': { name: 'ፊቅህ', description: 'የኢስላማዊ ህግጋትና አምልኮት ደንቦች' },
      'cat-5': { name: 'ሲራ (የነቢዩ ታሪክ)', description: 'የነቢዩ ሙሐመድ ﷺ የህይወት ታሪክ' },
      'cat-6': { name: 'አረብኛ ሰዋሰው', description: 'የነህው እና የሰርፍ ህጎች' },
      'cat-7': { name: 'ተጅዊድ', description: 'የቁርኣን ንባብ እና አነባበብ ህጎች' },
      'cat-8': { name: 'አደብ እና ስነ-ምግባር', description: 'የእውቀት ፈላጊ ስነ-ምግባር እና ፀባይ' },
    },
    course: {
      author: 'ደራሲ',
      level: {
        Beginner: 'ጀማሪ',
        Intermediate: 'መካከለኛ',
        Advanced: 'ከፍተኛ',
      },
      downloadAll: 'ሁሉንም ትምህርቶች አውርድ',
      downloadAllPrompt: count => `ሁሉንም ${count} ትምህርቶች ያለ ኢንተርኔት ለማዳመጥ ማውረድ ይፈልጋሉ?`,
      downloadsStartedTitle: 'ማውረድ ተጀምሯል',
      downloadsStartedMsg: count => `${count} ትምህርቶች በስተጀርባ እየወረዱ ነው። በ«የወረዱ» ገጽ ላይ መከታተል ይችላሉ።`,
      prepNotice: 'ስርዓተ-ትምህርቱ የተረጋገጠና የተሟላ ነው። የድምጽ ቅጂዎች በዝግጅት ላይ ናቸው።',
      lessonsHeader: 'የትምህርቶች ማውጫ እና ምዕራፎች',
      notFoundTitle: 'ኪታቡ አልተገኘም',
      notFoundDesc: 'ይህ ኪታብ ተሰርዟል ወይም አድራሻው ተቀይሯል።',
      noLessonsTitle: 'ምንም ትምህርት የለም',
      noLessonsDesc: 'ትምህርቶች በቅርቡ ይጨመራሉ ኢንሻአላህ።',
    },
    lesson: {
      pdfTab: 'የኪታቡ ጽሑፍ (PDF)',
      notesTab: 'አጠቃላይ እይታ እና ማብራሪያ',
      summaryHeader: 'የትምህርቱ ማጠቃለያና ማብራሪያ',
      pdfNoticeText: 'ይህ ትምህርት አብሮት የሚነበብ PDF ኪታብ አለው። ለማየት ይጫኑ።',
      studyNotesHeader: 'የተረጋገጡ የትምህርት ማስታወሻዎች',
      downloadAudio: 'ድምጽ አውርድ',
      audioDownloading: 'በማውረድ ላይ...',
      audioSaved: 'ድምጹ ወርዷል',
      downloadPdf: 'PDF አውርድ',
      pdfDownloading: 'በመቀመጥ ላይ...',
      pdfSaved: 'PDF ወርዷል',
      prevLesson: order => `ቀዳሚ: ትምህርት ${order}`,
      nextLesson: order => `ቀጣይ: ትምህርት ${order}`,
      offlineSource: 'ከስልኩ ማከማቻ (ያለ ኢንተርኔት)',
      onlineSource: 'የቀጥታ ስርጭት (R2 Audio)',
      notFound: 'ትምህርቱ አልተገኘም',
      pageOneLoading: 'ገጽ 1 እየተከፈተ ነው...',
    },
    downloads: {
      title: 'የወረዱ ፋይሎች',
      storageInfo: used => `${used} ጥቅም ላይ ውሏል · ያለ ኢንተርኔት ለማንበብና ለማዳመጥ ዝግጁ`,
      clearAlertTitle: 'ሁሉንም የወረዱ አጥፋ',
      clearAlertDesc: 'ይህ የወረዱትን ፋይሎች በሙሉ ከስልክዎ ያጠፋል። በማንኛውም ጊዜ እንደገና ማውረድ ይችላሉ።',
      offlineBanner: 'በአሁኑ ሰዓት ከኢንተርኔት ውጭ ነዎት። የወረደው መጠን ተቀምጧል፤ ኢንተርኔት ሲመለስ ይቀጥላል።',
      status: {
        downloading: 'በማውረድ ላይ',
        paused: 'ለጊዜው የቆመ',
        waiting_for_internet: 'ኢንተርኔት በመጠበቅ ላይ',
        completed: 'ወርዷል',
        failed: 'አልተሳካም',
        pending: 'በመጠባበቅ ላይ',
      },
      format: {
        audio: 'የድምጽ ፋይል (MP3)',
        pdf: 'ኪታብ (PDF)',
      },
      emptyTitle: 'ምንም የወረደ ፋይል የለም',
      emptySubtitle: 'ያለ ኢንተርኔት ለማዳመጥና ለማንበብ ትምህርቶችንና ኪታቦችን ያውርዱ።',
    },
    bookmarks: {
      title: 'የተቀመጡ ማስታወሻዎች',
      savedCount: count => `${count} የተቀመጡ ትምህርቶች`,
      emptyTitle: 'ምንም የተቀመጠ የለም',
      emptySubtitle: 'በማንኛውም ትምህርት ላይ የማስቀመጫ ምልክቱን በመጫን በቀላሉ እዚህ ያግኙት።',
    },
    search: {
      title: 'ፍለጋ',
      inputPlaceholder: 'ኪታብ፣ ምዕራፍ ወይም ርዕስ ይፈልጉ...',
      emptyQueryTitle: 'በመጽሐፍት ማዕከል ውስጥ ይፈልጉ',
      emptyQuerySubtitle: 'ሁሉንም ኪታቦችና ትምህርቶች ለመፈለግ 2 ወይም ከዚያ በላይ ፊደላትን ይጻፉ',
      noResultsTitle: 'ምንም ውጤት አልተገኘም',
      noResultsSubtitle: q => `ለ "${q}" ምንም ተዛማጅ አልተገኘም`,
      lessonAudioBadge: 'የድምጽ ትምህርት',
      lessonPdfBadge: 'የPDF ኪታብ',
    },
    settings: {
      title: 'ቅንብሮች',
      appearance: 'መልክ እና ገጽታ',
      theme: 'የቀለም ገጽታ',
      themeModes: {
        light: 'ነጭ (ቀን)',
        dark: 'ጥቁር (ማታ)',
        system: 'የስልኩ ምርጫ',
      },
      textSize: 'የጽሑፍ መጠን',
      textSizes: {
        small: 'ትንሽ',
        medium: 'መካከለኛ',
        large: 'ትልቅ',
      },
      previewText: 'ይህ የአሁኑ የጽሑፍ መጠን ማሳያ ነው። ለንባብዎ ምቹ በሆነ መጠን ያስተካክሉ።',
      language: 'ቋንቋ (Language)',
      languages: {
        ar: 'العربية (ዓረብኛ)',
        en: 'English (እንግሊዝኛ)',
        am: 'አማርኛ',
        om: 'Afaan Oromoo (ኦሮምኛ)',
      },
      storage: 'የማከማቻ እና ካሽ አስተዳደር (Storage)',
      audioStorage: 'የወረዱ የድምጽ ትምህርቶች',
      pdfStorage: 'የወረዱ የኪታብ መጽሐፍት (PDF)',
      totalStorage: 'አጠቃላይ ጥቅም ላይ የዋለ ቦታ',
      clearCacheBtn: 'ጊዜያዊ ፋይሎችን አጽዳ (Clear Cache)',
      clearCacheSuccessTitle: 'ካሽ ተጠርጓል',
      clearCacheSuccessDesc: 'የወረዱ ኪታቦችዎ ሳይነኩ ጊዜያዊ ፋይሎች በተሳካ ሁኔታ ተጠርገዋል።',
      general: 'አጠቃላይ',
      aboutMenu: 'ስለ ቡንያን እና ስለ ሼኮች',
      adminMenu: 'የአስተዳዳሪ ስታቲስቲክስ',
      walkthroughMenu: 'የእንኳን ደህና መጡ ገለጻ (3 ገጾች)',
      clearAllData: 'ሁሉንም መረጃ አጥፋ',
      clearDataConfirmTitle: 'ሁሉንም ዳታ አጥፋ',
      clearDataConfirmDesc: 'ይህ የመማር ሂደትዎን፣ የተቀመጡትንና የወረዱትን ሁሉ ያጠፋል። ይህን እርምጃ መመለስ አይቻልም።',
      aboutSection: 'ስለ መተግበሪያው',
      version: 'ስሪት',
      content: 'ይዘት',
      contentFree: '100% ነፃ እና ከማስታወቂያ የጸዳ',
      privacy: 'ግላዊነት',
      privacyText: 'ምንም የግል መረጃ አይሰበሰብም',
    },
  },

  // ==========================================
  // 4. AFAAN OROMOO (Oromic)
  // ==========================================
  om: {
    tabs: {
      home: 'Fuula Duraa',
      search: 'Barbaadi',
      downloads: 'Waraabbilee',
      bookmarks: 'Mallattoolee',
      settings: "Qindaa'ina",
    },
    common: {
      cancel: 'Dhiisi',
      clear: 'Qulqulleessi',
      clearAll: 'Hunda Haqaa',
      confirm: 'Mirkaneessi',
      back: 'Duubatti',
      retry: 'Irra Deebi\'ii Yaali',
      done: 'Xumurameera',
      saved: 'Qusatameera',
      download: 'Buusi',
      share: 'Qoodi',
      lessons: 'barnoota',
      lessonsCount: count => `Barnoota ${count}`,
      formatBytes: bytes => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
      },
    },
    home: {
      greeting: 'Assalaamu Aleykum wa Rahmatullaah',
      appTitle: 'Barumsa Sheekaa',
      bunyanBannerTitle: "Waliigala Bunyaan · Sheekichaaf Du'aa'ii Godhaa",
      bunyanBannerSubtitle: "Sheekichaaf du'aa'ii godhaa, ergama Bunyaan beekumsa babal'isuu keessatti baraa",
      continueLearning: 'Barumsa Itti Fufaa',
      categories: 'Gosa Barnootaa',
      featuredCourses: 'Kitaabbilee Filataman',
      remainingTime: timeStr => `${timeStr} hafe`,
    },
    categories: {
      'cat-1': { name: 'Aqiidaa', description: 'Bu\'uura amantii fi Tawhiida qulqulluu' },
      'cat-2': { name: 'Tafsiira', description: 'Ibsa fi hiika Qur\'aana kabajamaa' },
      'cat-3': { name: 'Hadiisa', description: 'Ergaa fi barsiisa Nabiyyii ﷺ' },
      'cat-4': { name: 'Fiqhii', description: 'Seerota amantii fi bifa ibaadaa' },
      'cat-5': { name: 'Seenaa Nabiyyii', description: 'Seenaa fi jireenya Nabiyyii ﷺ' },
      'cat-6': { name: 'Afaan Arabaa', description: 'Seera Nahwii fi Sarfii' },
      'cat-7': { name: 'Tajwiida', description: 'Qajeelfama dubbisa Qur\'aanaa' },
      'cat-8': { name: 'Amala fi Naamusaa', description: 'Naamusa baratichaa fi qulqullina nafsee' },
    },
    course: {
      author: 'Barreessaa',
      level: {
        Beginner: 'Jalqabaa',
        Intermediate: 'Giddu-galeessa',
        Advanced: 'Olaanaa',
      },
      downloadAll: 'Barnoota Hunda Buusi',
      downloadAllPrompt: count => `Barnoota ${count} hunda sarara malee dhaggeeffachuuf buusuu barbaadduu?`,
      downloadsStartedTitle: 'Buufamuun Jalqabeera',
      downloadsStartedMsg: count => `Barnoonni ${count} duubaan buufamaa jiru. Fuula «Waraabbilee» irratti hordofaa.`,
      prepNotice: 'Kharriin barnootaa mirkanaa\'eera. Waraabbileen sagalee qophii irra jiru.',
      lessonsHeader: 'Baafata Barnootaa fi Boqonnaalee',
      notFoundTitle: 'Kitaabni Hin Argamne',
      notFoundDesc: 'Kitaabni kun haqameera ykn bakki isaa jijjiirameera.',
      noLessonsTitle: 'Barnoonni Hin Jiru',
      noLessonsDesc: 'Barnoonni dhihootti ni dabalamu inshaa\'Allaah.',
    },
    lesson: {
      pdfTab: 'Barreeffama Kitaabaa (PDF)',
      notesTab: 'Ibsa Waliigalaa',
      summaryHeader: 'Cuunfaa Barnootaa fi Ibsa',
      pdfNoticeText: 'Barnoonni kun barreeffama PDF qaba. Ilaaluuf tuqaa.',
      studyNotesHeader: 'Yaadannoo fi Qabxiiwwan Mirkanaa\'an',
      downloadAudio: 'Sagalee Buusi',
      audioDownloading: 'Buufamaa jira...',
      audioSaved: 'Sagaleen Buufameera',
      downloadPdf: 'PDF Buusi',
      pdfDownloading: 'Qusatamaa jira...',
      pdfSaved: 'PDFn Buufameera',
      prevLesson: order => `Duraa: Barnoota ${order}`,
      nextLesson: order => `Itti Aanu: Barnoota ${order}`,
      offlineSource: 'Kuusaa Mobaayilaa (Sarara Malee)',
      onlineSource: 'Tamsaasa Kallattii (R2 Audio)',
      notFound: 'Barnoonni hin argamne',
      pageOneLoading: 'Fuula 1 bannaa jira...',
    },
    downloads: {
      title: 'Waraabbilee',
      storageInfo: used => `${used} itti fayyadame · Sarara malee dubbisuu fi dhaggeeffachuuf qophii`,
      clearAlertTitle: 'Waraabbilee Hunda Haqaa',
      clearAlertDesc: 'Kun faayiloota buufaman hunda mobaayila keessan irraa haqa. Yeroo barbaaddan deebiftanii buusuu dandeessu.',
      offlineBanner: 'Yeroo ammaa interneetii irraa adda citeera. Sadarkaan buufamaa qusatameera; interneetiin yoo deebi\'u itti fufa.',
      status: {
        downloading: 'Buufamaa jira',
        paused: 'Dhaabbateera',
        waiting_for_internet: 'Interneetii eegaa jira',
        completed: 'Buufameera',
        failed: 'Kufateera',
        pending: 'Eegaa jira',
      },
      format: {
        audio: 'Faayila Sagalee (MP3)',
        pdf: 'Kitaaba (PDF)',
      },
      emptyTitle: 'Waraabbiin Tokkollee Hin Jiru',
      emptySubtitle: 'Sarara malee dubbisuu fi dhaggeeffachuuf barnootaa fi kitaabbilee buufadhaa.',
    },
    bookmarks: {
      title: 'Mallattoolee',
      savedCount: count => `Barnoota qusatame ${count}`,
      emptyTitle: 'Homaa Hin Qusatamne',
      emptySubtitle: 'Barnoota kamiyyuu irratti mallattoo tuquun daftanii asitti argachuu dandeessu.',
    },
    search: {
      title: 'Barbaadi',
      inputPlaceholder: 'Kitaaba, boqonnaa ykn mata-duree barbaadi...',
      emptyQueryTitle: 'Kuusaa Keessaa Barbaadi',
      emptyQuerySubtitle: 'Kitaabbilee fi barnoota hunda barbaaduuf qubeewwan 2 ykn isaa ol barreessaa',
      noResultsTitle: 'Wanti Argame Hin Jiru',
      noResultsSubtitle: q => `Wanti "${q}" wajjin walsimu hin argamne`,
      lessonAudioBadge: 'Barnoota Sagalee',
      lessonPdfBadge: 'Kitaaba PDF',
    },
    settings: {
      title: "Qindaa'ina",
      appearance: 'Bifa fi Halluu',
      theme: 'Haala Halluu',
      themeModes: {
        light: 'Ifaa (Guyyaa)',
        dark: 'Dukkana (Halkan)',
        system: 'Kan Mobaayilaa',
      },
      textSize: 'Guddina Barreeffamaa',
      textSizes: {
        small: 'Xiqqaa',
        medium: 'Giddu-galeessa',
        large: 'Guddaa',
      },
      previewText: 'Kun guddina barreeffamaa yeroo ammaa agarsiisa. Haala dubbisa keessaniif mijatutti sirreeffadhaa.',
      language: 'Afaan (Language)',
      languages: {
        ar: 'العربية (Arabaa)',
        en: 'English (Ingiliffa)',
        am: 'አማርኛ (Amaariffa)',
        om: 'Afaan Oromoo',
      },
      storage: 'Bulchiinsa Kuusaa fi Kaashii',
      audioStorage: 'Barnoota Sagalee Buufaman',
      pdfStorage: 'Kitaabbilee PDF Buufaman',
      totalStorage: 'Iddoo Waliigalaa Qabame',
      clearCacheBtn: 'Kaashii Qulqulleessi (Clear Cache)',
      clearCacheSuccessTitle: 'Kaashiin Qulqullaa\'eera',
      clearCacheSuccessDesc: 'Faayiloonni yeroo buufaman osoo hin tuqamin kaashiin qulqullaa\'eera.',
      general: 'Waliigala',
      aboutMenu: 'Waa\'ee Bunyaan fi Sheekotaa',
      adminMenu: 'Istaatistiksii Bulchiinsaa',
      walkthroughMenu: 'Gulaallii Simannaa (Fuula 3)',
      clearAllData: 'Daataa Hunda Haqaa',
      clearDataConfirmTitle: 'Daataa Hunda Haqaa',
      clearDataConfirmDesc: 'Kun adeemsa barumsaa, qusatamanii fi buufaman hunda haqa. Kun deebi\'uu hin danda\'u.',
      aboutSection: 'Waa\'ee Appii',
      version: 'Gosa (Version)',
      content: 'Qabiyyee',
      contentFree: '100% Bilisa & Beeksisa Malee',
      privacy: 'Iccitii',
      privacyText: 'Daataan dhuunfaa tokkollee hin sassaabamu',
    },
  },
};
