import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { formatDate, formatDuration } from "@/lib/date";
import { colors } from "@/theme/colors";

interface FailedNoteProps {
  id: string;
  title: string;
  date: Date;
  duration: number;
  error?: string;
  onRetry: (id: string) => void;
  iconColor?: string;
  iconBackgroundColor?: string;
  iconBorderColor?: string;
}

const FailedNote = ({
  id,
  title,
  date,
  duration,
  error,
  onRetry,
  iconColor = colors.red,
  iconBackgroundColor = colors.redLighter,
  iconBorderColor = colors.redLight,
}: FailedNoteProps) => {
  const handleRetry = useCallback(() => {
    onRetry(id);
  }, [id, onRetry]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBackgroundColor,
            borderColor: iconBorderColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="microphone"
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
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={12} color={colors.red} />
          <Text style={styles.errorText}>
            {error || "Transcription failed"}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Feather name="refresh-cw" size={18} color={colors.background} />
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    backgroundColor: colors.redLighter,
    borderRadius: 8,
    marginHorizontal: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.background,
  },
});

// Custom comparison for memo - handles Date objects properly
export default memo(FailedNote, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.date.getTime() === nextProps.date.getTime() &&
    prevProps.duration === nextProps.duration &&
    prevProps.error === nextProps.error &&
    prevProps.iconColor === nextProps.iconColor &&
    prevProps.iconBackgroundColor === nextProps.iconBackgroundColor &&
    prevProps.iconBorderColor === nextProps.iconBorderColor &&
    prevProps.onRetry === nextProps.onRetry
  );
});
