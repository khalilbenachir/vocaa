import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Container from "@/components/ui/container";
import { colors } from "@/theme/colors";

import RecordingSheet from "@/components/recording-sheet/recording-sheet";
import AddNote from "@/components/ui/add-card";
import { useNotesStore } from "@/stores/use-notes-store";
import BottomNav from "./_components/bottom-nav";
import Header from "./_components/header";
import Notes from "./_components/notes";
import SearchInput from "./_components/search-input";
import Tags from "./_components/tags";

export default function Index() {
  const [recordingVisible, setRecordingVisible] = useState(false);
  const transcribingNote = useNotesStore((state) => state.transcribingNote);

  return (
    <Container>
      <Header />
      <View style={styles.searchContainer}>
        <SearchInput />
        <Tags />
      </View>
      <View style={styles.notesContainer}>
        {transcribingNote && <AddNote duration={transcribingNote.duration} />}
        <Notes />
      </View>
      <BottomNav onRecord={() => setRecordingVisible(true)} />
      <RecordingSheet
        isOpen={recordingVisible}
        onClose={() => setRecordingVisible(false)}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  notesContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
});
