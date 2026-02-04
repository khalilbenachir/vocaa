import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { formatDate, formatDuration } from "@/lib/date";
import { colors } from "@/theme/colors";

interface NoteProps {
  id: string;
  iconName?: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  iconBorderColor: string;
  title: string;
  date: Date;
  duration: number; // duration in seconds
  onPress?: (id: string) => void;
}

const Note = ({
  id,
  iconName = "microphone",
  iconColor,
  iconBackgroundColor = colors.blue,
  iconBorderColor,
  title,
  date,
  duration,
  onPress,
}: NoteProps) => {
  const handlePress = useCallback(() => {
    onPress?.(id);
  }, [id, onPress]);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBackgroundColor,
            borderColor: iconBorderColor,
            borderStyle: "solid",
            borderWidth: 1,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
          size={24}
          color={iconColor}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>{formatDate(date)}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metaText}>{formatDuration(duration)}</Text>
        </View>
      </View>

      <Entypo name="chevron-small-right" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.primaryLight,
  },
  dot: {
    fontSize: 14,
    color: colors.primaryLight,
  },
});

// Custom comparison for memo - handles Date objects properly
export default memo(Note, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.date.getTime() === nextProps.date.getTime() &&
    prevProps.duration === nextProps.duration &&
    prevProps.iconName === nextProps.iconName &&
    prevProps.iconColor === nextProps.iconColor &&
    prevProps.iconBackgroundColor === nextProps.iconBackgroundColor &&
    prevProps.iconBorderColor === nextProps.iconBorderColor &&
    prevProps.onPress === nextProps.onPress
  );
});
