import { SupportedLanguage } from '../types';

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

export function getWelcomeSlides(lang: SupportedLanguage = 'ar'): WelcomeSlide[] {
  switch (lang) {
    case 'ar':
      return [
        {
          id: 'sheikhs',
          badge: 'الوفاء للشيوخ والدعاء لهم',
          arabicBadge: 'ادْعُوا لِلشَّيْخِ',
          icon: 'heart-circle-outline',
          title: 'الشيوخ: حَمَلَةُ العلم الشريف وأهله',
          arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
          quoteTranslation: 'نسأل الله أن يجزي شيوخنا خير الجزاء، وأن يغفر لهم، وينفع الأمة بعلمهم المبارك.',
          description:
            'العلم الشرعي أمانة متوارثة نُقلت عبر أجيال من العلماء الربانيين والمعلمين المخلصين. كل درس وسلسلة علمية هنا هي ثمرة جهودهم المباركة في خدمة كتاب الله وسنة رسوله ﷺ.',
          highlightColor: '#1B5E20',
          accentColor: '#D4AF37',
          buttonLabel: 'الانتقال إلى المناهج والدروس',
          nextStepTitle: 'التالي: المناهج الدراسية',
          highlights: [
            {
              icon: 'ribbon-outline',
              title: 'أصالة المنهج',
              description: 'فهم شرعي سديد مستمد من الكتاب والسنة وإجماع سلف الأمة.',
            },
            {
              icon: 'archive-outline',
              title: 'أمانة الحفظ',
              description: 'تسجيلات ومواد وكتب محفوظة بعناية تامة دون تحريف أو تشويش.',
            },
            {
              icon: 'heart-outline',
              title: 'الدعاء الصادق',
              description: 'وفاءً لفضل المعلم وحثاً على استدامة بركة علمه بالدعاء المستمر له.',
            },
          ],
          duaCard: {
            tag: 'دعاء خالص لفضيلة الشيخ',
            arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاجْعَلْ عِلْمَهُ صَدَقَةً جَارِيَةً',
            translation:
              'اللهم اغفر له وارحمه وأكرم نزله واجعل علمه النافع صدقة جارية ترفعه في درجات الجنان.',
            buttonText: 'أَمِّنْ على دعاء الشيخ',
            buttonActiveText: 'آمين · جَزَاكَ ٱللَّٰهُ خَيْرًا',
          },
        },
        {
          id: 'courses',
          badge: 'المناهج والمسارات العلمية',
          arabicBadge: 'مَنَاهِجُ الدِّرَاسَةِ',
          icon: 'book-outline',
          title: 'مسارات تعليمية متكاملة ومنهجية',
          arabicQuote: '« مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ »',
          quoteTranslation: 'حديث شريف رواه الإمام مسلم في صحيحه.',
          description:
            'مناهج دراسية متدرجة تغطي علوم العقيدة والتفسير والحديث والفقه والسيرة واللغة، مقسمة بعناية لتناسب كل طالب علم.',
          highlightColor: '#0D47A1',
          accentColor: '#00ACC1',
          buttonLabel: 'الانتقال إلى مبادرة بنيان',
          nextStepTitle: 'التالي: عن بنيان',
          highlights: [
            {
              icon: 'layers-outline',
              title: 'تدرج منهجي',
              description: 'مستويات واضحة تبدأ من صغار العلم وتتدرج إلى أمهات المتون.',
            },
            {
              icon: 'headset-outline',
              title: 'صوت عالي النقاء',
              description: 'استمع للدروس أثناء تنقلاتك وأوقات فراغك بكل يسر وسهولة.',
            },
            {
              icon: 'cloud-download-outline',
              title: 'دراسة دون اتصال 100%',
              description: 'حمل المتون الكاملة واستمع لها في أي وقت دون الحاجة للإنترنت.',
            },
            {
              icon: 'checkmark-circle-outline',
              title: 'متابعة ذكية للتقدم',
              description: 'يحفظ التطبيق مكان وقوفك تلقائياً لتستأنف التعلم بسلاسة.',
            },
          ],
          curriculumCategories: [
            { name: 'العقيدة', arabic: 'عقيدة', color: '#1B5E20' },
            { name: 'التفسير', arabic: 'تفسير', color: '#0D47A1' },
            { name: 'الحديث', arabic: 'حديث', color: '#BF360C' },
            { name: 'الفقه', arabic: 'فقه', color: '#4A148C' },
            { name: 'السيرة', arabic: 'سيرة', color: '#006064' },
            { name: 'اللغة العربية', arabic: 'نحو وصرف', color: '#E65100' },
          ],
        },
        {
          id: 'bunyan',
          badge: 'منصة ومبادرة بنيان',
          arabicBadge: 'مُبَادَرَةُ بُنْيَان',
          icon: 'layers-outline',
          title: 'بُنْيَان: حِصْنٌ رَقْمِيٌّ لِنَشْرِ العِلْمِ النَّافِعِ',
          arabicQuote: '« الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا »',
          quoteTranslation: 'حديث شريف في صحيحي البخاري ومسلم.',
          description:
            'مبادرة بنيان مشروع وقفي غير ربحي صُمم لجمع التراث العلمي الإسلامي وتيسيره بأحدث الوسائل التقنية، خالٍ تماماً من الإعلانات والاشتراكات.',
          highlightColor: '#BF360C',
          accentColor: '#FF8F00',
          buttonLabel: 'ابدأ طلب العلم',
          nextStepTitle: 'ابدأ طلب العلم',
          highlights: [
            {
              icon: 'gift-outline',
              title: '100% وقف خيري · صدقة جارية',
              description: 'تطبيق مجاني خالص لوجه الله تعالى دون أي إعلانات أو رسوم إطلاقاً.',
            },
            {
              icon: 'people-outline',
              title: 'قوة للأمة الإسلامية',
              description: 'بُني لتمكين المسلمين والطلاب والأسر من تحصيل العلم الصافي بيسر.',
            },
            {
              icon: 'phone-portrait-outline',
              title: 'سهولة وسلاسة كاملة',
              description: 'خطوط عربية واضحة، تحكم بحجم النص، ووضع ليلي مريح للقراءة.',
            },
          ],
          pillars: [
            { title: 'وقف دائم', subtitle: 'مجاني 100% وخالٍ من أي استغلال مادي', icon: 'sparkles-outline' },
            { title: 'نقل أمين', subtitle: 'حفاظ على أصالة المادة العلمية', icon: 'shield-checkmark-outline' },
            { title: 'حصن رقمي', subtitle: 'يعمل دون إنترنت وموثوق في كل مكان', icon: 'server-outline' },
          ],
        },
      ];

    case 'am':
      return [
        {
          id: 'sheikhs',
          badge: 'ለሼኾች ክብር መስጠትና ዱዓእ ማድረግ',
          arabicBadge: 'ادْعُوا لِلشَّيْخِ',
          icon: 'heart-circle-outline',
          title: 'የእውቀት ባለአደራዎች የሆኑት ሼኾቻችን',
          arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
          quoteTranslation: 'አላህ ለመምህሮቻችን ታላቅ ምንዳን ይስጣቸው፣ ይማራቸው፣ በእውቀታቸውም ኡማውን ይጠቅምበት።',
          description:
            'በእስልምና እውነተኛ እውቀት በታማኝ ዑለማዎችና መምህራን በኩል የሚተላለፍ አደራ ነው። እዚህ የቀረቡት ትምህርቶች ሼኾቻችን ለቁርኣንና ሐዲስ የሰጡትን ታላቅ አገልግሎት ያከብራሉ።',
          highlightColor: '#1B5E20',
          accentColor: '#D4AF37',
          buttonLabel: 'ወደ ኮርሶቹ ቀጥል',
          nextStepTitle: 'ቀጣይ: ኮርሶች',
          highlights: [
            {
              icon: 'ribbon-outline',
              title: 'ትክክለኛ ቅርስ',
              description: 'ከቁርኣን፣ ከሐዲስና ከቀደምት ሊቃውንት የተገኘ ትክክለኛ ግንዛቤ።',
            },
            {
              icon: 'archive-outline',
              title: 'የተጠበቀ እውቀት',
              description: 'ያለ ምንም ቅነሳና ለውጥ በጥንቃቄ የተቀመጡ የትምህርት ድምጾችና ኪታቦች።',
            },
            {
              icon: 'heart-outline',
              title: 'ልባዊ ዱዓእ',
              description: 'ለሼኾቻችን በየቀኑ ዱዓእ በማድረግ የመምህርና የተማሪን ስነ-ምግባር ማክበር።',
            },
          ],
          duaCard: {
            tag: 'ለሼኹ የሚደረግ ልባዊ ዱዓእ',
            arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاجْعَلْ عِلْمَهُ صَدَقَةً جَارِيَةً',
            translation:
              'አላህ ሆይ! ማረዉ፣ እዘንለት፣ ምቹ ማረፊያን ስጠው፣ ጠቃሚ እውቀቱንም እስከ ትንሳኤ ቀን ድረስ ቀጣይ ሰደቃ (ሶደቀቱል ጃሪያህ) አድርግለት።',
            buttonText: 'ለሼኹ አሚን ይበሉ',
            buttonActiveText: 'አሚን · ጀዛከላሁ ኸይረን',
          },
        },
        {
          id: 'courses',
          badge: 'የጥናት መርሃ-ግብሮችና ኮርሶች',
          arabicBadge: 'مَنَاهِجُ الدِّرَاسَةِ',
          icon: 'book-outline',
          title: 'የተሟሉ ኮርሶችና የጥናት መንገዶች',
          arabicQuote: '« مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ »',
          quoteTranslation: '«እውቀትን ፍለጋ መንገድ የጀመረን ሰው አላህ ወደ ጀነት የሚወስደውን መንገድ ያቀልለታል።» (ሶሒሕ ሙስሊም)',
          description:
            'በእስልምና መሰረታዊና ከፍተኛ የእውቀት ዘርፎች የተዋቀረ ስርአተ-ትምህርት። እያንዳንዱ ኮርስ በድምጽ፣ በንባብና በትምህርት ክትትል የተደገፈ ነው።',
          highlightColor: '#0D47A1',
          accentColor: '#00ACC1',
          buttonLabel: 'ወደ ቡንያን ቀጥል',
          nextStepTitle: 'ቀጣይ: ስለ ቡንያን',
          highlights: [
            {
              icon: 'layers-outline',
              title: 'ደረጃ በደረጃ የሚሰጥ ትምህርት',
              description: 'ከመሰረታዊ እስከ ከፍተኛ ደረጃዎች በቅደም ተከተል የተዘጋጀ።',
            },
            {
              icon: 'headset-outline',
              title: 'ድምጽ በማንኛውም ቦታ',
              description: 'በጉዞ ላይ ወይም በትርፍ ጊዜ በቀላሉ ለማዳመጥ የተመቻቸ።',
            },
            {
              icon: 'cloud-download-outline',
              title: '100% ያለ ኢንተርኔት',
              description: 'ትምህርቶችን አውርደው ያለ ኢንተርኔት በፈለጉት ጊዜ ይማሩ።',
            },
            {
              icon: 'checkmark-circle-outline',
              title: 'ስማርት የትምህርት ክትትል',
              description: 'ያቆሙበትን ደቂቃ በራሱ በማስታወስ በቀላሉ ይቀጥላል።',
            },
          ],
          curriculumCategories: [
            { name: 'ዐቂዳ', arabic: 'عقيدة', color: '#1B5E20' },
            { name: 'ተፍሲር', arabic: 'تفسير', color: '#0D47A1' },
            { name: 'ሐዲስ', arabic: 'حديث', color: '#BF360C' },
            { name: 'ፊቅህ', arabic: 'فقه', color: '#4A148C' },
            { name: 'ሲራህ', arabic: 'سيرة', color: '#006064' },
            { name: 'ቋንቋ', arabic: 'نحو وصرف', color: '#E65100' },
          ],
        },
        {
          id: 'bunyan',
          badge: 'የቡንያን መድረክ',
          arabicBadge: 'مُبَادَرَةُ بُنْيَان',
          icon: 'layers-outline',
          title: 'ቡንያን: ትክክለኛ የእስልምና እውቀት ዲጂታል ምሽግ',
          arabicQuote: '« الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا »',
          quoteTranslation: '«አማኝ ለአማኝ ልክ እንደ ህንጻ ነው፤ አንዱ ሌላውን ያጠናክራል።» (ቡኻሪ እና ሙስሊም)',
          description:
            'ቡንያን ትክክለኛ የእስልምና እውቀትን ከዘመናዊ ቴክኖሎጂ ጋር በማጣመር የተቋቋመ ነጻ የዲጂታል ተነሳሽነት ነው። እንደ ቋሚ ወቅፍና ሰደቀቱል ጃሪያህ የተዘጋጀ ነው።',
          highlightColor: '#BF360C',
          accentColor: '#FF8F00',
          buttonLabel: 'እውቀት መፈለግ ጀምር',
          nextStepTitle: 'እውቀት መፈለግ ጀምር',
          highlights: [
            {
              icon: 'gift-outline',
              title: '100% ነጻ · ሰደቀቱል ጃሪያህ',
              description: 'ምንም አይነት ማስታወቂያ ወይም ክፍያ የሌለው ቋሚ ወቅፍ።',
            },
            {
              icon: 'people-outline',
              title: 'ኡማውን ማጠናከር',
              description: 'ግለሰቦችንና ቤተሰቦችን አስተማማኝ እውቀት እንዲያገኙ ማስቻል።',
            },
            {
              icon: 'phone-portrait-outline',
              title: 'ቀላልና ምቹ',
              description: 'ግልጽ ጽሑፎች፣ የፊደል መጠን ማስተካከያና የምሽት ንባብ ገጽታ።',
            },
          ],
          pillars: [
            { title: 'ቋሚ ወቅፍ', subtitle: 'ምንም የገንዘብ ክፍያ የሌለው፣ 100% ነጻ', icon: 'sparkles-outline' },
            { title: 'ታማኝ ስርጭት', subtitle: 'ትክክለኛውን እውቀት መጠበቅ', icon: 'shield-checkmark-outline' },
            { title: 'ዲጂታል ምሽግ', subtitle: 'ያለ ኢንተርኔት የሚሰራ አስተማማኝ', icon: 'server-outline' },
          ],
        },
      ];

    case 'om':
      return [
        {
          id: 'sheikhs',
          badge: 'Sheekota Kabajuu fi Du’aa’ii Gochuu',
          arabicBadge: 'ادْعُوا لِلشَّيْخِ',
          icon: 'heart-circle-outline',
          title: 'Sheekonni: Abbootii Amana Beekumsa Qulqulluu',
          arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
          quoteTranslation:
            'Allaahn barsiisota keenyaaf galata guddaa haa kennuuf, isaaniif haa araaramu, beekumsa isaaniitiinis Ummaticha haa fayyadu.',
          description:
            'Beekumsa Islaamaa keessatti beekumsa qulqulluu jechuun amana ulamaa\'ota fi barsiisota amanamaadhaan dhalootaaf darbedha. Barnoonni asitti dhihaate hundi tajaajila sheekonni keenya Qur\'aana fi Hadiisaaf kennan kan kabajudha.',
          highlightColor: '#1B5E20',
          accentColor: '#D4AF37',
          buttonLabel: 'Gara Koorsootaatti Itti Fufaa',
          nextStepTitle: 'Itti Aanu: Koorsoota',
          highlights: [
            {
              icon: 'ribbon-outline',
              title: 'Dhaala Qulqulluu',
              description: 'Hubannoo sirrii Qur\'aana, Hadiisa fi ijmaa\'a saba duraanii irraa argame.',
            },
            {
              icon: 'archive-outline',
              title: 'Eegamaa fi Amanamaa',
              description: 'Waraabbileen sagalee fi kitaabbileen osoo hin jijjiiramin qulqullinaan eegaman.',
            },
            {
              icon: 'heart-outline',
              title: 'Du’aa’ii Qulqulluu',
              description: 'Sheekota keenya du’aa’ii keessatti yaadachuun naamusa barataa-barsiisaa kabajuu.',
            },
          ],
          duaCard: {
            tag: 'Du’aa’ii Qulqulluu Sheekichaaf',
            arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاجْعَلْ عِلْمَهُ صَدَقَةً جَارِيَةً',
            translation:
              'Yaa Allaah! Isaaniif araarami, rahmata godhiif, iddoo isaanii kabajaa godhiif, beekumsa isaaniis sadaqaa itti-fufaa (Sadaqah Jariyah) godhiif.',
            buttonText: 'Sheekichaaf Aamiin Jedhaa',
            buttonActiveText: 'Aamiin · جَزَاكَ ٱللَّٰهُ خَيْرًا',
          },
        },
        {
          id: 'courses',
          badge: 'Sirna Barnootaa fi Koorsoota',
          arabicBadge: 'مَنَاهِجُ الدِّرَاسَةِ',
          icon: 'book-outline',
          title: 'Koorsoota Guutuu fi Karaalee Barnootaa',
          arabicQuote: '« مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ »',
          quoteTranslation: '«Nama beekumsa barbaachaaf karaa deeme, Allaahn gara jannataatti karaa isaaf laaffisa.» (Sahiih Muslim)',
          description:
            'Sirna barnootaa beekumsa bu\'uuraa fi olaanaa Islaamaa of keessatti qabate. Koorsoonni hundi sagalee fi hordoffii adeemsaatiin qindaa\'aniiru.',
          highlightColor: '#0D47A1',
          accentColor: '#00ACC1',
          buttonLabel: 'Gara Bunyaanitti Itti Fufaa',
          nextStepTitle: 'Itti Aanu: Waa\'ee Bunyaan',
          highlights: [
            {
              icon: 'layers-outline',
              title: 'Sadarkaa Sadarkaadhaan',
              description: 'Jalqabaa kaasee hanga sadarkaa olaanaatti kan qophaa\'e.',
            },
            {
              icon: 'headset-outline',
              title: 'Sagalee Bakka Hundatti',
              description: 'Imala keessatti ykn yeroo boqonnaatti salphaatti dhaggeeffachuuf.',
            },
            {
              icon: 'cloud-download-outline',
              title: '100% Sarara Malee',
              description: 'Koorsoota buufachuun intarneetii malee yeroo barbaaddan baradhaa.',
            },
            {
              icon: 'checkmark-circle-outline',
              title: 'Hordoffii Adeemsaa Saffisaa',
              description: 'Bakka dhaabbatanirraa ofumaan itti fufa.',
            },
          ],
          curriculumCategories: [
            { name: 'Aqiidaa', arabic: 'عقيدة', color: '#1B5E20' },
            { name: 'Tafsiira', arabic: 'تفسير', color: '#0D47A1' },
            { name: 'Hadiisa', arabic: 'حديث', color: '#BF360C' },
            { name: 'Fiqhii', arabic: 'فقه', color: '#4A148C' },
            { name: 'Siiraa', arabic: 'سيرة', color: '#006064' },
            { name: 'Afaan Arabaa', arabic: 'نحو وصرف', color: '#E65100' },
          ],
        },
        {
          id: 'bunyan',
          badge: 'Pilaatfoormii Bunyaan',
          arabicBadge: 'مُبَادَرَةُ بُنْيَان',
          icon: 'layers-outline',
          title: 'Bunyaan: Masaraa Dijitaalaa Beekumsa Islaamaa Qulqulluu',
          arabicQuote: '« الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا »',
          quoteTranslation: '«Mu\'minni mu\'minaaf akka ijaarsa gamooti; gariin isaanii garii jabeessa.» (Bukhaarii fi Muslim)',
          description:
            'Bunyaan beekumsa Islaamaa qulqulluu teeknoolojii ammayyaa wajjin walitti fiduuf kan hundeeffame inisheetivii dhuunfaa bilisaati. Akka waqfii fi sadaqaa itti-fufaatti qophaa\'e.',
          highlightColor: '#BF360C',
          accentColor: '#FF8F00',
          buttonLabel: 'Beekumsa Barbaaduu Jalqabi',
          nextStepTitle: 'Beekumsa Barbaaduu Jalqabi',
          highlights: [
            {
              icon: 'gift-outline',
              title: '100% Bilisa · Sadaqah Jariyah',
              description: 'Waqfii ummataaf ta\'e, beeksisa fi kaffaltii tokkollee hin qabu.',
            },
            {
              icon: 'people-outline',
              title: 'Ummaticha Jabeessuu',
              description: 'Namoota dhuunfaa fi maatii beekumsa amanamaadhaan humneessuuf.',
            },
            {
              icon: 'phone-portrait-outline',
              title: 'Fayyadamuuf Salphaa',
              description: 'Barreeffama ifa, guddina qubee jijjiiruu fi haala halkan dubbisuu.',
            },
          ],
          pillars: [
            { title: 'Waqfii Dhaabbataa', subtitle: 'Kaffaltii hin qabu, 100% bilisa', icon: 'sparkles-outline' },
            { title: 'Dabarsa Amanamaa', subtitle: 'Beekumsa dhugaa eeguu', icon: 'shield-checkmark-outline' },
            { title: 'Masaraa Dijitaalaa', subtitle: 'Intarneetii malee amansiisaa', icon: 'server-outline' },
          ],
        },
      ];

    case 'en':
    default:
      return [
        {
          id: 'sheikhs',
          badge: 'Honoring the Sheikhs',
          arabicBadge: 'ادْعُوا لِلشَّيْخِ',
          icon: 'heart-circle-outline',
          title: 'The Sheikhs: Custodians of Sacred Knowledge',
          arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
          quoteTranslation:
            'May Allah reward our teachers with the highest good, forgive them, and cause their sacred knowledge to benefit the Ummah.',
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
  }
}

export const welcomeSlides: WelcomeSlide[] = getWelcomeSlides('en');
