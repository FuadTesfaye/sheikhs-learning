import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../src/store';
import { useTheme } from '../src/hooks';
import { Spacing, BorderRadius, FontSize } from '../src/theme';
import { welcomeSlides, WelcomeSlide } from '../src/data/welcomeData';

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prayed, setPrayed] = useState(false);
  const flatListRef = useRef<FlatList<WelcomeSlide>>(null);
  const router = useRouter();
  const setOnboardingCompleted = useSettingsStore(s => s.setOnboardingCompleted);

  const totalSlides = welcomeSlides.length;
  const currentSlide = welcomeSlides[currentIndex] || welcomeSlides[0];

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentIndex(prevIndex);
    }
  };

  const handleJumpToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    router.replace('/(tabs)');
  };

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const computedIndex = Math.round(offsetX / width);
    if (computedIndex >= 0 && computedIndex < totalSlides) {
      setCurrentIndex(computedIndex);
    }
  };

  const renderSlide = ({ item, index }: { item: WelcomeSlide; index: number }) => (
    <View style={[styles.slideContainer, { width }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category Badge */}
        <View
          style={[
            styles.badgeRow,
            {
              backgroundColor: isDark ? item.highlightColor + '25' : item.highlightColor + '12',
              borderColor: item.highlightColor + '40',
            },
          ]}
        >
          <Text style={[styles.arabicBadgeText, { color: item.highlightColor }]}>
            {item.arabicBadge}
          </Text>
          <View style={[styles.badgeDivider, { backgroundColor: item.highlightColor + '50' }]} />
          <Text style={[styles.badgeText, { color: item.highlightColor }]}>
            {item.badge}
          </Text>
        </View>

        {/* Hero Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDark ? item.highlightColor + '30' : item.highlightColor + '15',
              borderColor: item.highlightColor + '40',
            },
          ]}
        >
          <Ionicons name={item.icon as any} size={58} color={item.highlightColor} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

        {/* Calligraphy Quote Card */}
        <View
          style={[
            styles.calligraphyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderLeftColor: item.accentColor,
            },
          ]}
        >
          <Text style={[styles.arabicQuote, { color: item.highlightColor }]}>
            {item.arabicQuote}
          </Text>
          <Text style={[styles.quoteTranslation, { color: colors.textSecondary }]}>
            {item.quoteTranslation}
          </Text>
        </View>

        {/* Description Body */}
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {item.description}
        </Text>

        {/* SLIDE 1 (The Sheikhs): Sincere Dua Card */}
        {item.id === 'sheikhs' && item.duaCard && (
          <View
            style={[
              styles.specialBox,
              {
                backgroundColor: isDark ? '#162817' : '#F1F8E9',
                borderColor: isDark ? '#2E7D32' : '#C8E6C9',
              },
            ]}
          >
            <View style={styles.specialBoxHeader}>
              <Ionicons name="hand-right-outline" size={18} color={item.accentColor} />
              <Text style={[styles.specialBoxTag, { color: '#2E7D32' }]}>
                {item.duaCard.tag}
              </Text>
            </View>
            <Text style={[styles.duaArabic, { color: isDark ? '#A5D6A7' : '#1B5E20' }]}>
              {item.duaCard.arabic}
            </Text>
            <Text style={[styles.duaTranslation, { color: colors.textSecondary }]}>
              {item.duaCard.translation}
            </Text>

            <TouchableOpacity
              style={[
                styles.prayButton,
                prayed && styles.prayButtonActive,
                { borderColor: isDark ? '#388E3C' : '#A5D6A7' },
              ]}
              onPress={() => setPrayed(prev => !prev)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={prayed ? 'heart' : 'heart-outline'}
                size={18}
                color={prayed ? '#D32F2F' : item.highlightColor}
              />
              <Text
                style={[
                  styles.prayButtonText,
                  prayed && styles.prayButtonTextActive,
                  !prayed && { color: item.highlightColor },
                ]}
              >
                {prayed ? item.duaCard.buttonActiveText : item.duaCard.buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SLIDE 2 (The Courses): Core Disciplines Preview */}
        {item.id === 'courses' && item.curriculumCategories && (
          <View
            style={[
              styles.specialBox,
              {
                backgroundColor: isDark ? '#102236' : '#E3F2FD',
                borderColor: isDark ? '#1E88E5' : '#BBDEFB',
              },
            ]}
          >
            <View style={styles.specialBoxHeader}>
              <Ionicons name="library-outline" size={18} color="#0288D1" />
              <Text style={[styles.specialBoxTag, { color: '#0288D1' }]}>
                Core Sciences in Curriculum
              </Text>
            </View>
            <View style={styles.categoryPillsGrid}>
              {item.curriculumCategories.map((cat, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor: isDark ? colors.surface : '#FFFFFF',
                      borderColor: cat.color + '40',
                    },
                  ]}
                >
                  <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                  <Text style={[styles.categoryPillName, { color: colors.text }]}>
                    {cat.name}
                  </Text>
                  <Text style={[styles.categoryPillArabic, { color: cat.color }]}>
                    {cat.arabic}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SLIDE 3 (Bunyan): Pillars Grid */}
        {item.id === 'bunyan' && item.pillars && (
          <View
            style={[
              styles.specialBox,
              {
                backgroundColor: isDark ? '#2B1713' : '#FBE9E7',
                borderColor: isDark ? '#D84315' : '#FFCCBC',
              },
            ]}
          >
            <View style={styles.specialBoxHeader}>
              <Ionicons name="sparkles-outline" size={18} color="#E65100" />
              <Text style={[styles.specialBoxTag, { color: '#BF360C' }]}>
                Foundation of Bunyan
              </Text>
            </View>
            <View style={styles.pillarsContainer}>
              {item.pillars.map((pillar, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.pillarItem,
                    {
                      backgroundColor: isDark ? colors.surface : '#FFFFFF',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons name={pillar.icon as any} size={20} color={item.highlightColor} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pillarTitle, { color: colors.text }]}>
                      {pillar.title}
                    </Text>
                    <Text style={[styles.pillarSubtitle, { color: colors.textSecondary }]}>
                      {pillar.subtitle}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Highlights List on each slide */}
        <View style={styles.highlightsContainer}>
          {item.highlights.map((highlight, idx) => (
            <View
              key={idx}
              style={[
                styles.highlightRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.highlightIconBox,
                  { backgroundColor: isDark ? item.highlightColor + '20' : item.highlightColor + '12' },
                ]}
              >
                <Ionicons name={highlight.icon as any} size={20} color={item.highlightColor} />
              </View>
              <View style={styles.highlightTextContainer}>
                <Text style={[styles.highlightTitle, { color: colors.text }]}>
                  {highlight.title}
                </Text>
                <Text style={[styles.highlightDescription, { color: colors.textSecondary }]}>
                  {highlight.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <View style={styles.brandGroup}>
          <Text style={[styles.brandTitle, { color: currentSlide.highlightColor }]}>بُنْيَان</Text>
          <View style={[styles.stepCapsule, { backgroundColor: isDark ? colors.surfaceVariant : '#EEEEEE' }]}>
            <Text style={[styles.stepText, { color: colors.textSecondary }]}>
              {currentIndex + 1} of {totalSlides}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.skipBtn, { backgroundColor: isDark ? colors.surfaceVariant : '#EEEEEE' }]}
          onPress={completeOnboarding}
          activeOpacity={0.7}
          accessibilityLabel="Skip onboarding and go to lessons"
        >
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip to Courses</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
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
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={info => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          }, 100);
        }}
      />

      {/* Footer Controls */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        {/* Interactive Dots */}
        <View style={styles.dotsRow}>
          {welcomeSlides.map((s, i) => {
            const isActive = i === currentIndex;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => handleJumpToSlide(i)}
                activeOpacity={0.7}
                style={[
                  styles.dotTouchTarget,
                  isActive && styles.activeDotTouchTarget,
                ]}
                accessibilityLabel={`Go to slide ${i + 1}: ${s.badge}`}
              >
                <View
                  style={[
                    styles.dot,
                    isActive
                      ? [styles.activeDot, { backgroundColor: currentSlide.highlightColor }]
                      : [styles.inactiveDot, { backgroundColor: isDark ? '#3E3E3E' : '#D5D5D5' }],
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>
          {currentIndex > 0 ? (
            <TouchableOpacity
              style={[styles.backBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={handleBack}
              activeOpacity={0.7}
              accessibilityLabel="Go back to previous slide"
            >
              <Ionicons name="arrow-back" size={18} color={colors.text} />
              <Text style={[styles.backBtnText, { color: colors.text }]}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtnSpacer} />
          )}

          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: currentSlide.highlightColor },
              currentIndex === 0 ? styles.actionBtnFull : styles.actionBtnFlex,
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
            accessibilityLabel={currentSlide.buttonLabel}
          >
            <Text style={styles.actionBtnText}>
              {currentIndex === totalSlides - 1
                ? 'Start Seeking Knowledge'
                : currentSlide.nextStepTitle}
            </Text>
            <Ionicons
              name={currentIndex === totalSlides - 1 ? 'checkmark-circle-outline' : 'arrow-forward'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  stepCapsule: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
  },
  stepText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  slideContainer: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
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
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 28,
  },
  calligraphyCard: {
    width: '100%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  arabicQuote: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 8,
  },
  quoteTranslation: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 19,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  specialBox: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: 8,
  },
  specialBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 4,
  },
  specialBoxTag: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  duaArabic: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 27,
  },
  duaTranslation: {
    fontSize: 12,
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
    marginTop: 6,
    gap: 8,
    borderWidth: 1,
  },
  prayButtonActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  prayButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  prayButtonTextActive: {
    color: '#C62828',
  },
  categoryPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 4,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryPillName: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryPillArabic: {
    fontSize: 12,
    fontWeight: '600',
  },
  pillarsContainer: {
    gap: 8,
    marginTop: 4,
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 12,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  pillarSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  highlightsContainer: {
    width: '100%',
    gap: 10,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 12,
  },
  highlightIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightTextContainer: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  highlightDescription: {
    fontSize: 12,
    lineHeight: 17,
  },
  footer: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dotTouchTarget: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDotTouchTarget: {
    padding: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 26,
  },
  inactiveDot: {
    width: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtnSpacer: {
    width: 0,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnFull: {
    flex: 1,
  },
  actionBtnFlex: {
    flex: 1,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
