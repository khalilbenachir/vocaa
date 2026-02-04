import { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";
import { meteringService } from "../../../services/metering-service";

export const useAudioMetering = () => {
  const metering = useSharedValue(-160);

  useEffect(() => {
    // Subscribe to the service without triggering React state updates
    const unsubscribe = meteringService.subscribe((value: number) => {
      // Normalize here for convenience? Or keep raw?
      // Let's keep it raw to match previous logic, but ensure it's on UI thread eventually.
      // SharedValue updates are sync on JS thread, then sent to UI.
      metering.value = value;
    });

    return unsubscribe;
  }, [metering]);

  return metering;
};
