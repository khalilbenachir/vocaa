import { create } from "zustand";

import i18n from "@/i18n";
import { colors } from "@/theme/colors";
import { Note } from "../types";

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
  },
  {
    id: "2",
    title: "Project Ideas and Planning Session for Next Quarter",
    date: new Date(2025, 2, 13),
    duration: 305,
    audioUri: null,
    iconColor: colors.orange,
    iconBackgroundColor: colors.orangeLighter,
    iconBorderColor: colors.orangeLight,
  },
  {
    id: "3",
    title: "Daily Standup",
    date: new Date(2025, 2, 12),
    duration: 78,
    audioUri: null,
    iconColor: colors.blue,
    iconBackgroundColor: colors.blueLighter,
    iconBorderColor: colors.blueLight,
  },
  {
    id: "4",
    title: "Brainstorming New Features",
    date: new Date(2025, 2, 11),
    duration: 245,
    audioUri: null,
    iconColor: colors.purple,
    iconBackgroundColor: colors.purpleLighter,
    iconBorderColor: colors.purpleLight,
  },
  {
    id: "5",
    title: "Client Feedback Review",
    date: new Date(2025, 2, 10),
    duration: 190,
    audioUri: null,
    iconColor: colors.orange,
    iconBackgroundColor: colors.orangeLighter,
    iconBorderColor: colors.blueLight,
  },
];

interface NotesState {
  notes: Note[];
  transcribingNote: Note | null;
  addNote: (note: Note) => void;
  startTranscription: (note: Note) => void;
  completeTranscription: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: initialNotes,
  transcribingNote: null,

  addNote: (note: Note) =>
    set((state) => ({
      notes: [note, ...state.notes],
    })),

  startTranscription: (note: Note) => {
    set({ transcribingNote: note });

    // TODO: Replace with real transcription API call
    // Simulates transcription completing after a delay
    const simulatedDelay = Math.min(note.duration * 1000, 8000);
    setTimeout(() => {
      get().completeTranscription();
    }, simulatedDelay);
  },

  completeTranscription: () => {
    const { transcribingNote, notes } = get();
    if (!transcribingNote) return;

    const colorIndex = notes.length % COLOR_PALETTE.length;
    const { iconColor, iconBackgroundColor, iconBorderColor } =
      COLOR_PALETTE[colorIndex];

    set((state) => ({
      notes: [
        {
          ...transcribingNote,
          title: i18n.t("notes.transcribed"),
          subtitle: undefined,
          iconName: undefined,
          iconColor,
          iconBackgroundColor,
          iconBorderColor,
        },
        ...state.notes,
      ],
      transcribingNote: null,
    }));
  },
}));
