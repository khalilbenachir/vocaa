import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";

import { colors } from "@/theme/colors";
import { useWaveformAnimation } from "./hooks/use-recording-animation";

const BAR_COUNT = 40;

// Stable array of bar indices - defined outside component to avoid recreation
const BAR_INDICES = Array.from({ length: BAR_COUNT }, (_, i) => i);

function Waveform({
  isRecording,
  metering,
}: {
  isRecording: boolean;
  metering: SharedValue<number>;
}) {
  return (
    <View style={styles.waveform}>
      {BAR_INDICES.map((i) => (
        <WaveformBar
          key={i}
          index={i}
          total={BAR_COUNT}
          isRecording={isRecording}
          metering={metering}
        />
      ))}
      <View style={styles.playhead} />
    </View>
  );
}

// Memoized WaveformBar - only re-renders when metering or isRecording changes
const WaveformBar = memo(function WaveformBar({
  index,
  total,
  isRecording,
  metering,
}: {
  index: number;
  total: number;
  isRecording: boolean;
  metering: SharedValue<number>;
}) {
  const animatedStyle = useWaveformAnimation(
    metering,
    index,
    total,
    isRecording,
  );

  // Memoize opacity calculation - only changes when index or total changes
  const opacity = useMemo(() => 0.3 + (index / total) * 0.7, [index, total]);

  return <Animated.View style={[styles.bar, animatedStyle, { opacity }]} />;
});

const styles = StyleSheet.create({
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
});

export default memo(Waveform);
