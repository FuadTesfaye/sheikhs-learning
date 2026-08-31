import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont } from '../../src/hooks';
import { useDownloadStore } from '../../src/store';
import { EmptyState } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';

import { useRouter } from 'expo-router';
import { DownloadService } from '../../src/services/downloadService';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function DownloadsScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();
  const rawDownloads = useDownloadStore(s => s.downloads);
  const clearAllDownloads = useDownloadStore(s => s.clearAllDownloads);

  const downloads = useMemo(() => {
    return Object.values(rawDownloads).sort(
      (a, b) => (b.downloadedAt || '').localeCompare(a.downloadedAt || '')
    );
  }, [rawDownloads]);

  const storageUsed = useMemo(() => {
    return Object.values(rawDownloads)
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.fileSize, 0);
  }, [rawDownloads]);

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Downloads',
      'This will remove all downloaded content from your device. You can re-download them later.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAllDownloads },
      ]
    );
  };

  const statusIcons: Record<string, string> = {
    completed: 'checkmark-circle',
    downloading: 'arrow-down-circle',
    paused: 'pause-circle',
    pending: 'time',
    failed: 'alert-circle',
  };

  const statusColors: Record<string, string> = {
    completed: colors.success,
    downloading: colors.primary,
    paused: colors.warning,
    pending: colors.textTertiary,
    failed: colors.error,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text, fontSize: fonts.xxl }]}>Downloads</Text>
          <Text style={[styles.storage, { color: colors.textSecondary, fontSize: fonts.sm }]}>
            {formatBytes(storageUsed)} used \u00b7 Offline Ready
          </Text>
        </View>
        {downloads.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={downloads}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.downloadRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push(`/lesson/${item.lessonId}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.statusIcon, { backgroundColor: (statusColors[item.status] || colors.textTertiary) + '15' }]}>
              <Ionicons
                name={(statusIcons[item.status] || 'ellipse') as any}
                size={24}
                color={statusColors[item.status] || colors.textTertiary}
              />
            </View>
            <View style={styles.downloadInfo}>
              <Text style={[styles.downloadTitle, { color: colors.text, fontSize: fonts.md }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.downloadMeta, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                {item.format.toUpperCase()} \u00b7 {formatBytes(item.fileSize)} \u00b7 {Math.round(item.progress * 100)}%
              </Text>
              {item.status === 'downloading' && (
                <View style={[styles.progressBar, { backgroundColor: colors.progressTrack }]}>
                  <View style={[styles.progressFill, { backgroundColor: colors.progressFill, width: `${item.progress * 100}%` }]} />
                </View>
              )}
            </View>
            <View style={styles.downloadActions}>
              {item.status === 'downloading' && (
                <TouchableOpacity onPress={() => DownloadService.pause(item.id)}>
                  <Ionicons name="pause" size={20} color={colors.text} />
                </TouchableOpacity>
              )}
              {item.status === 'paused' && (
                <TouchableOpacity onPress={() => DownloadService.resume(item.id)}>
                  <Ionicons name="play" size={20} color={colors.text} />
                </TouchableOpacity>
              )}
              {item.status === 'failed' && (
                <TouchableOpacity onPress={() => DownloadService.resume(item.id)}>
                  <Ionicons name="refresh" size={20} color={colors.warning} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => DownloadService.cancel(item.id)}>
                <Ionicons name="close" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="cloud-download-outline"
            title="No Downloads"
            subtitle="Download lessons to access them offline. Tap the download button on any lesson."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { fontWeight: '800' },
  storage: { marginTop: 2 },
  list: { paddingHorizontal: Spacing.lg, flexGrow: 1 },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadInfo: { flex: 1 },
  downloadTitle: { fontWeight: '600', marginBottom: 2 },
  downloadMeta: {},
  progressBar: { height: 4, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  downloadActions: { flexDirection: 'row', gap: Spacing.md },
});
