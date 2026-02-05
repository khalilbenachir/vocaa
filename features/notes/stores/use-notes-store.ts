import { useMemo } from "react";
import { Alert } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import i18n from "@/i18n";
import { colors } from "@/theme/colors";
import * as FileSystem from "expo-file-system/legacy";
import { CategoryDetectionService } from "../../../lib/services/category-detection";
import { TranscriptionService } from "../../../lib/services/openai";
import { zustandStorage } from "../../../lib/storage/async-storage";
import { Note, NoteStatus } from "../types/index";

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff: 1s, 2s, 4s

const COLOR_PALETTE = [
  {
    iconColor: colors.purple,
    iconBackgroundColor: colors.purpleLighter,
    iconBorderColor: colors.purpleLight,
  },
  {
    iconColor: colors.orange,
    iconBackgroundColor: colors.orangeLighter,
    iconBorderColor: colors.orangeLight,
  },
  {
    iconColor: colors.blue,
    iconBackgroundColor: colors.blueLighter,
    iconBorderColor: colors.blueLight,
  },
  {
    iconColor: colors.brown,
    iconBackgroundColor: colors.brownLighter,
    iconBorderColor: colors.brownLight,
  },
  {
    iconColor: colors.green,
    iconBackgroundColor: colors.greenLighter,
    iconBorderColor: colors.greenLight,
  },
  {
    iconColor: colors.cyan,
    iconBackgroundColor: colors.cyanLighter,
    iconBorderColor: colors.cyanLight,
  },
  {
    iconColor: colors.pink,
    iconBackgroundColor: colors.pinkLighter,
    iconBorderColor: colors.pinkLight,
  },
  {
    iconColor: colors.teal,
    iconBackgroundColor: colors.tealLighter,
    iconBorderColor: colors.tealLight,
  },
  {
    iconColor: colors.yellow,
    iconBackgroundColor: colors.yellowLighter,
    iconBorderColor: colors.yellowLight,
  },
  {
    iconColor: colors.lime,
    iconBackgroundColor: colors.limeLighter,
    iconBorderColor: colors.limeLight,
  },
  {
    iconColor: colors.deepPurple,
    iconBackgroundColor: colors.deepPurpleLighter,
    iconBorderColor: colors.deepPurpleLight,
  },
  {
    iconColor: colors.amber,
    iconBackgroundColor: colors.amberLighter,
    iconBorderColor: colors.amberLight,
  },
];

export function getIconColors(index: number) {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Team Meeting Notes",
    date: new Date(2025, 2, 14),
    duration: 121,
    audioUri: null,
    iconBackgroundColor: colors.purpleLighter,
    iconColor: colors.purple,
    iconBorderColor: colors.purpleLight,
    iconName: "calendar-clock",
    category: "meeting",
    status: "completed",
  },
  {
    id: "2",
    title: "Project Ideas and Planning Session for Next Quarter",
    date: new Date(2025, 2, 13),
    duration: 305,
    audioUri: null,
    iconColor: colors.yellow,
    iconBackgroundColor: colors.yellowLighter,
    iconBorderColor: colors.yellowLight,
    iconName: "lightbulb-outline",
    category: "idea",
    status: "completed",
  },
  {
    id: "3",
    title: "Daily Standup",
    date: new Date(2025, 2, 12),
    duration: 78,
    audioUri: null,
    iconColor: colors.purple,
    iconBackgroundColor: colors.purpleLighter,
    iconBorderColor: colors.purpleLight,
    iconName: "calendar-clock",
    category: "meeting",
    status: "completed",
  },
  {
    id: "4",
    title: "Brainstorming New Features",
    date: new Date(2025, 2, 11),
    duration: 245,
    audioUri: null,
    iconColor: colors.yellow,
    iconBackgroundColor: colors.yellowLighter,
    iconBorderColor: colors.yellowLight,
    iconName: "lightbulb-outline",
    category: "idea",
    status: "completed",
  },
  {
    id: "5",
    title: "Client Feedback Review",
    date: new Date(2025, 2, 10),
    duration: 190,
    audioUri: null,
    iconColor: colors.indigo,
    iconBackgroundColor: colors.indigoLighter,
    iconBorderColor: colors.indigoLight,
    iconName: "briefcase-outline",
    category: "work",
    status: "completed",
  },
];

interface NotesState {
  notes: Note[];
  transcribingNote: Note | null;
  selectedCategory: string | null;
  searchQuery: string;
  addNote: (note: Note) => void;
  processRecording: (note: Note) => Promise<void>;
  retryTranscription: (noteId: string) => Promise<void>;
  updateNoteStatus: (
    noteId: string,
    status: NoteStatus,
    error?: string,
  ) => void;
  updateNote: (
    noteId: string,
    updates: { title?: string; transcript?: string },
  ) => void;
  getFailedNotes: () => Note[];
  retryAllFailed: () => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: initialNotes,
      transcribingNote: null,
      selectedCategory: null,
      searchQuery: "",

      setSelectedCategory: (category: string | null) =>
        set({ selectedCategory: category }),

      setSearchQuery: (query: string) => set({ searchQuery: query }),

      addNote: (note: Note) =>
        set((state) => ({
          notes: [note, ...state.notes],
        })),

      updateNoteStatus: (noteId: string, status: NoteStatus, error?: string) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId ? { ...n, status, error } : n,
          ),
        })),

      updateNote: (
        noteId: string,
        updates: { title?: string; transcript?: string },
      ) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId ? { ...n, ...updates, date: new Date() } : n,
          ),
        })),

      getFailedNotes: () => {
        return get().notes.filter((n) => n.status === "failed");
      },

      processRecording: async (draftNote: Note) => {
        const noteWithStatus: Note = {
          ...draftNote,
          status: "pending" as NoteStatus,
          retryCount: 0,
        };

        // 1. Add the note immediately (Optimistic Update)
        set((state) => ({
          notes: [noteWithStatus, ...state.notes],
          transcribingNote: noteWithStatus,
        }));

        if (!draftNote.audioUri) {
          set((state) => ({
            notes: state.notes.map((n) =>
              n.id === draftNote.id
                ? { ...n, status: "completed" as NoteStatus }
                : n,
            ),
            transcribingNote: null,
          }));
          return;
        }

        // 1.5 Persist Audio File (Move from Cache to Documents)
        let permanentUri = draftNote.audioUri;
        try {
          const fileName = `recording-${draftNote.id}.m4a`;
          const newPath = `${FileSystem.documentDirectory}${fileName}`;

          // Check if file exists before moving/copying
          const info = await FileSystem.getInfoAsync(draftNote.audioUri);
          if (info.exists) {
            await FileSystem.copyAsync({
              from: draftNote.audioUri,
              to: newPath,
            });
            permanentUri = newPath;

            // Update the note immediately with the new URI
            set((state) => ({
              notes: state.notes.map((n) =>
                n.id === draftNote.id ? { ...n, audioUri: permanentUri } : n,
              ),
              transcribingNote: { ...draftNote, audioUri: permanentUri },
            }));
          }
        } catch (error) {
          console.error("Failed to persist audio file:", error);
        }

        // Update status to transcribing
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === draftNote.id
              ? { ...n, status: "transcribing" as NoteStatus }
              : n,
          ),
        }));

        // Attempt transcription with retry logic
        await get().retryTranscription(draftNote.id);
      },

      retryTranscription: async (noteId: string) => {
        const note = get().notes.find((n) => n.id === noteId);
        if (!note || !note.audioUri) {
          set({ transcribingNote: null });
          return;
        }

        const currentRetryCount = note.retryCount ?? 0;

        // Update status to transcribing
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId
              ? { ...n, status: "transcribing" as NoteStatus, error: undefined }
              : n,
          ),
          transcribingNote: note,
        }));

        try {
          // 2. Transcribe - returns both text and detected language
          const { text: transcript, language } =
            await TranscriptionService.transcribeAudio(note.audioUri);

          // 3. Detect category and get icon/colors based on transcript
          const categoryResult =
            CategoryDetectionService.detectCategory(transcript);

          // 4. Update the note with transcript and category styling
          set((state) => ({
            notes: state.notes.map((n) =>
              n.id === noteId
                ? {
                    ...n,
                    transcript,
                    status: "completed" as NoteStatus,
                    error: undefined,
                    category: categoryResult.category,
                    iconName: categoryResult.iconName,
                    iconColor: categoryResult.iconColor,
                    iconBackgroundColor: categoryResult.iconBackgroundColor,
                    iconBorderColor: categoryResult.iconBorderColor,
                  }
                : n,
            ),
          }));

          // 5. If title was "Creating Note...", generate one now
          const isDefaultTitle = note.title === i18n.t("notes.creatingNote");

          if (isDefaultTitle) {
            // Pass the detected language to ensure title matches
            // Optimization: For long recordings (> 2 mins), only use the first ~20 seconds of text
            // to generate the title. This saves context window and processing time.
            let titleContext = transcript;
            if (note.duration && note.duration > 120) {
              // Approx 300 chars is roughly 20-30 seconds of speech depending on speed
              titleContext = transcript.slice(0, 300);
            }

            const newTitle = await TranscriptionService.generateTitle(
              titleContext,
              language,
            );
            set((state) => ({
              notes: state.notes.map((n) =>
                n.id === noteId ? { ...n, title: newTitle } : n,
              ),
            }));
          }

          set({ transcribingNote: null });
        } catch (error: any) {
          console.error("Transcription failed", error);

          const errorMessage =
            error instanceof Error ? error.message : String(error);
          const isQuotaError =
            errorMessage.includes("quota") || errorMessage.includes("billing");

          // Don't retry quota errors
          if (isQuotaError) {
            set((state) => ({
              notes: state.notes.map((n) =>
                n.id === noteId
                  ? {
                      ...n,
                      status: "failed" as NoteStatus,
                      error: "API quota exceeded",
                    }
                  : n,
              ),
              transcribingNote: null,
            }));

            Alert.alert(
              "Transcription Limit Reached",
              "You have exceeded your OpenAI API quota. The audio has been saved, but no text was generated. You can retry later.",
            );
            return;
          }

          // Check if we should retry
          if (currentRetryCount < MAX_RETRY_ATTEMPTS) {
            const retryDelay = RETRY_DELAYS[currentRetryCount] ?? 4000;

            // Update retry count
            set((state) => ({
              notes: state.notes.map((n) =>
                n.id === noteId
                  ? { ...n, retryCount: currentRetryCount + 1 }
                  : n,
              ),
            }));

            console.log(
              `Retrying transcription (${currentRetryCount + 1}/${MAX_RETRY_ATTEMPTS}) in ${retryDelay}ms`,
            );
            await delay(retryDelay);

            // Retry
            await get().retryTranscription(noteId);
          } else {
            // Max retries reached, mark as failed
            set((state) => ({
              notes: state.notes.map((n) =>
                n.id === noteId
                  ? {
                      ...n,
                      status: "failed" as NoteStatus,
                      error: errorMessage,
                    }
                  : n,
              ),
              transcribingNote: null,
            }));
          }
        }
      },

      retryAllFailed: async () => {
        const failedNotes = get().getFailedNotes();
        for (const note of failedNotes) {
          // Reset retry count before retrying
          set((state) => ({
            notes: state.notes.map((n) =>
              n.id === note.id ? { ...n, retryCount: 0 } : n,
            ),
          }));
          await get().retryTranscription(note.id);
        }
      },

      deleteNote: async (noteId: string) => {
        const note = get().notes.find((n) => n.id === noteId);

        // Clean up audio file if it exists
        if (note?.audioUri) {
          try {
            const info = await FileSystem.getInfoAsync(note.audioUri);
            if (info.exists) {
              await FileSystem.deleteAsync(note.audioUri, { idempotent: true });
            }
          } catch (error) {
            console.warn("Failed to delete audio file:", error);
          }
        }

        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
        }));
      },
    }),
    {
      name: "vocaa-notes-storage",
      storage: createJSONStorage(() => zustandStorage, {
        // Custom reviver to handle Date deserialization
        reviver: (_key, value) => {
          // Check if value looks like an ISO date string
          if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
          ) {
            return new Date(value);
          }
          return value;
        },
      }),
      partialize: (state) => ({
        // Only persist notes, not transient UI state
        notes: state.notes,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, check for any notes that were mid-transcription
        // and mark them as failed so user can retry
        if (state) {
          // Ensure dates are Date objects (in case reviver missed them)
          state.notes = state.notes.map((n) => ({
            ...n,
            date: n.date instanceof Date ? n.date : new Date(n.date),
          }));

          const notesNeedingRetry = state.notes.filter(
            (n) => n.status === "transcribing" || n.status === "pending",
          );

          if (notesNeedingRetry.length > 0) {
            // Mark as failed since the app was closed during transcription
            state.notes = state.notes.map((n) =>
              n.status === "transcribing" || n.status === "pending"
                ? {
                    ...n,
                    status: "failed" as NoteStatus,
                    error: "Transcription interrupted",
                  }
                : n,
            );
          }
        }
      },
    },
  ),
);

/**
 * Memoized selector for sorted notes (newest first)
 * Avoids O(n log n) sort on every render - only recalculates when notes array changes
 */
export const useSortedNotes = () => {
  const notes = useNotesStore((state) => state.notes);
  return useMemo(
    () => [...notes].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [notes],
  );
};

/**
 * Memoized selector for filtered and sorted notes
 * Filters by selected category, search query, and sorts newest first
 */
export const useFilteredNotes = () => {
  const notes = useNotesStore((state) => state.notes);
  const selectedCategory = useNotesStore((state) => state.selectedCategory);
  const searchQuery = useNotesStore((state) => state.searchQuery);

  return useMemo(() => {
    let filtered = notes;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((note) => note.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.transcript?.toLowerCase().includes(query),
      );
    }

    return [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [notes, selectedCategory, searchQuery]);
};

/**
 * Get unique categories from all notes
 */
export const useNoteCategories = () => {
  const notes = useNotesStore((state) => state.notes);

  return useMemo(() => {
    const categories = new Set<string>();
    notes.forEach((note) => {
      if (note.category && note.category !== "default") {
        categories.add(note.category);
      }
    });
    return Array.from(categories);
  }, [notes]);
};
