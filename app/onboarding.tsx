import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  useWindowDimensions, SafeAreaView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../src/store';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/theme';

interface WelcomeSlide {
  id: string;
  badge: string;
  arabicBadge: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  arabicQuote: string;
  quoteTranslation: string;
  description: string;
  duaCard?: {
    arabic: string;
    translation: string;
    tag: string;
  };
  highlightColor: string;
  accentColor: string;
}

const welcomeSlides: WelcomeSlide[] = [
  {
    id: '1',
    badge: 'Dedication & Dua',
    arabicBadge: 'ادْعُوا لِلشَّيْخِ',
    icon: 'heart-circle-outline',
    title: 'A Tribute & Prayer for the Sheikh',
    arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
    quoteTranslation: 'May Allah reward him with goodness, forgive him, and cause his knowledge to benefit the Ummah.',
    description:
      'This learning platform is dedicated to honoring and preserving the noble efforts of the Sheikh. As you embark on your journey of seeking sacred knowledge through his lectures, we kindly ask you to remember the Sheikh and his family in your sincere prayers and supplications.',
    duaCard: {
      tag: 'A Sincere Prayer',
      arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ',
      translation: 'O Allah! Forgive him, have mercy upon him, grant him well-being, pardon him, make his dwelling honorable, and expand his place of entrance.',
    },
    highlightColor: '#1B5E20',
    accentColor: '#D4AF37',
  },
  {
    id: '2',
    badge: 'The Bunyan Initiative',
    arabicBadge: 'مُبَادَرَةُ بُنْيَان',
    icon: 'layers-outline',
    title: 'Building a Fortress of Sacred Knowledge',
    arabicQuote: '« الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا »',
    quoteTranslation: 'The believer to another believer is like a solid structure, each part strengthening the other. (Sahih al-Bukhari)',
    description:
      'Bunyan (بُنْيَان) is an independent non-profit initiative created to preserve, index, and systematically present authentic Islamic scholarship. We construct clear, step-by-step curricula across Aqeedah, Tafsir, Hadith, Fiqh, and Arabic grammar so seekers around the world can build their faith upon solid foundations.',
    highlightColor: '#0D47A1',
    accentColor: '#00ACC1',
  },
  {
    id: '3',
    badge: 'Waqf & Sadaqah Jariyah',
    arabicBadge: 'صَدَقَةٌ جَارِيَةٌ',
    icon: 'sparkles-outline',
    title: '100% Free & Accessible Anywhere',
    arabicQuote: '« أَوْ عِلْمٍ يُنْتَفَعُ بِهِ »',
    quoteTranslation: '...or knowledge from which benefit continues to be derived. (Sahih Muslim)',
    description:
      'Bunyan is established purely as a continuous charity (Sadaqah Jariyah). Completely free with zero advertisements, paywalls, or premium tiers. Download complete courses for offline listening and study anytime, anywhere across the globe.',
    highlightColor: '#BF360C',
    accentColor: '#FFB300',
  },
];

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prayed, setPrayed] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const setOnboardingCompleted = useSettingsStore(s => s.setOnboardingCompleted);

  const handleNext = () => {
    if (currentIndex < welcomeSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item }: { item: WelcomeSlide }) => (
    <View style={[styles.slideContainer, { width }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Badge */}
        <View style={[styles.badgeRow, { backgroundColor: item.highlightColor + '12', borderColor: item.highlightColor + '30' }]}>
          <Text style={[styles.arabicBadgeText, { color: item.highlightColor }]}>{item.arabicBadge}</Text>
          <View style={[styles.badgeDivider, { backgroundColor: item.highlightColor + '40' }]} />
          <Text style={[styles.badgeText, { color: item.highlightColor }]}>{item.badge}</Text>
        </View>

        {/* Hero Icon */}
        <View style={[styles.iconContainer, { backgroundColor: item.highlightColor + '15' }]}>
          <Ionicons name={item.icon} size={64} color={item.highlightColor} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{item.title}</Text>

        {/* Arabic Calligraphy Card */}
        <View style={[styles.calligraphyCard, { borderLeftColor: item.accentColor }]}>
          <Text style={styles.arabicQuote}>{item.arabicQuote}</Text>
          <Text style={styles.quoteTranslation}>{item.quoteTranslation}</Text>
        </View>

        {/* Description Body */}
        <Text style={styles.description}>{item.description}</Text>

        {/* Optional Dua / Interactive Card on Slide 1 */}
        {item.duaCard && (
          <View style={styles.duaBox}>
            <View style={styles.duaHeader}>
              <Ionicons name="hand-right-outline" size={18} color="#D4AF37" />
              <Text style={styles.duaTag}>{item.duaCard.tag}</Text>
            </View>
            <Text style={styles.duaArabic}>{item.duaCard.arabic}</Text>
            <Text style={styles.duaTranslation}>{item.duaCard.translation}</Text>

            <TouchableOpacity
              style={[styles.prayButton, prayed && styles.prayButtonActive]}
              onPress={() => setPrayed(true)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={prayed ? 'heart' : 'heart-outline'}
                size={18}
                color={prayed ? '#D32F2F' : '#1B5E20'}
              />
              <Text style={[styles.prayButtonText, prayed && styles.prayButtonTextActive]}>
                {prayed ? 'Ameen · جَزَاكَ ٱللَّٰهُ خَيْرًا' : 'Say Ameen for the Sheikh'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const currentSlide = welcomeSlides[currentIndex] || welcomeSlides[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <View style={styles.brandGroup}>
          <Text style={styles.brandTitle}>بُنْيَان</Text>
          <Text style={styles.brandSubtitle}>Bunyan Platform</Text>
        </View>

        <TouchableOpacity style={styles.skipBtn} onPress={completeOnboarding} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.skipText}>Skip to Lessons</Text>
        </TouchableOpacity>
      </View>

      {/* Main Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={welcomeSlides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Footer with Dots and Action Button */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {welcomeSlides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex
                  ? [styles.activeDot, { backgroundColor: currentSlide.highlightColor }]
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: currentSlide.highlightColor }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>
            {currentIndex === welcomeSlides.length - 1 ? 'Start Seeking Knowledge' : 'Next'}
          </Text>
          <Ionicons
            name={currentIndex === welcomeSlides.length - 1 ? 'checkmark-circle-outline' : 'arrow-forward'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 8,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1B5E20',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: '#EEEEEE',
  },
  skipText: {
    fontSize: 13,
    color: '#616161',
    fontWeight: '600',
  },
  slideContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: 8,
  },
  arabicBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  badgeDivider: {
    width: 1,
    height: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 28,
  },
  calligraphyCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderLeftWidth: 4,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  arabicQuote: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1B5E20',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  quoteTranslation: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#616161',
    textAlign: 'center',
    lineHeight: 19,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#424242',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  duaBox: {
    width: '100%',
    backgroundColor: '#F9FBF9',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    padding: Spacing.lg,
    marginTop: Spacing.xs,
    gap: 8,
  },
  duaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 4,
  },
  duaTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  duaArabic: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B5E20',
    textAlign: 'center',
    lineHeight: 28,
  },
  duaTranslation: {
    fontSize: 12,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  prayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  prayButtonActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  prayButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B5E20',
  },
  prayButtonTextActive: {
    color: '#C62828',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
    paddingTop: 8,
    backgroundColor: '#FAFAFA',
    gap: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#E0E0E0',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
