import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  error: string | null;
  togglePlay: () => void;
  seekBy: (seconds: number) => void;
  seekTo: (seconds: number) => void;
  setSpeed: (rate: number) => void;
}

export function useAudioPlayer(
  audioUrl: string | undefined,
  initialPositionSeconds: number = 0,
  fallbackDurationSeconds: number = 1800,
  onCompleted?: () => void
): AudioPlayerState {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialPositionSeconds);
  const [duration, setDuration] = useState(fallbackDurationSeconds);
  const [speed, setSpeedState] = useState(1.0);
  const [error, setError] = useState<string | null>(null);

  // Web HTML5 Audio reference
  const webAudioRef = useRef<any>(null);
  // Native expo-av Sound reference
  const nativeSoundRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  // Cleanup helper
  const cleanup = useCallback(async () => {
    if (Platform.OS === 'web') {
      if (webAudioRef.current) {
        try {
          webAudioRef.current.pause();
          webAudioRef.current.src = '';
        } catch {}
        webAudioRef.current = null;
      }
    } else {
      if (nativeSoundRef.current) {
        try {
          await nativeSoundRef.current.unloadAsync();
        } catch {}
        nativeSoundRef.current = null;
      }
    }
  }, []);

  // Initialize and load audio
  useEffect(() => {
    isMountedRef.current = true;
    if (!audioUrl) return;

    let isCancelled = false;

    async function loadAudio() {
      setIsLoading(true);
      setError(null);

      if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.Audio !== 'undefined') {
        try {
          const audio = new window.Audio(audioUrl);
          audio.preload = 'metadata';
          audio.playbackRate = speed;

          audio.onloadedmetadata = () => {
            if (!isMountedRef.current || isCancelled) return;
            if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
              setDuration(Math.round(audio.duration));
            }
            if (initialPositionSeconds > 0 && initialPositionSeconds < audio.duration) {
              audio.currentTime = initialPositionSeconds;
            }
            setIsLoading(false);
          };

          audio.ontimeupdate = () => {
            if (!isMountedRef.current || isCancelled) return;
            setCurrentTime(audio.currentTime);
          };

          audio.onended = () => {
            if (!isMountedRef.current || isCancelled) return;
            setIsPlaying(false);
            onCompleted?.();
          };

          audio.onerror = () => {
            if (!isMountedRef.current || isCancelled) return;
            setIsLoading(false);
            setIsPlaying(false);
            console.warn('Web audio playback warning for:', audioUrl);
          };

          webAudioRef.current = audio;
        } catch (e: any) {
          setError(e?.message || 'Failed to initialize audio on web');
          setIsLoading(false);
        }
      } else if (Platform.OS !== 'web') {
        // Native iOS/Android via expo-av
        try {
          const { Audio } = require('expo-av');
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
          });

          const { sound, status } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            {
              shouldPlay: false,
              positionMillis: initialPositionSeconds * 1000,
              rate: speed,
              shouldCorrectPitch: true,
            },
            (playbackStatus: any) => {
              if (!isMountedRef.current || isCancelled) return;
              if (playbackStatus.isLoaded) {
                if (playbackStatus.durationMillis) {
                  setDuration(Math.round(playbackStatus.durationMillis / 1000));
                }
                setCurrentTime(Math.round((playbackStatus.positionMillis || 0) / 1000));
                setIsPlaying(playbackStatus.isPlaying);
                setIsLoading(playbackStatus.isBuffering);
                if (playbackStatus.didJustFinish) {
                  setIsPlaying(false);
                  onCompleted?.();
                }
              } else if (playbackStatus.error) {
                setError(playbackStatus.error);
                setIsLoading(false);
              }
            }
          );

          nativeSoundRef.current = sound;
          setIsLoading(false);
        } catch (e: any) {
          // Graceful fallback (e.g., in test or mock environment)
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    loadAudio();

    return () => {
      isCancelled = true;
      isMountedRef.current = false;
      cleanup();
    };
  }, [audioUrl]);

  // Play / Pause toggle
  const togglePlay = useCallback(async () => {
    if (Platform.OS === 'web') {
      const audio = webAudioRef.current;
      if (!audio) return;
      if (audio.paused) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (e) {
          console.warn('Playback play failed:', e);
        }
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      const sound = nativeSoundRef.current;
      if (!sound) {
        // Fallback simulation toggle
        setIsPlaying(prev => !prev);
        return;
      }
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
        }
      } catch {
        setIsPlaying(prev => !prev);
      }
    }
  }, []);

  // Seek by seconds (+10 or -10)
  const seekBy = useCallback(
    (seconds: number) => {
      const nextTime = Math.max(0, Math.min(duration, currentTime + seconds));
      seekTo(nextTime);
    },
    [currentTime, duration]
  );

  // Seek to specific second
  const seekTo = useCallback(
    async (seconds: number) => {
      const bounded = Math.max(0, Math.min(duration, seconds));
      setCurrentTime(bounded);

      if (Platform.OS === 'web') {
        const audio = webAudioRef.current;
        if (audio) {
          audio.currentTime = bounded;
        }
      } else {
        const sound = nativeSoundRef.current;
        if (sound) {
          try {
            await sound.setPositionAsync(bounded * 1000);
          } catch {}
        }
      }
    },
    [duration]
  );

  // Set playback speed
  const setSpeed = useCallback(
    async (newSpeed: number) => {
      setSpeedState(newSpeed);

      if (Platform.OS === 'web') {
        const audio = webAudioRef.current;
        if (audio) {
          audio.playbackRate = newSpeed;
        }
      } else {
        const sound = nativeSoundRef.current;
        if (sound) {
          try {
            await sound.setRateAsync(newSpeed, true);
          } catch {}
        }
      }
    },
    []
  );

  return {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    speed,
    error,
    togglePlay,
    seekBy,
    seekTo,
    setSpeed,
  };
}
