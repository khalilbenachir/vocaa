import { useEffect, useMemo, useState } from "react";
import { Dimensions } from "react-native";
import {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
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
  metering: SharedValue<number>,
  index: number,
  total: number,
  isRecording: boolean,
) => {
  // Stable pseudo-random factor based on bar index - computed once per bar
  const randomFactor = useMemo(() => {
    const seed = (index * 2654435761) % 2 ** 32;
    return 0.5 + (seed / 2 ** 32) * 0.5; // Range: 0.5 to 1.0
  }, [index]);

  // Derived value reacts to metering changes on UI thread
  const height = useDerivedValue(() => {
    if (!isRecording) {
      return withTiming(4, { duration: 300 });
    }

    // Normalize metering from -160 (silence) to 0 (loud) -> 0 to 1
    const floor = -60;
    const currentMetering = metering.value;
    const normalized = Math.max(0, (currentMetering - floor) / (0 - floor));

    const minHeight = 4;
    const maxHeight = 40;

    const targetHeight = minHeight + normalized * maxHeight * randomFactor;

    return withTiming(targetHeight, {
      duration: 100,
      easing: Easing.linear,
    });
  }, [isRecording, randomFactor]); // check dependencies carefully

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return animatedStyle;
};
