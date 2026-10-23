import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius } from '../theme';

interface KitabCoverProps {
  coverUrl?: any;
  arabicTitle: string;
  author?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  aspectRatio?: number;
  variant?: 'card' | 'detail' | 'compact';
}

const THEME_COLORS: Record<string, { bg: string; border: string; gold: string; spine: string }> = {
  emerald: { bg: '#133529', border: '#D4AF37', gold: '#E5C158', spine: '#0C231B' },
  navy: { bg: '#12253E', border: '#D4AF37', gold: '#E5C158', spine: '#0C182A' },
  maroon: { bg: '#36151B', border: '#D4AF37', gold: '#E5C158', spine: '#230C11' },
  amber: { bg: '#2E2211', border: '#D4AF37', gold: '#E5C158', spine: '#1D150B' },
};

function getCoverTheme(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
  }
  const keys = Object.keys(THEME_COLORS);
  return THEME_COLORS[keys[Math.abs(hash) % keys.length]];
}

export const KitabCover: React.FC<KitabCoverProps> = ({
  coverUrl,
  arabicTitle,
  author,
  width = 96,
  height = 128,
  aspectRatio = 3 / 4,
  variant = 'card',
}) => {
  const [imgError, setImgError] = useState(false);
  const theme = getCoverTheme(arabicTitle);

  const showFallback = !coverUrl || imgError;

  return (
    <View
      style={[
        styles.container,
        {
          width: width as any,
          height: height as any,
          aspectRatio,
          backgroundColor: theme.bg,
        },
      ]}
    >
      {!showFallback ? (
        <Image
          source={typeof coverUrl === 'string' ? { uri: coverUrl } : coverUrl}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Classical Islamic Book Cover Binding Fallback */
        <View style={[styles.leatherCover, { backgroundColor: theme.bg }]}>
          {/* Spine Ribbon Accent */}
          <View style={[styles.spineBand, { backgroundColor: theme.spine }]} />

          {/* Ornamental Inner Golden Border */}
          <View style={[styles.ornamentFrame, { borderColor: theme.border + '70' }]}>
            {/* Top Corner Ornaments */}
            <View style={styles.cornerRow}>
              <Text style={[styles.cornerKnot, { color: theme.gold }]}>❖</Text>
              <View style={[styles.topLine, { backgroundColor: theme.border + '40' }]} />
              <Text style={[styles.cornerKnot, { color: theme.gold }]}>❖</Text>
            </View>

            {/* Central Cartouche with Arabic Calligraphy Title */}
            <View style={styles.centerCartouche}>
              <View style={[styles.medallion, { borderColor: theme.border + '50' }]}>
                <Ionicons name="book-outline" size={variant === 'compact' ? 12 : 16} color={theme.gold} />
              </View>
              <Text
                style={[
                  styles.arabicTitleText,
                  {
                    color: '#FFF8E7',
                    fontSize: variant === 'compact' ? 11 : variant === 'detail' ? 17 : 13,
                  },
                ]}
                numberOfLines={variant === 'compact' ? 2 : 3}
              >
                {arabicTitle}
              </Text>
              {author && variant !== 'compact' && (
                <Text
                  style={[styles.authorText, { color: theme.gold + 'CC' }]}
                  numberOfLines={1}
                >
                  {author}
                </Text>
              )}
            </View>

            {/* Bottom Corner Ornaments */}
            <View style={styles.cornerRow}>
              <Text style={[styles.cornerKnot, { color: theme.gold }]}>❖</Text>
              <View style={[styles.topLine, { backgroundColor: theme.border + '40' }]} />
              <Text style={[styles.cornerKnot, { color: theme.gold }]}>❖</Text>
            </View>
          </View>
        </View>
      )}

      {/* Book 3D Realistic Edge Shadow & Sheen */}
      <View style={styles.leftSpineGlow} />
      <View style={styles.rightPageEdge} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  leatherCover: {
    flex: 1,
    padding: 6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spineBand: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderRightWidth: 1,
    borderRightColor: '#D4AF3740',
  },
  ornamentFrame: {
    flex: 1,
    width: '100%',
    marginLeft: 4,
    borderWidth: 1,
    borderRadius: 3,
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cornerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  cornerKnot: {
    fontSize: 9,
    lineHeight: 11,
  },
  topLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 4,
  },
  centerCartouche: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginVertical: 2,
    width: '100%',
  },
  medallion: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: '#00000025',
  },
  arabicTitleText: {
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 18,
    writingDirection: 'rtl',
  },
  authorText: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
    writingDirection: 'rtl',
  },
  leftSpineGlow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  rightPageEdge: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});
