import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont } from '../hooks';
import { Spacing, BorderRadius } from '../theme';

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  isDownloaded?: boolean;
  isDownloading?: boolean;
  onDownload?: () => void;
  height?: number;
}

export function PdfViewer({
  pdfUrl,
  title,
  isDownloaded = false,
  isDownloading = false,
  onDownload,
  height = 540,
}: PdfViewerProps) {
  const { colors, isDark } = useTheme();
  const fonts = useScaledFont();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenExternal = () => {
    if (pdfUrl) {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      } else {
        Linking.openURL(pdfUrl).catch(err => {
          console.warn('Failed to open PDF URL:', err);
        });
      }
    }
  };

  const viewerHeight = isExpanded ? 720 : height;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Top Header Bar */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.pdfBadge, { backgroundColor: '#D32F2F15', borderColor: '#D32F2F30' }]}>
            <Ionicons name="document-text" size={14} color="#D32F2F" />
            <Text style={[styles.pdfBadgeText, { color: '#D32F2F' }]}>PDF STUDY TEXT</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title || 'Course Textbook & Notes'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {onDownload && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDownloaded ? colors.success + '15' : colors.surfaceVariant,
                  borderColor: isDownloaded ? colors.success : colors.border,
                },
              ]}
              onPress={onDownload}
              activeOpacity={0.7}
              accessibilityLabel="Download PDF notes"
            >
              <Ionicons
                name={isDownloaded ? 'checkmark-circle' : isDownloading ? 'arrow-down-circle' : 'cloud-download-outline'}
                size={16}
                color={isDownloaded ? colors.success : colors.text}
              />
              <Text style={[styles.actionBtnText, { color: isDownloaded ? colors.success : colors.text }]}>
                {isDownloaded ? 'Saved' : isDownloading ? 'Downloading' : 'Download PDF'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surfaceVariant }]}
            onPress={handleOpenExternal}
            activeOpacity={0.7}
            accessibilityLabel="Open PDF in new tab or viewer"
          >
            <Ionicons name="open-outline" size={16} color={colors.text} />
          </TouchableOpacity>

          {Platform.OS === 'web' && (
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.surfaceVariant }]}
              onPress={() => setIsExpanded(prev => !prev)}
              activeOpacity={0.7}
              accessibilityLabel="Toggle PDF height"
            >
              <Ionicons name={isExpanded ? 'contract-outline' : 'expand-outline'} size={16} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main PDF Content View */}
      {Platform.OS === 'web' ? (
        <View style={[styles.frameContainer, { height: viewerHeight, backgroundColor: isDark ? '#1a1a1a' : '#525659' }]}>
          {React.createElement('iframe', {
            src: `${pdfUrl}#toolbar=1&navpanes=0`,
            style: {
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'transparent',
            },
            title: title || 'Course PDF Document',
          })}
        </View>
      ) : (
        /* Mobile Document Card */
        <View style={[styles.mobileCard, { backgroundColor: colors.surfaceVariant }]}>
          <View style={styles.mobileCardIcon}>
            <Ionicons name="book-outline" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.mobileCardTitle, { color: colors.text }]}>
            {title || 'Kitab At-Tawheed Arabic Text'}
          </Text>
          <Text style={[styles.mobileCardSubtitle, { color: colors.textSecondary }]}>
            Original treatise with full vowelization (Tashkeel) and commentary notes.
          </Text>

          <View style={styles.mobileActionsRow}>
            <TouchableOpacity
              style={[styles.mobileOpenBtn, { backgroundColor: colors.primary }]}
              onPress={handleOpenExternal}
              activeOpacity={0.8}
            >
              <Ionicons name="book-outline" size={18} color="#FFFFFF" />
              <Text style={styles.mobileOpenBtnText}>Read in Full Screen</Text>
            </TouchableOpacity>

            {onDownload && (
              <TouchableOpacity
                style={[
                  styles.mobileDownloadBtn,
                  {
                    borderColor: isDownloaded ? colors.success : colors.border,
                    backgroundColor: isDownloaded ? colors.success + '15' : colors.surface,
                  },
                ]}
                onPress={onDownload}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isDownloaded ? 'checkmark-circle' : 'cloud-download-outline'}
                  size={18}
                  color={isDownloaded ? colors.success : colors.text}
                />
                <Text
                  style={[
                    styles.mobileDownloadBtnText,
                    { color: isDownloaded ? colors.success : colors.text },
                  ]}
                >
                  {isDownloaded ? 'Downloaded' : 'Download PDF'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pdfBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: 4,
  },
  pdfBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 5,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    width: '100%',
  },
  mobileCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  mobileCardIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  mobileCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  mobileCardSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
    marginBottom: 8,
  },
  mobileActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mobileOpenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  mobileOpenBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  mobileDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  mobileDownloadBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
