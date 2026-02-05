import Feather from "@expo/vector-icons/Feather";
import React, { memo, useCallback, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AudioPlayer from "@/features/playback/components/audio-player";
import i18n from "@/i18n";
import { formatDate } from "@/lib/date";
import { colors } from "@/theme/colors";

import NoteActionsSheet from "./note-actions-sheet";
import { useNotesStore } from "../stores/use-notes-store";
import { Note } from "../types";

interface NoteDetailProps {
  note: Note;
  onBack: () => void;
}

function NoteDetail({ note, onBack }: NoteDetailProps) {
  const insets = useSafeAreaInsets();
  const updateNote = useNotesStore((state) => state.updateNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const [isEditing, setIsEditing] = useState(false);
  const [isActionsSheetOpen, setIsActionsSheetOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedTranscript, setEditedTranscript] = useState(
    note.transcript || "",
  );

  const handleEdit = useCallback(() => {
    setEditedTitle(note.title);
    setEditedTranscript(note.transcript || "");
    setIsEditing(true);
  }, [note.title, note.transcript]);

  const handleCancel = useCallback(() => {
    setEditedTitle(note.title);
    setEditedTranscript(note.transcript || "");
    setIsEditing(false);
    Keyboard.dismiss();
  }, [note.title, note.transcript]);

  const handleDone = useCallback(() => {
    updateNote(note.id, {
      title: editedTitle.trim() || note.title,
      transcript: editedTranscript.trim(),
    });
    setIsEditing(false);
    Keyboard.dismiss();
  }, [note.id, note.title, editedTitle, editedTranscript, updateNote]);

  const handleOpenActionsSheet = useCallback(() => {
    setIsActionsSheetOpen(true);
  }, []);

  const handleCloseActionsSheet = useCallback(() => {
    setIsActionsSheetOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    await deleteNote(note.id);
    onBack();
  }, [deleteNote, note.id, onBack]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Feather name="chevron-left" size={28} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{i18n.t("noteDetail.title")}</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={handleOpenActionsSheet}
              >
                <Feather
                  name="more-horizontal"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={[
              styles.contentContainer,
              { paddingBottom: insets.bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Audio Player */}
            <AudioPlayer audioUri={note.audioUri} duration={note.duration} />

            {/* Title */}
            {isEditing ? (
              <TextInput
                style={styles.titleInput}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder={i18n.t("noteDetail.noteTitlePlaceholder")}
                placeholderTextColor={colors.primaryLight}
                multiline
              />
            ) : (
              <Text style={styles.title}>{note.title}</Text>
            )}

            {/* Metadata row */}
            <View style={styles.metaRow}>
              <Text style={styles.lastChanged}>
                {i18n.t("noteDetail.lastChanged", {
                  date: formatDate(note.date),
                })}
              </Text>
              {isEditing ? (
                <View style={styles.editActions}>
                  <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.cancelButton}>
                      {i18n.t("noteDetail.cancel")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDone}>
                    <Text style={styles.doneButton}>
                      {i18n.t("noteDetail.done")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleEdit}
                  style={styles.editButton}
                >
                  <Feather name="edit-2" size={18} color={colors.cyan} />
                  <Text style={styles.editText}>
                    {i18n.t("noteDetail.edit")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Transcript */}
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptTitle}>
                {i18n.t("noteDetail.transcriptTitle")}
              </Text>
              {isEditing ? (
                <TextInput
                  style={styles.transcriptInput}
                  value={editedTranscript}
                  onChangeText={setEditedTranscript}
                  placeholder={i18n.t("noteDetail.transcriptPlaceholder")}
                  placeholderTextColor={colors.primaryLight}
                  multiline
                  textAlignVertical="top"
                />
              ) : note.transcript ? (
                <Text style={styles.transcript}>{note.transcript}</Text>
              ) : (
                <Text style={styles.noTranscript}>
                  {i18n.t("noteDetail.noTranscript")}
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      <NoteActionsSheet
        isOpen={isActionsSheetOpen}
        onClose={handleCloseActionsSheet}
        note={note}
        onDelete={handleDelete}
      />
    </KeyboardAvoidingView>
  );
}

export default memo(NoteDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
  },
  headerRight: {
    width: 44,
    alignItems: "flex-end",
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 20,
    lineHeight: 32,
  },
  titleInput: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 20,
    lineHeight: 32,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 20,
  },
  lastChanged: {
    fontSize: 14,
    color: colors.primaryLight,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editText: {
    fontSize: 18,
    color: colors.cyan,
    fontWeight: "500",
  },
  editActions: {
    flexDirection: "row",
    gap: 16,
  },
  cancelButton: {
    fontSize: 18,
    color: colors.red,
    fontWeight: "500",
  },
  doneButton: {
    fontSize: 18,
    color: colors.cyan,
    fontWeight: "500",
  },
  transcriptContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  transcriptTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    lineHeight: 32,
  },
  transcript: {
    fontSize: 16,
    color: colors.primary,
    lineHeight: 24,
  },
  transcriptInput: {
    fontSize: 16,
    color: colors.primary,
    lineHeight: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 8,
    minHeight: 200,
  },
  noTranscript: {
    fontSize: 16,
    color: colors.primaryLight,
    fontStyle: "italic",
  },
});
