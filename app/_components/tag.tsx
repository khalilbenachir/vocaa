import React from "react";
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

import { colors } from "../../theme/colors";

type TagVariant = "contained" | "outlined";

interface TagProps {
  label: string;
  variant?: TagVariant;
  icon?: React.ComponentType;
  onPress?: () => void;
}

export default function Tag({
  label,
  variant = "contained",
  icon: Icon,
  onPress,
}: TagProps) {
  const containerStyle: ViewStyle[] = [
    styles.container,
    variant === "contained" ? styles.contained : styles.outlined,
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    variant === "contained" ? styles.containedText : styles.outlinedText,
  ];

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Text style={textStyle}>{label}</Text>
      {Icon && <Icon />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contained: {
    backgroundColor: colors.primary,
  },
  outlined: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 16,
  },
  containedText: {
    color: colors.background,
  },
  outlinedText: {
    color: colors.primary,
  },
});
