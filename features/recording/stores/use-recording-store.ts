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

  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  deleteRecording: () => Promise<void>;
  reset: () => void;
}

// Keep mutable instances OUTSIDE the reactive state
// This prevents unnecessary re-renders and proxy overhead
let recorderInstance: AudioRecorder | null = null;
let timerInterval: ReturnType<typeof setInterval> | null = null;

export const useRecordingStore = create<RecordingState>((set, get) => {
  // Helper to centralize polling logic
  const startPolling = () => {
    if (timerInterval) clearInterval(timerInterval);

    // Consider 50ms (20fps) or 16ms (60fps) for smoother waveforms
    timerInterval = setInterval(() => {
      if (recorderInstance?.getStatus().isRecording) {
        set({
          duration: recorderInstance.getStatus().durationMillis,
          metering: recorderInstance.getStatus().metering ?? -160,
        });
      }
    }, 100);
  };

  const stopPolling = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  return {
    isRecording: false,
    isPaused: false,
    isStarting: false,
    duration: 0,
    metering: -160,
    recordingUri: null,

    startRecording: async () => {
      const { isStarting, isRecording } = get();
      if (isStarting || isRecording) return;

      set({ isStarting: true });

      try {
        // Cleanup existing if blindly starting over
        if (recorderInstance) {
          stopPolling();
          try {
            if (recorderInstance.isRecording) {
              await recorderInstance.stop();
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

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        // eslint-disable-next-line import/namespace
        recorderInstance = new AudioModule.AudioRecorder(
          RecordingPresets.HIGH_QUALITY,
        );

        await recorderInstance.prepareToRecordAsync({
          ...RecordingPresets.HIGH_QUALITY,
          isMeteringEnabled: true,
        });

        recorderInstance.record();
        startPolling();

        set({
          isRecording: true,
          isPaused: false,
          isStarting: false,
          duration: 0,
          recordingUri: null,
        });
      } catch (err) {
        console.error("Failed to start recording", err);
        set({ isStarting: false });
      }
    },

    pauseRecording: async () => {
      if (recorderInstance) {
        await recorderInstance.pause();
        stopPolling();
        set({ isPaused: true, isRecording: false });
      }
    },

    resumeRecording: async () => {
      if (recorderInstance) {
        recorderInstance.record();
        startPolling();
        set({ isPaused: false, isRecording: true });
      }
    },

    stopRecording: async () => {
      if (recorderInstance) {
        stopPolling();
        await recorderInstance.stop();
        const uri = recorderInstance.uri;
        recorderInstance = null; // Detach
        set({
          isRecording: false,
          isPaused: false,
          recordingUri: uri,
        });
      }
    },

    deleteRecording: async () => {
      if (recorderInstance) {
        stopPolling();
        // Check if recording or not before stopping?
        // stop() is usually safe or we can try/catch
        try {
          await recorderInstance.stop();
        } catch (e) {
          // ignore if already stopped
        }
        recorderInstance = null;
      }
      set({
        isRecording: false,
        isPaused: false,
        duration: 0,
        metering: -160,
        recordingUri: null,
      });
    },

    reset: () => {
      stopPolling();
      recorderInstance = null;
      set({
        isRecording: false,
        isPaused: false,
        duration: 0,
        metering: -160,
        recordingUri: null,
      });
    },
  };
});
