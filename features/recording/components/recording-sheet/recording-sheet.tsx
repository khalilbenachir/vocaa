import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import {
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import i18n from "@/i18n";
import { colors } from "@/theme/colors";
import {
  RecordingState,
  useRecordingStore,
} from "../../stores/use-recording-store";
import { useAudioMetering } from "./hooks/use-audio-metering"; // Import the hook
import { useRecordingActions } from "./hooks/use-recording-actions";
import { useRecordingAnimation } from "./hooks/use-recording-animation";
import Waveform from "./waveform";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Granular selectors - defined outside component for stability
const selectIsRecording = (state: RecordingState) => state.isRecording;
const selectIsPaused = (state: RecordingState) => state.isPaused;
const selectDuration = (state: RecordingState) => state.duration;
// Removed metering selector
const selectStartRecording = (state: RecordingState) => state.startRecording;
const selectDeleteRecording = (state: RecordingState) => state.deleteRecording;
const selectGeneratedTitle = (state: RecordingState) => state.generatedTitle;
const selectIsProcessingTitle = (state: RecordingState) =>
  state.isProcessingTitle;

interface RecordingSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordingSheet({
  isOpen,
  onClose,
}: RecordingSheetProps) {
  const insets = useSafeAreaInsets();
  const { isVisible, backdropStyle, sheetStyle } =
    useRecordingAnimation(isOpen);

  // Use SharedValue for metering (Reanimated UI thread update)
  const metering = useAudioMetering();

  // Granular subscriptions - only re-render when specific value changes
  const isRecording = useRecordingStore(selectIsRecording);
  const isPaused = useRecordingStore(selectIsPaused);
  const duration = useRecordingStore(selectDuration);
  // Removed metering store subscription
  const startRecording = useRecordingStore(selectStartRecording);
  const deleteRecording = useRecordingStore(selectDeleteRecording);
  const generatedTitle = useRecordingStore(selectGeneratedTitle);
  const isProcessingTitle = useRecordingStore(selectIsProcessingTitle);
  const { handleDelete, handlePause, handleDone } =
    useRecordingActions(onClose);

  useEffect(() => {
    if (isOpen) {
      startRecording();
    } else {
      deleteRecording();
    }
  }, [isOpen, startRecording, deleteRecording]);

  if (!isVisible && !isOpen) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <AnimatedPressable
        style={[styles.backdrop, backdropStyle]}
        onPress={onClose}
      >
        <AnimatedPressable
          style={[
            styles.sheet,
            sheetStyle,
            { paddingBottom: insets.bottom + 28 },
          ]}
          onPress={(e: GestureResponderEvent) => e.stopPropagation()}
        >
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.statusText}>
            {isPaused
              ? i18n.t("recording.paused")
              : i18n.t("recording.recording")}
          </Text>

          <Text style={styles.title}>
            {isProcessingTitle
              ? "..."
              : generatedTitle || i18n.t("recording.newRecord")}
          </Text>

          <Text style={styles.timer}>{formatTime(duration)}</Text>

          {/* Pass SharedValue to Waveform */}
          <Waveform
            isRecording={!isPaused && isRecording}
            metering={metering}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleDelete} style={styles.sideAction}>
              <Text style={styles.deleteText}>
                {i18n.t("recording.delete")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePause}
              style={styles.pauseButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={isPaused ? "play" : "pause"}
                size={38}
                color={colors.red}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDone} style={styles.sideAction}>
              <Text style={styles.doneText}>{i18n.t("recording.done")}</Text>
            </TouchableOpacity>
          </View>
        </AnimatedPressable>
      </AnimatedPressable>
    </Modal>
  );
}

function formatTime(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${pad(mins)}:${pad(s)},${pad(cs)}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handleRow: {
    alignItems: "center",
    marginBottom: 28,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  statusText: {
    textAlign: "center",
    fontSize: 14,
    color: colors.primaryLight,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 8,
  },
  timer: {
    textAlign: "center",
    fontSize: 16,
    color: colors.primaryLight,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  sideAction: {
    width: 72,
  },
  deleteText: {
    color: colors.red,
    fontSize: 18,
    fontWeight: "500",
  },
  doneText: {
    color: colors.cyan,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "right",
  },
  pauseButton: {
    width: 80,
    height: 50,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
});
