import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { formatDate, formatDuration } from "@/lib/date";
import { colors } from "../../theme/colors";

interface NoteProps {
  icon?: React.ComponentType;
  iconBackgroundColor?: string;
  title: string;
  date: Date;
  duration: number; // duration in seconds
  onPress?: () => void;
  iconBorderColor: string;
}

const Note = ({
  icon: Icon,
  iconBackgroundColor = colors.blue,
  title,
  date,
  duration,
  onPress,
  iconBorderColor,
}: NoteProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {Icon && (
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
          <Icon />
        </View>
      )}
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

export default Note;
