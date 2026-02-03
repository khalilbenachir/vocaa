import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { colors } from "../../theme/colors";
import Note from "./note";

interface MockNote {
  id: string;
  title: string;
  date: Date;
  duration: number;
  iconBackgroundColor: string;
  iconColor: string;
  iconBorderColor: string;
}

const mockNotes: MockNote[] = [
  {
    id: "1",
    title: "Team Meeting Notes",
    date: new Date(2025, 2, 14), // Mar 14, 2025
    duration: 121, // 2m 1s
    iconBackgroundColor: colors.purpleLighter,
    iconColor: colors.purple,
    iconBorderColor: colors.purpleLight,
  },
  {
    id: "2",
    title: "Project Ideas and Planning Session for Next Quarter",
    date: new Date(2025, 2, 13),
    duration: 305, // 5m 5s
    iconColor: colors.orange,
    iconBackgroundColor: colors.orangeLighter,
    iconBorderColor: colors.orangeLight,
  },
  {
    id: "3",
    title: "Daily Standup",
    date: new Date(2025, 2, 12),
    duration: 78, // 1m 18s
    iconColor: colors.blue,
    iconBackgroundColor: colors.blueLighter,
    iconBorderColor: colors.blueLight,
  },
  {
    id: "4",
    title: "Brainstorming New Features",
    date: new Date(2025, 2, 11),
    duration: 245, // 4m 5s
    iconColor: colors.purple,
    iconBackgroundColor: colors.purpleLighter,
    iconBorderColor: colors.purpleLight,
  },
  {
    id: "5",
    title: "Client Feedback Review",
    date: new Date(2025, 2, 10),
    duration: 190, // 3m 10s
    iconColor: colors.orange,
    iconBackgroundColor: colors.orangeLighter,
    iconBorderColor: colors.blueLight,
  },
];

const Notes = () => {
  return (
    <FlatList
      data={mockNotes}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item }) => (
        <Note
          icon={() => (
            <MaterialCommunityIcons
              name="microphone"
              size={24}
              color={item.iconColor}
            />
          )}
          iconBackgroundColor={item.iconBackgroundColor}
          iconBorderColor={item.iconBorderColor}
          title={item.title}
          date={item.date}
          duration={item.duration}
          onPress={() => console.log("Note pressed:", item.id)}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      contentContainerStyle={styles.listContainer}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary,
  },
});

export default Notes;
