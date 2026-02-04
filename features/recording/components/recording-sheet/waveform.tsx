import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { colors } from "@/theme/colors";
import { useWaveformAnimation } from "./hooks/use-recording-animation";

const BAR_COUNT = 40;

export default function Waveform({
  isRecording,
  metering,
}: {
  isRecording: boolean;
  metering: number;
}) {
  return (
    <View style={styles.waveform}>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
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
