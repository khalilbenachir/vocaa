export type NoteStatus =
  | "pending" // Just created, waiting to process
  | "transcribing" // Currently being transcribed
  | "completed" // Successfully transcribed
  | "failed"; // Transcription failed, can retry

export interface Note {
  id: string;
  title: string;
  date: Date;
  duration: number; // seconds
  audioUri: string | null;
  iconBackgroundColor: string;
  iconColor: string;
  iconBorderColor: string;
  iconName?: string;
  category?: string;
  transcript?: string;
  status?: NoteStatus;
  error?: string;
  retryCount?: number;
}
