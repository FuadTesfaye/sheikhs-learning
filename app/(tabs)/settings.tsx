import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont } from '../../src/hooks';
import { useSettingsStore, useLearningStore, useDownloadStore } from '../../src/store';
import { Spacing, BorderRadius } from '../../src/theme';
import { ThemeMode, TextSize } from '../../src/types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();
  const theme = useSettingsStore(s => s.theme);
  const textSize = useSettingsStore(s => s.textSize);
  const setTheme = useSettingsStore(s => s.setTheme);
  const setTextSize = useSettingsStore(s => s.setTextSize);
  const setOnboardingCompleted = useSettingsStore(s => s.setOnboardingCompleted);
  const clearLearning = useLearningStore(s => s.clearAll);
  const clearDownloads = useDownloadStore(s => s.clearAllDownloads);
  const clearCacheOnly = useDownloadStore(s => s.clearCacheOnly);
  const rawDownloads = useDownloadStore(s => s.downloads);

  const storageBreakdown = useMemo(() => {
    const completed = Object.values(rawDownloads).filter(d => d.status === 'completed');
    let audioBytes = 0;
    let pdfBytes = 0;

    completed.forEach(item => {
      const size = item.fileSize || item.downloadedBytes || 0;
      if (item.format === 'audio') {
        audioBytes += size;
      } else if (item.format === 'pdf') {
        pdfBytes += size;
      }
    });

    return {
      audioBytes,
      pdfBytes,
      totalBytes: audioBytes + pdfBytes,
      completedCount: completed.length,
    };
  }, [rawDownloads]);

  const themes: { label: string; value: ThemeMode }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  const textSizes: { label: string; value: TextSize }[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];

  const handleClearCache = async () => {
    await clearCacheOnly();
    Alert.alert('تم مسح الذاكرة المؤقتة', 'تم تفريغ الملفات المؤقتة بنجاح مع الحفاظ الكامل على كتبك ودروسك المحفوظة دون اتصال.');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will reset all progress, bookmarks, and downloads. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearLearning();
            clearDownloads();
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleReplayOnboarding = () => {
    setOnboardingCompleted(false);
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, fontSize: fonts.xxl }]}>Settings</Text>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fonts.sm }]}>APPEARANCE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text, fontSize: fonts.md }]}>Theme</Text>
            <View style={styles.optionRow}>
              {themes.map(t => (
                <TouchableOpacity
                  key={t.value}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: theme === t.value ? colors.primary : colors.surfaceVariant,
                    },
                  ]}
                  onPress={() => setTheme(t.value)}
                >
                  <Text style={[
                    styles.chipText,
                    {
                      color: theme === t.value ? '#fff' : colors.text,
                      fontSize: fonts.sm,
                    },
                  ]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Text Size */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fonts.sm }]}>TEXT SIZE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text, fontSize: fonts.md }]}>Font Size</Text>
            <View style={styles.optionRow}>
              {textSizes.map(s => (
                <TouchableOpacity
                  key={s.value}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: textSize === s.value ? colors.primary : colors.surfaceVariant,
                    },
                  ]}
                  onPress={() => setTextSize(s.value)}
                >
                  <Text style={[
                    styles.chipText,
                    {
                      color: textSize === s.value ? '#fff' : colors.text,
                      fontSize: fonts.sm,
                    },
                  ]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.previewText, { color: colors.textSecondary, fontSize: fonts.md }]}>
              This is a preview of the current text size. Adjust to your preference.
            </Text>
          </View>
        </View>

        {/* Storage & Cache Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fonts.sm }]}>STORAGE & CACHE (إدارة المساحة والذاكرة)</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.sm }]}>الدروس الصوتية المحفوظة (Audio)</Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.sm }]}>
                {formatBytes(storageBreakdown.audioBytes)}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.sm }]}>الكتب ومتون الدراسة (PDF)</Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.sm }]}>
                {formatBytes(storageBreakdown.pdfBytes)}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.sm, fontWeight: '700' }]}>إجمالي المساحة المستخدمة</Text>
              <Text style={[styles.aboutValue, { color: colors.primary, fontSize: fonts.sm, fontWeight: '700' }]}>
                {formatBytes(storageBreakdown.totalBytes)} ({storageBreakdown.completedCount} ملفات)
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={[styles.storageActionBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
              <Text style={[styles.storageActionText, { color: colors.text, fontSize: fonts.sm }]}>
                تنظيف الذاكرة المؤقتة (Clear Temp Cache)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fonts.sm }]}>GENERAL</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/about')}>
              <Ionicons name="heart-circle-outline" size={22} color="#1B5E20" />
              <Text style={[styles.menuText, { color: colors.text, fontSize: fonts.md }]}>About (Sheikhs, Courses & Bunyan)</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/admin')}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
              <Text style={[styles.menuText, { color: colors.text, fontSize: fonts.md }]}>Admin Analytics Portal</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.menuRow} onPress={handleReplayOnboarding}>
              <Ionicons name="refresh-outline" size={22} color={colors.text} />
              <Text style={[styles.menuText, { color: colors.text, fontSize: fonts.md }]}>Welcome Walkthrough (3 Pages)</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.menuRow} onPress={handleClearData}>
              <Ionicons name="trash-outline" size={22} color={colors.error} />
              <Text style={[styles.menuText, { color: colors.error, fontSize: fonts.md }]}>Clear All Data</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fonts.sm }]}>ABOUT</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.sm }]}>Version</Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.sm }]}>1.0.0</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.sm }]}>Content</Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.sm }]}>100% Free & Ad-Free</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.sm }]}>Privacy</Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.sm }]}>No data shared</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { fontWeight: '800' },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  label: { fontWeight: '600', marginBottom: Spacing.md },
  optionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  chipText: { fontWeight: '600' },
  previewText: { lineHeight: 22 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  menuText: { flex: 1, fontWeight: '500' },
  divider: { height: 1, marginVertical: Spacing.sm },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  aboutLabel: {},
  aboutValue: { fontWeight: '500' },
  storageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
    marginTop: Spacing.xs,
  },
  storageActionText: {
    fontWeight: '600',
  },
});
