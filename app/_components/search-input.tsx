import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import i18n from "@/i18n";
import { colors } from "@/theme/colors";

export default function SearchInput() {
  return (
    <View style={styles.container}>
      <Feather
        name={i18n.get("search.text1")}
        size={20}
        color={colors.primary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.get("search.text2")}
        placeholderTextColor={`${colors.primary}80`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.primary,
  },
});
