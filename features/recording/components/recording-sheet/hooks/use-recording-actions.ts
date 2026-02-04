import { useNotesStore } from "@/features/notes/stores/use-notes-store";
import { useRecordingStore } from "@/features/recording/stores/use-recording-store";
import i18n from "@/i18n";
import { colors } from "@/theme/colors";

export function useRecordingActions(onClose: () => void) {
  const {
    isPaused,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteRecording,
  } = useRecordingStore();
  const { processRecording } = useNotesStore();

  const handleDelete = async () => {
    await deleteRecording();
    onClose();
  };

  const handlePause = async () => {
    if (isPaused) {
      await resumeRecording();
    } else {
      await pauseRecording();
    }
  };

  const handleDone = async () => {
    await stopRecording();

    const {
      recordingUri,
      duration: durationMs,
      generatedTitle,
    } = useRecordingStore.getState();

    // Fire and forget - processRecording runs async in the background
    processRecording({
      id: Date.now().toString(),
      title: generatedTitle || i18n.t("notes.creatingNote"),
      date: new Date(),
      duration: Math.round(durationMs / 1000),
      audioUri: recordingUri,
      iconColor: colors.primary,
      iconBackgroundColor: colors.primary,
      iconBorderColor: colors.primary,
    });

    onClose();
  };

  return { handleDelete, handlePause, handleDone };
}
