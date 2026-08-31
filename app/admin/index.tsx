import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont } from '../../src/hooks';
import { useAdminStore } from '../../src/store';
import { Spacing, BorderRadius } from '../../src/theme';

export default function AdminDashboardScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();

  const analytics = useAdminStore(s => s.analytics);
  const isUnlocked = useAdminStore(s => s.isUnlocked);
  const unlockAdmin = useAdminStore(s => s.unlockAdmin);
  const lockAdmin = useAdminStore(s => s.lockAdmin);
  const exportReportCsv = useAdminStore(s => s.exportReportCsv);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleUnlock = () => {
    const success = unlockAdmin(pinInput.trim());
    if (!success) {
      setPinError(true);
      Alert.alert('Access Denied', 'Invalid PIN. Try "1234" or "admin".');
    } else {
      setPinError(false);
      setPinInput('');
    }
  };

  const handleExport = async () => {
    try {
      const csvData = exportReportCsv();
      await Share.share({
        title: "Sheikh's Learning App - Analytics Report",
        message: csvData,
      });
    } catch (error) {
      Alert.alert('Export Notice', 'Analytics report ready for export.');
    }
  };

  if (!isUnlocked) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            headerTitle: 'Admin Portal',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
          }}
        />
        <View style={styles.lockContainer}>
          <View style={[styles.lockIconCircle, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="shield-checkmark" size={60} color={colors.primary} />
          </View>
          <Text style={[styles.lockTitle, { color: colors.text, fontSize: fonts.xxl }]}>
            Administrator Access
          </Text>
          <Text style={[styles.lockSubtitle, { color: colors.textSecondary, fontSize: fonts.sm }]}>
            Enter PIN to view learner engagement, retention metrics, and course drop-off reports.
          </Text>

          <View style={[styles.pinInputWrapper, { backgroundColor: colors.surface, borderColor: pinError ? colors.error : colors.border }]}>
            <Ionicons name="key-outline" size={20} color={colors.icon} />
            <TextInput
              style={[styles.pinInput, { color: colors.text, fontSize: fonts.lg }]}
              placeholder="Enter PIN (e.g. 1234)"
              placeholderTextColor={colors.textTertiary}
              value={pinInput}
              onChangeText={(text) => {
                setPinInput(text);
                setPinError(false);
              }}
              secureTextEntry
              keyboardType="number-pad"
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.unlockButton, { backgroundColor: colors.primary }]}
            onPress={handleUnlock}
          >
            <Text style={styles.unlockButtonText}>Unlock Dashboard</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.hintText, { color: colors.textTertiary, fontSize: fonts.xs }]}>
            Default access code: 1234
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: 'Admin Analytics',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerRight: () => (
            <TouchableOpacity onPress={lockAdmin} style={{ marginRight: 8 }}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title & Actions */}
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={[styles.dashboardTitle, { color: colors.text, fontSize: fonts.xxl }]}>
              Learner Engagement
            </Text>
            <Text style={[styles.dashboardSubtitle, { color: colors.textSecondary, fontSize: fonts.xs }]}>
              Privacy-first aggregate analytics for the Sheikh's team
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.exportBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
            onPress={handleExport}
          >
            <Ionicons name="download-outline" size={16} color={colors.primary} />
            <Text style={[styles.exportBtnText, { color: colors.primary, fontSize: fonts.xs }]}>
              Export CSV
            </Text>
          </TouchableOpacity>
        </View>

        {/* High-level KPI Grid */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.kpiIconBox, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name="people" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.text, fontSize: fonts.xl }]}>
              {analytics.totalLearners.toLocaleString()}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary, fontSize: fonts.xs }]}>
              Total Learners
            </Text>
            <Text style={[styles.kpiSub, { color: colors.success, fontSize: fonts.xs }]}>
              +{analytics.newSignupsThisMonth} this month
            </Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#0D47A1' + '18' }]}>
              <Ionicons name="pulse" size={20} color="#0D47A1" />
            </View>
            <Text style={[styles.kpiValue, { color: colors.text, fontSize: fonts.xl }]}>
              {analytics.dailyActiveUsers.toLocaleString()}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary, fontSize: fonts.xs }]}>
              Daily Active (DAU)
            </Text>
            <Text style={[styles.kpiSub, { color: colors.textTertiary, fontSize: fonts.xs }]}>
              {analytics.weeklyActiveUsers.toLocaleString()} weekly
            </Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#E65100' + '18' }]}>
              <Ionicons name="time" size={20} color="#E65100" />
            </View>
            <Text style={[styles.kpiValue, { color: colors.text, fontSize: fonts.xl }]}>
              {(analytics.totalStudyHours / 1000).toFixed(1)}k hrs
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary, fontSize: fonts.xs }]}>
              Study Hours
            </Text>
            <Text style={[styles.kpiSub, { color: colors.textTertiary, fontSize: fonts.xs }]}>
              {analytics.averageLessonsPerLearner} lessons / user
            </Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#4A148C' + '18' }]}>
              <Ionicons name="cloud-done" size={20} color="#4A148C" />
            </View>
            <Text style={[styles.kpiValue, { color: colors.text, fontSize: fonts.xl }]}>
              {analytics.totalOfflineDownloads.toLocaleString()}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary, fontSize: fonts.xs }]}>
              Offline Downloads
            </Text>
            <Text style={[styles.kpiSub, { color: colors.success, fontSize: fonts.xs }]}>
              82% offline usage
            </Text>
          </View>
        </View>

        {/* Overall Completion Banner */}
        <View style={[styles.completionBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.completionHeader}>
            <Text style={[styles.completionTitle, { color: colors.text, fontSize: fonts.md }]}>
              Overall Completion Health
            </Text>
            <Text style={[styles.completionRate, { color: colors.primary, fontSize: fonts.lg }]}>
              {analytics.overallCompletionRate}%
            </Text>
          </View>
          <View style={[styles.completionTrack, { backgroundColor: colors.progressTrack }]}>
            <View
              style={[
                styles.completionFill,
                { backgroundColor: colors.progressFill, width: `${analytics.overallCompletionRate}%` },
              ]}
            />
          </View>
          <Text style={[styles.completionFootnote, { color: colors.textSecondary, fontSize: fonts.xs }]}>
            {analytics.coursesCompleted.toLocaleString()} courses completed of {analytics.coursesStarted.toLocaleString()} enrolled.
          </Text>
        </View>

        {/* Course-by-Course Breakdown & Drop-off Analysis */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fonts.lg }]}>
            Course Analytics & Drop-off Points
          </Text>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary, fontSize: fonts.xs }]}>
            Identify where learners succeed and where they need more encouragement.
          </Text>

          {analytics.courseAnalytics.map((course) => (
            <View
              key={course.courseId}
              style={[styles.courseRowCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.courseRowTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.courseRowTitle, { color: colors.text, fontSize: fonts.md }]} numberOfLines={1}>
                    {course.courseTitle}
                  </Text>
                  <Text style={[styles.courseRowCategory, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                    {course.categoryName} \u00b7 {course.totalHoursWatched.toLocaleString()} hrs watched
                  </Text>
                </View>
                <View style={[styles.rateBadge, { backgroundColor: colors.primary + '18' }]}>
                  <Text style={[styles.rateBadgeText, { color: colors.primary, fontSize: fonts.sm }]}>
                    {course.completionRate}%
                  </Text>
                </View>
              </View>

              {/* Progress visual */}
              <View style={[styles.rowProgressBar, { backgroundColor: colors.progressTrack }]}>
                <View
                  style={[
                    styles.rowProgressFill,
                    { backgroundColor: colors.progressFill, width: `${course.completionRate}%` },
                  ]}
                />
              </View>

              <View style={styles.courseRowBottom}>
                <Text style={[styles.courseStatText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                  {course.enrolledUsers.toLocaleString()} enrolled \u00b7 {course.completedUsers.toLocaleString()} finished
                </Text>
                <View style={styles.dropOffBadge}>
                  <Ionicons name="alert-circle-outline" size={12} color="#D32F2F" />
                  <Text style={[styles.dropOffText, { fontSize: fonts.xs }]}>
                    Drop-off: L{course.dropOffLessonOrder}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  lockContainer: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  lockIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  lockTitle: { fontWeight: '800', textAlign: 'center', marginBottom: Spacing.sm },
  lockSubtitle: { textAlign: 'center', lineHeight: 20, marginBottom: Spacing.xl, paddingHorizontal: Spacing.md },
  pinInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 10,
    marginBottom: Spacing.lg,
  },
  pinInput: { flex: 1 },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    gap: 8,
    marginBottom: Spacing.md,
  },
  unlockButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  hintText: { textAlign: 'center' },

  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dashboardTitle: { fontWeight: '800' },
  dashboardSubtitle: { marginTop: 2 },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  exportBtnText: { fontWeight: '700' },

  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  kpiCard: {
    flexBasis: 150,
    flexGrow: 1,
    minWidth: 140,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  kpiValue: { fontWeight: '800', marginBottom: 2 },
  kpiLabel: { fontWeight: '600', marginBottom: 2 },
  kpiSub: { fontWeight: '500' },

  completionBanner: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  completionTitle: { fontWeight: '700' },
  completionRate: { fontWeight: '800' },
  completionTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  completionFill: { height: '100%', borderRadius: 4 },
  completionFootnote: { fontWeight: '500' },

  section: { marginTop: Spacing.sm },
  sectionTitle: { fontWeight: '800', marginBottom: 2 },
  sectionDesc: { marginBottom: Spacing.md },

  courseRowCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  courseRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  courseRowTitle: { fontWeight: '700' },
  courseRowCategory: { marginTop: 2 },
  rateBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  rateBadgeText: { fontWeight: '800' },
  rowProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  rowProgressFill: { height: '100%', borderRadius: 3 },
  courseRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseStatText: {},
  dropOffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  dropOffText: { color: '#D32F2F', fontWeight: '600' },
});
