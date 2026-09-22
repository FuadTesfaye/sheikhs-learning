import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  ActivityIndicator,
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
  height = 560,
}: PdfViewerProps) {
  const { colors, isDark } = useTheme();
  const fonts = useScaledFont();
  const [isExpanded, setIsExpanded] = useState(false);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const viewerHeight = isExpanded ? 780 : height;

  // Compute the iframe src: native browser PDF vs Google Docs Viewer fallback
  const iframeSrc = useGoogleViewer
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
    : `${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`;

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
            <Ionicons name="document-text" size={13} color="#D32F2F" />
            <Text style={[styles.pdfBadgeText, { color: '#D32F2F' }]}>كِتَابُ التَّوْحِيدِ</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              Kitab At-Tawheed Study Text
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              Arabic text with vowelization & commentary
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Download PDF Button */}
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
              accessibilityLabel="Download Kitab At-Tawheed PDF"
            >
              <Ionicons
                name={isDownloaded ? 'checkmark-circle' : isDownloading ? 'arrow-down-circle' : 'cloud-download-outline'}
                size={15}
                color={isDownloaded ? colors.success : colors.text}
              />
              <Text style={[styles.actionBtnText, { color: isDownloaded ? colors.success : colors.text }]}>
                {isDownloaded ? 'Saved' : isDownloading ? 'Saving...' : 'Download PDF'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Viewer Engine Toggle on Web (Direct vs Google Docs) */}
          {Platform.OS === 'web' && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
              onPress={() => {
                setIsLoading(true);
                setUseGoogleViewer(prev => !prev);
              }}
              activeOpacity={0.7}
              accessibilityLabel="Toggle PDF viewer engine"
            >
              <Ionicons name="sync-outline" size={14} color={colors.text} />
              <Text style={[styles.actionBtnText, { color: colors.text }]}>
                {useGoogleViewer ? 'Native Mode' : 'GDocs Mode'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Open in full external tab */}
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surfaceVariant }]}
            onPress={handleOpenExternal}
            activeOpacity={0.7}
            accessibilityLabel="Open PDF in new tab or external reader"
          >
            <Ionicons name="open-outline" size={16} color={colors.text} />
          </TouchableOpacity>

          {/* Expand / Collapse Height on Web */}
          {Platform.OS === 'web' && (
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.surfaceVariant }]}
              onPress={() => setIsExpanded(prev => !prev)}
              activeOpacity={0.7}
              accessibilityLabel="Toggle reader height"
            >
              <Ionicons name={isExpanded ? 'contract-outline' : 'expand-outline'} size={16} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main PDF Content View */}
      {Platform.OS === 'web' ? (
        <View style={[styles.frameContainer, { height: viewerHeight, backgroundColor: isDark ? '#1a1a1a' : '#525659' }]}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: '#E0E0E0' }]}>Loading Kitab At-Tawheed Text...</Text>
            </View>
          )}
          {React.createElement('iframe', {
            key: iframeSrc,
            src: iframeSrc,
            style: {
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'transparent',
            },
            onLoad: () => setIsLoading(false),
            title: 'Kitab At-Tawheed PDF Document',
          })}
        </View>
      ) : (
        /* Mobile Native Document Card */
        <View style={[styles.mobileCard, { backgroundColor: colors.surfaceVariant }]}>
          <View style={[styles.mobileCardIcon, { backgroundColor: colors.surface }]}>
            <Ionicons name="book-outline" size={44} color={colors.primary} />
          </View>
          <Text style={[styles.mobileCardTitle, { color: colors.text }]}>
            Kitab At-Tawheed (كتاب التوحيد)
          </Text>
          <Text style={[styles.mobileCardSubtitle, { color: colors.textSecondary }]}>
            Full classical Arabic text with vowelization (Tashkeel) and commentary notes (9.9 MB).
          </Text>

          <View style={styles.mobileActionsRow}>
            <TouchableOpacity
              style={[styles.mobileOpenBtn, { backgroundColor: colors.primary }]}
              onPress={handleOpenExternal}
              activeOpacity={0.8}
            >
              <Ionicons name="book-outline" size={17} color="#FFFFFF" />
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
                  size={17}
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

      {/* Reader Hint Footer */}
      <View style={[styles.footerHint, { borderTopColor: colors.border }]}>
        <Ionicons name="information-circle-outline" size={14} color={colors.textTertiary} />
        <Text style={[styles.footerHintText, { color: colors.textSecondary }]}>
          Scroll to read along with the Sheikh's explanation. The audio player below stays active while you read.
        </Text>
      </View>
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
    paddingVertical: 9,
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
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
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
    paddingHorizontal: 9,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 5,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    width: '100%',
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mobileCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  mobileCardIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
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
    maxWidth: 340,
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
  footerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  footerHintText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
