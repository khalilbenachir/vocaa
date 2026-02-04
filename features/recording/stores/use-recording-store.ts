import type { AudioRecorder } from "expo-audio";
import {
  AudioModule,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import { create } from "zustand";
import { meteringService } from "../services/metering-service";

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  isStarting: boolean;
  duration: number;
  // Metering is now handled via MeteringService/SharedValue
  recordingUri: string | null;

  // Transcription State
  transcript: string | null;
  generatedTitle: string | null;
  isProcessingTitle: boolean; // True while generating the 10s title
  isTranscribing: boolean; // True while generating the final transcript

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

    // Update interval: 100ms
    timerInterval = setInterval(() => {
      if (recorderInstance?.getStatus().isRecording) {
        const status = recorderInstance.getStatus();

        // 1. Emit metering directly to listeners (UI Thread / SharedValues)
        // This bypasses the Store and prevents re-renders!
        meteringService.emit(status.metering ?? -160);

        // 2. Update Duration in Store
        // We still update this, but components should only subscribe if they need it.
        // Optimization: Component could use a local timer sync, but for 1s precision
        // updating every 100ms in store is a bit wasteful but strictly less than 10Hz if we check diff.
        // Actually, let's only update the store state if the second has changed?
        // No, for smooth timers we might want it.
        // Let's keep it simple: Update duration. Components that need it (Timer) will re-render.
        // Components that DON'T need it (Waveform) won't, because we removed `metering` from store.
        set({ duration: status.durationMillis });
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
    recordingUri: null,
    transcript: null,
    generatedTitle: null,
    isProcessingTitle: false,
    isTranscribing: false,

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
          transcript: null,
          generatedTitle: null,
          isProcessingTitle: false,
          isTranscribing: false,
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
        try {
          await recorderInstance.stop();
        } catch (e) {
          // ignore
        }
        recorderInstance = null;
      }
      set({
        isRecording: false,
        isPaused: false,
        duration: 0,
        recordingUri: null,
        transcript: null,
        generatedTitle: null,
        isProcessingTitle: false,
        isTranscribing: false,
      });
    },

    reset: () => {
      stopPolling();
      recorderInstance = null;
      set({
        isRecording: false,
        isPaused: false,
        duration: 0,
        recordingUri: null,
        transcript: null,
        generatedTitle: null,
        isProcessingTitle: false,
        isTranscribing: false,
      });
    },
  };
});
