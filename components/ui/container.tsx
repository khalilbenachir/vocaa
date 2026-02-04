import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

const Container = ({ children }: React.PropsWithChildren) => {
  const insets = useSafeAreaInsets();

  // Memoize style based on insets to avoid creating new object every render
  const containerStyle = useMemo(
    () => ({
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingHorizontal: 16,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 22,
      backgroundColor: colors.background,
    }),
    [insets.top, insets.bottom],
  );

  return <View style={containerStyle}>{children}</View>;
};

export default memo(Container);
