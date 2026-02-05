import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

import NoteDetail from "@/features/notes/components/note-detail";
import { useNotesStore } from "@/features/notes/stores/use-notes-store";
import i18n from "@/i18n";
import { colors } from "@/theme/colors";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const note = useNotesStore(
    useCallback((state) => state.notes.find((n) => n.id === id), [id]),
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!note) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>{i18n.t("noteDetail.noteNotFound")}</Text>
      </View>
    );
  }

  return <NoteDetail note={note} onBack={handleBack} />;
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.primaryLight,
  },
});
