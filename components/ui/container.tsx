import { colors } from "@/theme/colors";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = ({ children }: React.PropsWithChildren) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingHorizontal: 16,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        backgroundColor: colors.background,
      }}
    >
      {children}
    </View>
  );
};

export default Container;
