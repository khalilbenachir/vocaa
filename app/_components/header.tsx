import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import i18n from "@/i18n";
import { colors } from "@/theme/colors";

export default function Header() {
  const onClickPro = () => {};
  const onClickSettings = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("header.text1")}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.proBadge} onPress={onClickPro}>
          <Text style={styles.proText}>{i18n.t("header.text2")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onClickSettings}
        >
          <Feather name="settings" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  proBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    textTransform: "uppercase",
  },
  proText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "600",
  },
  settingsButton: {
    padding: 4,
  },
});
