import React, { memo, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { useNotesStore } from "@/features/notes/stores/use-notes-store";
import i18n from "@/i18n";
import { CATEGORIES } from "@/lib/categories";
import Tag from "./tag";

const Tags = () => {
  const selectedCategory = useNotesStore((state) => state.selectedCategory);
  const setSelectedCategory = useNotesStore(
    (state) => state.setSelectedCategory,
  );

  const handleTagPress = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
    },
    [setSelectedCategory],
  );

  const tags = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        key: cat.key,
        label: i18n.t(cat.labelKey),
        variant:
          selectedCategory === cat.key
            ? ("contained" as const)
            : ("outlined" as const),
      })),
    [selectedCategory],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tags.map((tag) => (
        <Tag
          key={tag.key ?? "all"}
          label={tag.label}
          variant={tag.variant}
          onPress={() => handleTagPress(tag.key)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});

export default memo(Tags);
