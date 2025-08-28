import { Text } from "@/components/ui/text";
import { StyleSheet, View } from "react-native";

interface Props {
  opened: number;
  closed: number;
}

export default function TicketsStats({ opened, closed }: Props) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Tickets fermés</Text>
        <Text style={styles.statValue}>{closed}</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Tickets ouverts</Text>
        <Text style={styles.statValue}>{opened}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  statBox: {
    flex: 1,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
  },
  statLabel: { color: "#6B7280", fontSize: 16, marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: "700", color: "#000" },
});
