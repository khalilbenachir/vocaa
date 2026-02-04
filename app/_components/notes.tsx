import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { useShallow } from "zustand/react/shallow";

import Note from "@/features/notes/components/note";
import { useNotesStore } from "@/features/notes/stores/use-notes-store";
import { colors } from "@/theme/colors";

const Notes = () => {
  const notes = useNotesStore(
    useShallow((state) =>
      [...state.notes].sort((a, b) => b.date.getTime() - a.date.getTime()),
    ),
  );

  return (
    <FlatList
      data={notes}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item }) => (
        <Note
          icon={() => (
            <MaterialCommunityIcons
              name={(item.iconName || "microphone") as any}
              size={24}
              color={item.iconColor}
            />
          )}
          iconBackgroundColor={item.iconBackgroundColor}
          iconBorderColor={item.iconBorderColor}
          title={item.title}
          date={item.date}
          duration={item.duration}
          onPress={() => console.log("Note pressed:", item.id)}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      contentContainerStyle={styles.listContainer}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary,
  },
});

export default Notes;
