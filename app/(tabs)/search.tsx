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

export default function SearchScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const found: SearchResult[] = [];

    categories.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        found.push({ id: c.id, title: c.name, subtitle: c.description, type: 'category', icon: 'folder-outline' });
      }
    });

    courses.forEach(c => {
      if (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        found.push({ id: c.id, title: c.title, subtitle: `${c.totalLessons} lessons \u00b7 ${c.level}`, type: 'course', icon: 'book-outline' });
      }
    });

    lessons.forEach(l => {
      if (l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)) {
        found.push({ id: l.id, title: l.title, subtitle: `${l.type} lesson`, type: 'lesson', icon: l.type === 'video' ? 'videocam-outline' : l.type === 'audio' ? 'musical-notes-outline' : 'document-text-outline' });
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
        <Text style={[styles.title, { color: colors.text, fontSize: fonts.xxl }]}>Search</Text>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.icon} />
        <TextInput
          style={[styles.input, { color: colors.text, fontSize: fonts.md }]}
          placeholder="Search courses, lessons..."
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
          >
            <View style={[styles.resultIcon, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.resultInfo}>
              <Text style={[styles.resultTitle, { color: colors.text, fontSize: fonts.md }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.resultSubtitle, { color: colors.textSecondary, fontSize: fonts.xs }]} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
        keyExtractor={item => `${item.type}-${item.id}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          query.length >= 2 ? (
            <EmptyState icon="search-outline" title="No Results" subtitle={`No matches found for "${query}"`} />
          ) : (
            <EmptyState icon="search" title="Search Content" subtitle="Type at least 2 characters to search across all courses and lessons" />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { fontWeight: '800' },
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
  input: { flex: 1 },
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
  resultTitle: { fontWeight: '600' },
  resultSubtitle: {},
});
