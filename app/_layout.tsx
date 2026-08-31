import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLearningStore, useDownloadStore, useSettingsStore } from '../src/store';
import { Colors } from '../src/theme';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const loadLearning = useLearningStore(s => s.loadData);
  const loadDownloads = useDownloadStore(s => s.loadDownloads);
  const loadSettings = useSettingsStore(s => s.loadSettings);
  const theme = useSettingsStore(s => s.theme);

  useEffect(() => {
    Promise.all([loadLearning(), loadDownloads(), loadSettings()]).then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={[styles.loader, { backgroundColor: Colors.light.background }]}> 
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'auto'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="category/[id]" options={{ headerShown: true, headerTitle: 'Category', headerBackTitle: 'Back' }} />
        <Stack.Screen name="course/[id]" options={{ headerShown: true, headerTitle: 'Course', headerBackTitle: 'Back' }} />
        <Stack.Screen name="lesson/[id]" options={{ headerShown: true, headerTitle: 'Lesson', headerBackTitle: 'Back', presentation: 'fullScreenModal' }} />
        <Stack.Screen name="about" options={{ headerShown: true, headerTitle: 'About Bunyan', headerBackTitle: 'Back' }} />
        <Stack.Screen name="admin/index" options={{ headerShown: true, headerTitle: 'Admin Analytics', headerBackTitle: 'Settings' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
