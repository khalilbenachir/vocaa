import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import i18n from "@/i18n";
import { colors } from "../../theme/colors";

interface AddNoteProps {
  duration: number; // in seconds
}

const AddNote = ({ duration }: AddNoteProps) => {
  const spin = useRef(new Animated.Value(0)).current;
  const minutes = Math.max(1, Math.ceil(duration / 60));

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [spin]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Feather name="loader" size={26} color={colors.background} />
        </Animated.View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {i18n.get("notes.creatingNote")}
        </Text>
        <Text style={styles.metaText}>
          {i18n.t("notes.minutesLeft", { count: minutes })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    shadowColor: colors.backdrop,
    borderColor: colors.backdrop,
    borderWidth: 1,
    borderStyle: "solid",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: colors.primary,
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
  metaText: {
    fontSize: 14,
    color: colors.primaryLight,
  },
});

export default AddNote;
