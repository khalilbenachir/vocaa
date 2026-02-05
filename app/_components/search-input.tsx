import { Feather } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { useNotesStore } from "@/features/notes/stores/use-notes-store";
import i18n from "@/i18n";
import { colors } from "@/theme/colors";

export default function SearchInput() {
  const searchQuery = useNotesStore((state) => state.searchQuery);
  const setSearchQuery = useNotesStore((state) => state.setSearchQuery);

  const handleChangeText = useCallback(
    (text: string) => {
      setSearchQuery(text);
    },
    [setSearchQuery],
  );

  return (
    <View style={styles.container}>
      <Feather
        name="search"
        size={20}
        color={colors.primary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t("search.text2")}
        placeholderTextColor={`${colors.primary}80`}
        value={searchQuery}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        autoCorrect={false}
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
