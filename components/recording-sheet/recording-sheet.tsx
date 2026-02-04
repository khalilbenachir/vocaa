import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import {
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
  useRecordingAnimation,
  useWaveformAnimation,
} from "./use-recording-animation";

import { useRecordingStore } from "@/stores/use-recording-store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

  const {
    isRecording,
    isPaused,
    duration,
    metering,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    deleteRecording,
  } = useRecordingStore();

  useEffect(() => {
    if (isOpen) {
      startRecording();
    } else {
      deleteRecording();
    }
  }, [isOpen, startRecording, deleteRecording]);

  const handleDelete = async () => {
    await deleteRecording();
    onClose();
  };

  const handlePause = async () => {
    if (isPaused) {
      await resumeRecording();
    } else {
      await pauseRecording();
    }
  };

  const handleDone = async () => {
    await stopRecording();
    onClose();
    // Navigate to next screen or do something with the URI
  };

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
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.statusText}>
            {isPaused
              ? i18n.t("recording.paused")
              : i18n.t("recording.recording")}
          </Text>

          <Text style={styles.title}>{i18n.t("recording.newRecord")}</Text>

          <Text style={styles.timer}>{formatTime(duration)}</Text>

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

function Waveform({
  isRecording,
  metering,
}: {
  isRecording: boolean;
  metering: number;
}) {
  // Create a fixed number of bars
  const barCount = 40;
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <View style={styles.waveform}>
      {bars.map((i) => (
        <WaveformBar
          key={i}
          index={i}
          total={barCount}
          isRecording={isRecording}
          metering={metering}
        />
      ))}
      <View style={styles.playhead} />
    </View>
  );
}

function WaveformBar({
  index,
  total,
  isRecording,
  metering,
}: {
  index: number;
  total: number;
  isRecording: boolean;
  metering: number;
}) {
  const animatedStyle = useWaveformAnimation(
    metering,
    index,
    total,
    isRecording,
  );

  return (
    <Animated.View
      style={[
        styles.bar,
        animatedStyle,
        {
          opacity: 0.3 + (index / total) * 0.7,
        },
      ]}
    />
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
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    marginTop: 40,
    marginBottom: 40,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
    backgroundColor: colors.primary,
    marginHorizontal: 1,
  },
  playhead: {
    width: 2,
    height: 44,
    backgroundColor: colors.blue,
    marginLeft: 3,
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
