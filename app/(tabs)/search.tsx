import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont } from '../../src/hooks';
import { courses, lessons, categories } from '../../src/data/mockData';
import { EmptyState } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: 'course' | 'lesson' | 'category';
  icon: string;
};

const TRANSLITERATION_MAP: Record<string, string[]> = {
  'crs-1': ['tawheed', 'tawhid', 'monotheism', 'aqeedah', 'kitab at-tawheed', 'muhammad ibn abd al-wahhab'],
  'crs-2': ['usool', 'usul', 'thalatha', 'three principles', 'aqeedah'],
  'crs-3': ['qawaid', 'four principles', 'qawaid arbaa', 'aqeedah'],
  'crs-4': ['kashf', 'shubuhat', 'removal of doubts'],
  'crs-5': ['tafsir', 'fatiha', 'surah al-fatiha', 'quran', 'amma'],
  'crs-6': ['hadith', 'nawawi', '40 hadith', 'forty hadith'],
  'crs-7': ['fiqh', 'salah', 'umdat al-fiqh', 'prayer'],
  'crs-8': ['seerah', 'prophet', 'life of the prophet', 'sirah'],
  'crs-9': ['nahu', 'sarf', 'grammar', 'arabic', 'ajrumiyyah'],
  'crs-10': ['tajweed', 'quran recitation', 'tuhfat al-atfal'],
  'crs-11': ['adab', 'manner', 'ethics', 'hilyat talib al-ilm'],
};

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase();
}

export default function SearchScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (query.trim().length < 2) return [];
    const qRaw = query.trim().toLowerCase();
    const qNorm = normalizeArabic(qRaw);
    const found: SearchResult[] = [];

    // 1. Search Categories
    categories.forEach(c => {
      const match =
        normalizeArabic(c.name).includes(qNorm) ||
        (c.arabicName && normalizeArabic(c.arabicName).includes(qNorm)) ||
        c.description.toLowerCase().includes(qRaw);
      if (match) {
        found.push({
          id: c.id,
          title: c.name,
          subtitle: c.description,
          type: 'category',
          icon: 'folder-outline',
        });
      }
    });

    // 2. Search Courses / Kitabs
    courses.forEach(c => {
      const translits = TRANSLITERATION_MAP[c.id] || [];
      const match =
        normalizeArabic(c.title).includes(qNorm) ||
        normalizeArabic(c.description).includes(qNorm) ||
        normalizeArabic(c.instructor).includes(qNorm) ||
        translits.some(t => t.includes(qRaw));

      if (match) {
        found.push({
          id: c.id,
          title: c.title,
          subtitle: `${c.instructor} · ${c.totalLessons} دروس`,
          type: 'course',
          icon: 'book-outline',
        });
      }
    });

    // 3. Search Lessons
    lessons.forEach(l => {
      const match =
        normalizeArabic(l.title).includes(qNorm) ||
        normalizeArabic(l.description).includes(qNorm);

      if (match) {
        found.push({
          id: l.id,
          title: l.title,
          subtitle: l.type === 'audio' ? 'درس صوتي' : l.type === 'pdf' ? 'كتاب PDF' : 'درس دراسي',
          type: 'lesson',
          icon: l.type === 'audio' ? 'musical-notes-outline' : 'document-text-outline',
        });
      }
    });

    return found.slice(0, 30);
  }, [query]);

  const handlePress = useCallback((item: SearchResult) => {
    if (item.type === 'category') router.push(`/category/${item.id}`);
    else if (item.type === 'course') router.push(`/course/${item.id}`);
    else router.push(`/lesson/${item.id}`);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontSize: fonts.xxl }]}>البحث</Text>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.icon} />
        <TextInput
          style={[styles.input, { color: colors.text, fontSize: fonts.md, writingDirection: 'auto' }]}
          placeholder="ابحث عن كتاب، باب، أو موضوع..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.icon} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={results}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultRow, { borderColor: colors.border }]}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.resultIcon, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.resultInfo}>
              <Text
                style={[styles.resultTitle, { color: colors.text, fontSize: fonts.md }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={[styles.resultSubtitle, { color: colors.textSecondary, fontSize: fonts.xs }]} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-back" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
        keyExtractor={item => `${item.type}-${item.id}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          query.length >= 2 ? (
            <EmptyState icon="search-outline" title="لا توجد نتائج" subtitle={`لم نجد نتائج مطابقة لـ "${query}"`} />
          ) : (
            <EmptyState icon="search" title="البحث في المكتبة" subtitle="اكتب حرفين أو أكثر للبحث في جميع الكتب والأبواب والدروس" />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
  },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { fontWeight: '800', textAlign: 'left' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 8,
    marginBottom: Spacing.md,
  },
  input: { flex: 1, textAlign: 'right' },
  list: { paddingHorizontal: Spacing.lg, flexGrow: 1 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    gap: Spacing.md,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: { flex: 1 },
  resultTitle: { fontWeight: '700', writingDirection: 'rtl', textAlign: 'left', marginBottom: 2 },
  resultSubtitle: { writingDirection: 'rtl', textAlign: 'left' },
});
