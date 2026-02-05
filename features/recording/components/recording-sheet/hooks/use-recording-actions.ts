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
    // Use neutral colors while transcribing - category detection will update after transcription
    processRecording({
      id: Date.now().toString(),
      title: generatedTitle || i18n.t("notes.creatingNote"),
      date: new Date(),
      duration: Math.round(durationMs / 1000),
      audioUri: recordingUri,
      iconName: "microphone",
      iconColor: colors.primaryLight,
      iconBackgroundColor: colors.secondary,
      iconBorderColor: colors.primaryLighter,
    });

    onClose();
  };

  return { handleDelete, handlePause, handleDone };
}
