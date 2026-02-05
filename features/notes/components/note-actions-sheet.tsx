import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import i18n from "@/i18n";
import { colors } from "@/theme/colors";

import { Note } from "../types";
import { useActionSheetAnimation } from "./hooks/use-action-sheet-animation";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NoteActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
  onDelete: () => void;
}

function NoteActionsSheet({
  isOpen,
  onClose,
  note,
  onDelete,
}: NoteActionsSheetProps) {
  const insets = useSafeAreaInsets();
  const { isVisible, backdropStyle, sheetStyle } =
    useActionSheetAnimation(isOpen);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmingDelete(false);
    }
  }, [isOpen]);

  const handleShare = useCallback(async () => {
    if (!note.audioUri) return;
    try {
      await Share.share({
        url: note.audioUri,
        message: note.title,
      });
      onClose();
    } catch (err) {
      console.error("Failed to share", err);
    }
  }, [note.audioUri, note.title, onClose]);

  const handleCopyTranscript = useCallback(async () => {
    if (!note.transcript) return;
    await Clipboard.setStringAsync(note.transcript);
    onClose();
  }, [note.transcript, onClose]);

  const handleDeletePress = useCallback(() => {
    setConfirmingDelete(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete();
    onClose();
  }, [onDelete, onClose]);

  const handleCancelDelete = useCallback(() => {
    setConfirmingDelete(false);
  }, []);

  if (!isVisible && !isOpen) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <AnimatedPressable
        style={[styles.backdrop, backdropStyle]}
        onPress={onClose}
      >
        <AnimatedPressable
          style={[
            styles.sheet,
            sheetStyle,
            { paddingBottom: insets.bottom + 16 },
          ]}
          onPress={(e: GestureResponderEvent) => e.stopPropagation()}
        >
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          {confirmingDelete ? (
            <View style={styles.confirmContainer}>
              <Feather name="alert-triangle" size={32} color={colors.red} />
              <Text style={styles.confirmTitle}>
                {i18n.t("noteActions.confirmDeleteTitle")}
              </Text>
              <Text style={styles.confirmMessage}>
                {i18n.t("noteActions.confirmDeleteMessage")}
              </Text>
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelDelete}
                >
                  <Text style={styles.cancelButtonText}>
                    {i18n.t("noteActions.cancel")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleConfirmDelete}
                >
                  <Text style={styles.deleteButtonText}>
                    {i18n.t("noteActions.confirmDelete")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.actionsContainer}>
              {note.audioUri && (
                <>
                  <TouchableOpacity
                    style={styles.actionRow}
                    onPress={handleShare}
                  >
                    <Feather name="share" size={22} color={colors.primary} />
                    <Text
                      style={[styles.actionLabel, { color: colors.primary }]}
                    >
                      {i18n.t("noteActions.share")}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.separator} />
                </>
              )}

              {note.transcript && (
                <>
                  <TouchableOpacity
                    style={styles.actionRow}
                    onPress={handleCopyTranscript}
                  >
                    <Feather name="copy" size={22} color={colors.primary} />
                    <Text
                      style={[styles.actionLabel, { color: colors.primary }]}
                    >
                      {i18n.t("noteActions.copyTranscript")}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.separator} />
                </>
              )}

              <TouchableOpacity
                style={styles.actionRow}
                onPress={handleDeletePress}
              >
                <Feather name="trash-2" size={22} color={colors.red} />
                <Text style={[styles.actionLabel, { color: colors.red }]}>
                  {i18n.t("noteActions.delete")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </AnimatedPressable>
      </AnimatedPressable>
    </Modal>
  );
}

export default memo(NoteActionsSheet);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handleRow: {
    alignItems: "center",
    marginBottom: 16,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  actionsContainer: {
    paddingBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  actionLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: colors.secondary,
  },
  confirmContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 16,
  },
  confirmMessage: {
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.red,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
