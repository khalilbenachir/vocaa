import type { AudioRecorder } from "expo-audio";
import {
  AudioModule,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import { create } from "zustand";

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  isStarting: boolean;
  duration: number;
  metering: number;
  recordingUri: string | null;
  recorder: AudioRecorder | null;
  timerInterval: ReturnType<typeof setInterval> | null;

  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  deleteRecording: () => Promise<void>;
  reset: () => void;
}

export const useRecordingStore = create<RecordingState>((set, get) => ({
  isRecording: false,
  isPaused: false,
  isStarting: false,
  duration: 0,
  metering: -160,
  recordingUri: null,
  recorder: null,
  timerInterval: null,

  startRecording: async () => {
    const { isStarting, isRecording } = get();
    if (isStarting || isRecording) return;

    set({ isStarting: true });

    try {
      // Cleanup existing recorder if any
      const { recorder: existingRecorder, timerInterval: existingTimer } =
        get();
      if (existingRecorder) {
        if (existingTimer) clearInterval(existingTimer);
        try {
          if (existingRecorder.isRecording) {
            await existingRecorder.stop();
          }
        } catch (e) {
          console.warn("Error stopping previous recorder", e);
        }
      }

      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        set({ isStarting: false });
        return;
      }

      // Configure audio mode for iOS
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Create new recorder
      // eslint-disable-next-line import/namespace
      const recorder = new AudioModule.AudioRecorder(
        RecordingPresets.HIGH_QUALITY,
      );

      // Prepare settings - expo-audio handles this in constructor or record() or prepareToRecordAsync()
      // `prepareToRecordAsync` exists.
      await recorder.prepareToRecordAsync({
        ...RecordingPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });

      // Start recording
      recorder.record();

      // Start timer
      const interval = setInterval(() => {
        const { recorder } = get();
        if (recorder) {
          // getStatus() is synchronous and returns RecorderState
          const status = recorder.getStatus();
          if (status.isRecording) {
            set((state) => ({
              duration: status.durationMillis,
              metering: status.metering ?? -160,
            }));
          }
        }
      }, 100);

      set({
        isRecording: true,
        isPaused: false,
        recorder,
        timerInterval: interval,
        duration: 0,
        recordingUri: null,
        isStarting: false,
      });
    } catch (err) {
      console.error("Failed to start recording", err);
      set({ isStarting: false });
    }
  },

  pauseRecording: async () => {
    const { recorder, timerInterval } = get();
    if (recorder) {
      recorder.pause(); // Synchronous in docs? "pause(): void"
      if (timerInterval) clearInterval(timerInterval);
      set({ isPaused: true, isRecording: false, timerInterval: null });
    }
  },

  resumeRecording: async () => {
    const { recorder } = get();
    if (recorder) {
      recorder.record(); // record() resumes if paused? Or starts new?
      // "Starts the recording." - often implies resume if paused.
      // IOS AVAudioRecorder record() resumes.
      // Let's assume record() works.

      const interval = setInterval(() => {
        const { recorder } = get();
        if (recorder) {
          const status = recorder.getStatus();
          if (status.isRecording) {
            set((state) => ({
              duration: status.durationMillis,
              metering: status.metering ?? -160,
            }));
          }
        }
      }, 100);

      set({ isPaused: false, isRecording: true, timerInterval: interval });
    }
  },

  stopRecording: async () => {
    const { recorder, timerInterval } = get();
    if (recorder) {
      if (timerInterval) clearInterval(timerInterval);
      await recorder.stop();
      const uri = recorder.uri; // Property access
      set({
        isRecording: false,
        isPaused: false,
        recorder: null,
        recordingUri: uri,
        timerInterval: null,
      });
    }
  },

  deleteRecording: async () => {
    const { recorder, timerInterval } = get();
    if (recorder) {
      if (timerInterval) clearInterval(timerInterval);
      await recorder.stop();
    }
    set({
      isRecording: false,
      isPaused: false,
      duration: 0,
      metering: -160,
      recorder: null,
      recordingUri: null,
      timerInterval: null,
    });
  },

  reset: () => {
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    set({
      isRecording: false,
      isPaused: false,
      duration: 0,
      metering: -160,
      recorder: null,
      recordingUri: null,
      timerInterval: null,
    });
  },
}));
