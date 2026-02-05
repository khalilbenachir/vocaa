import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { useRouter } from "expo-router";

import FailedNote from "@/features/notes/components/failed-note";
import Note from "@/features/notes/components/note";
import {
  useNotesStore,
  useSortedNotes,
} from "@/features/notes/stores/use-notes-store";
import { Note as NoteType } from "@/features/notes/types";
import { colors } from "@/theme/colors";

// Stable key extractor - defined outside component to avoid recreation
const keyExtractor = (item: NoteType) => item.id;

// Item height for getItemLayout optimization (container padding + content)
const ITEM_HEIGHT = 80;
const SEPARATOR_HEIGHT = 1;

const getItemLayout = (_: unknown, index: number) => ({
  length: ITEM_HEIGHT,
  offset: (ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
  index,
});

// Memoized separator component
const ItemSeparator = () => <View style={styles.divider} />;

const Notes = () => {
  const router = useRouter();
  // Use memoized sorted selector instead of inline sorting
  const notes = useSortedNotes();
  const retryTranscription = useNotesStore((state) => state.retryTranscription);

  // Memoized callbacks to prevent recreation on every render
  const handleNotePress = useCallback(
    (id: string) => {
      router.push(`/note/${id}`);
    },
    [router],
  );

  const handleRetry = useCallback(
    (id: string) => {
      retryTranscription(id);
    },
    [retryTranscription],
  );

  const renderItem = useCallback(
    ({ item }: { item: NoteType }) => {
      if (item.status === "failed") {
        return (
          <FailedNote
            id={item.id}
            title={item.title}
            date={item.date}
            duration={item.duration}
            error={item.error}
            onRetry={handleRetry}
            iconColor={item.iconColor}
            iconBackgroundColor={item.iconBackgroundColor}
            iconBorderColor={item.iconBorderColor}
          />
        );
      }

      return (
        <Note
          id={item.id}
          iconName={item.iconName || "microphone"}
          iconColor={item.iconColor}
          iconBackgroundColor={item.iconBackgroundColor}
          iconBorderColor={item.iconBorderColor}
          title={item.title}
          date={item.date}
          duration={item.duration}
          onPress={handleNotePress}
        />
      );
    },
    [handleNotePress, handleRetry],
  );

  return (
    <FlatList
      data={notes}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      contentContainerStyle={styles.listContainer}
      style={styles.list}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      getItemLayout={getItemLayout}
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
    height: SEPARATOR_HEIGHT,
    backgroundColor: colors.secondary,
  },
});

export default Notes;
