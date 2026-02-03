import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import i18n from "@/i18n";
import { colors } from "@/theme/colors";

export default function BottomNav() {
  const onAddNote = () => {};
  const onRecord = () => {};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.recordButton} onPress={onRecord}>
        <MaterialCommunityIcons name="record" size={24} color={colors.red} />
        <Text style={styles.recordButtonText}>
          {i18n.t("bottomNav.record")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={onAddNote}>
        <Feather name="plus" size={24} color={colors.primary} />
        <Text style={styles.addButtonText}>{i18n.t("bottomNav.addNote")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 16,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  recordButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
  },
  recordButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "600",
  },
});
