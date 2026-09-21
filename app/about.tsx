import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Share, Linking, Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont } from '../src/hooks';
import { Spacing, BorderRadius } from '../src/theme';

export default function AboutScreen() {
  const { colors, isDark } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();
  const [prayed, setPrayed] = useState(false);

  const handleShareApp = async () => {
    try {
      await Share.share({
        title: "Sheikh's Islamic Learning App - Bunyan",
        message:
          "Seek authentic Islamic knowledge with the Sheikh's Islamic Learning App (Bunyan). 100% Free, no ads, offline downloads, and structured courses in Aqeedah, Tafsir, Hadith, Fiqh & Arabic.\n\nPlease keep the Sheikh and the Bunyan team in your prayers!",
      });
    } catch (e) {
      // Ignored
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: 'About Bunyan & The Sheikh',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Card */}
        <View style={[styles.bannerCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.arabicLogo}>بُنْيَان</Text>
          <Text style={styles.bannerTitle}>The Bunyan Initiative</Text>
          <Text style={styles.bannerSubtitle}>A Digital Fortress for Authentic Islamic Knowledge</Text>
        </View>

        {/* Section 1: The Sheikh & Dua */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#1B5E2018' }]}>
              <Ionicons name="heart" size={22} color="#1B5E20" />
            </View>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fonts.lg }]}>
                Dua & Tribute for the Sheikh
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                ادْعُوا لِلشَّيْخِ وَارْحَمْهُ
              </Text>
            </View>
          </View>

          <Text style={[styles.cardBody, { color: colors.textSecondary, fontSize: fonts.md }]}>
            This application is built with deep gratitude to deliver the noble, authentic teachings of the Sheikh.
            Every lecture, series, and lesson has been carefully organized to benefit current and future generations of Muslims worldwide.
          </Text>

          {/* Sincere Dua Box */}
          <View style={[styles.duaCard, { backgroundColor: isDark ? '#1E2D1F' : '#F1F8E9', borderColor: colors.primaryLight }]}>
            <Text style={[styles.duaArabic, { color: isDark ? '#A5D6A7' : '#1B5E20' }]}>
              اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاجْعَلْ عِلْمَهُ صَدَقَةً جَارِيَةً تَنْفَعُهُ إِلَى يَوْمِ الدِّينِ
            </Text>
            <Text style={[styles.duaTranslation, { color: colors.textSecondary, fontSize: fonts.xs }]}>
              "O Allah! Forgive him, have mercy upon him, grant him well-being, make his final abode honorable, and let his beneficial knowledge be an ongoing charity (Sadaqah Jariyah) benefiting him until the Day of Judgment."
            </Text>

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
        </View>

        {/* Section 2: The Courses & Curricula */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#0D47A118' }]}>
              <Ionicons name="book-outline" size={22} color="#0D47A1" />
            </View>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fonts.lg }]}>
                The Courses & Curricula
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                مَنَاهِجُ الدِّرَاسَةِ وَالعِلْمِ
              </Text>
            </View>
          </View>

          <Text style={[styles.cardBody, { color: colors.textSecondary, fontSize: fonts.md }]}>
            The Prophet ﷺ said: <Text style={{ fontStyle: 'italic', fontWeight: '600' }}>"Whoever treads a path seeking sacred knowledge, Allah makes easy for him a path to Paradise."</Text> (Sahih Muslim)
          </Text>

          <Text style={[styles.cardBody, { color: colors.textSecondary, fontSize: fonts.md, marginTop: 4 }]}>
            Our curriculum features organized modular series across Aqeedah, Tafsir, Hadith, Fiqh, Seerah, and Arabic. Lessons are arranged from foundational primers to advanced studies.
          </Text>

          {/* Features List */}
          <View style={styles.pillarList}>
            <View style={styles.pillarRow}>
              <Ionicons name="checkmark-circle" size={18} color="#0D47A1" />
              <Text style={[styles.pillarText, { color: colors.text }]}>
                <Text style={{ fontWeight: '700' }}>Structured Curricula:</Text> Clear progression across the core Islamic disciplines.
              </Text>
            </View>

            <View style={styles.pillarRow}>
              <Ionicons name="checkmark-circle" size={18} color="#0D47A1" />
              <Text style={[styles.pillarText, { color: colors.text }]}>
                <Text style={{ fontWeight: '700' }}>Offline-First:</Text> Download audio and video to study anytime, anywhere without data costs.
              </Text>
            </View>

            <View style={styles.pillarRow}>
              <Ionicons name="checkmark-circle" size={18} color="#0D47A1" />
              <Text style={[styles.pillarText, { color: colors.text }]}>
                <Text style={{ fontWeight: '700' }}>Smart Resume:</Text> Automatically remembers your playback position across lessons.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: What is Bunyan? */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#BF360C18' }]}>
              <Ionicons name="layers" size={22} color="#BF360C" />
            </View>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fonts.lg }]}>
                The Bunyan Initiative
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا
              </Text>
            </View>
          </View>

          <Text style={[styles.cardBody, { color: colors.textSecondary, fontSize: fonts.md }]}>
            The Prophet ﷺ said: <Text style={{ fontStyle: 'italic', fontWeight: '600' }}>"The believer to another believer is like a solid building, each part strengthening the other."</Text> (Bukhari & Muslim)
          </Text>

          <Text style={[styles.cardBody, { color: colors.textSecondary, fontSize: fonts.md, marginTop: 4 }]}>
            Bunyan is an independent non-profit initiative created as a perpetual endowment (Waqf) and continuous charity (Sadaqah Jariyah). It is 100% free with zero ads, subscriptions, or paywalls.
          </Text>

          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: colors.primary }]}
            onPress={handleShareApp}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
            <Text style={styles.shareBtnText}>Share Bunyan & Earn Sadaqah</Text>
          </TouchableOpacity>
        </View>

        {/* Replay Onboarding Button */}
        <TouchableOpacity
          style={[styles.replayBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={() => router.push('/onboarding')}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={18} color={colors.primary} />
          <Text style={[styles.replayBtnText, { color: colors.primary }]}>
            Open 3-Page Welcome Walkthrough (Sheikhs, Courses, Bunyan)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  bannerCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  arabicLogo: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#E8F5E9',
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextGroup: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '700',
  },
  cardSubtitle: {
    fontWeight: '600',
    marginTop: 2,
  },
  cardBody: {
    lineHeight: 22,
  },
  duaCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  duaArabic: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
  duaTranslation: {
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
  pillarList: {
    gap: 10,
    marginTop: 4,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  pillarText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    gap: 8,
    marginTop: 4,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
  replayBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
