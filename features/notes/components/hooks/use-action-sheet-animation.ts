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

export const useActionSheetAnimation = (isOpen: boolean) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      backdropOpacity.value = withTiming(1, { duration: 300 });
      sheetTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    } else {
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
