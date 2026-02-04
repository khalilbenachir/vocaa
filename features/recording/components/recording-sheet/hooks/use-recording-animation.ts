import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const useRecordingAnimation = (isOpen: boolean) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  // Animation values
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT); // Start off-screen
  const backdropOpacity = useSharedValue(0);

  // Sync internal visibility with prop to handle exit animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Animate In
      backdropOpacity.value = withTiming(1, { duration: 300 });
      sheetTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      // Animate Out
      backdropOpacity.value = withTiming(0, { duration: 300 });
      sheetTranslateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: 300 },
        (finished) => {
          if (finished) {
            runOnJS(setIsVisible)(false);
          }
        },
      );
    }
  }, [isOpen, backdropOpacity, sheetTranslateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  return {
    isVisible,
    backdropStyle,
    sheetStyle,
  };
};

export const useWaveformAnimation = (
  metering: number,
  index: number,
  total: number,
  isRecording: boolean,
) => {
  const height = useSharedValue(10);

  useEffect(() => {
    if (isRecording) {
      // Normalize metering from -160 (silence) to 0 (loud) -> 0 to 1
      // Typically speech is around -40 to 0. Noise floor maybe -60.
      // Let's ensure a floor.
      const floor = -60;
      const normalized = Math.max(0, (metering - floor) / (0 - floor));

      // Add some randomness per bar so they don't move in perfect unison
      // We can use the index to offset the randomness or phase
      const randomFactor = 0.5 + Math.random(); // 0.5 to 1.5 multiplier?
      // Or simply: base min height + normalized * max height * random

      const minHeight = 4;
      const maxHeight = 40;

      const targetHeight = minHeight + normalized * maxHeight * randomFactor;

      height.value = withTiming(targetHeight, {
        duration: 100, // Match update interval roughly
        easing: Easing.linear,
      });
    } else {
      height.value = withTiming(4, { duration: 300 });
    }
  }, [metering, isRecording, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return animatedStyle;
};
