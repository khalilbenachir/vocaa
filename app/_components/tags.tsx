import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import i18n from "@/i18n";
import Tag from "./tag";

const Tags = () => {
  const tags = [
    { label: i18n.get("tags.text1"), variant: "contained" as const },
    { label: i18n.get("tags.text2"), variant: "outlined" as const },
    { label: i18n.get("tags.text3"), variant: "outlined" as const },
    { label: i18n.get("tags.text4"), variant: "outlined" as const },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tags.map((tag, index) => (
        <Tag key={`tag-${index}`} label={tag.label} variant={tag.variant} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});

export default Tags;
