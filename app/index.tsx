import { StyleSheet, View } from "react-native";

import Container from "@/components/ui/container";
import { colors } from "@/theme/colors";

import BottomNav from "./_components/bottom-nav";
import Header from "./_components/header";
import Notes from "./_components/notes";
import SearchInput from "./_components/search-input";
import Tags from "./_components/tags";

export default function Index() {
  return (
    <Container>
      <Header />
      <View style={styles.searchContainer}>
        <SearchInput />
        <Tags />
      </View>
      <View style={styles.notesContainer}>
        <Notes />
      </View>
      <BottomNav />
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
  },
});
