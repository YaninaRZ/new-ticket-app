import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  ticket: {
    id: string;
    title: string;
    author: string;
    date: string;
    priority: string;
    status: string;
  };
}

export default function TicketCard({ ticket }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.ticketCard}
      onPress={() => router.push({ pathname: "/TicketDetail", params: ticket })}
    >
      <Text style={styles.ticketTitle}>{ticket.title}</Text>
      <Text style={styles.ticketMeta}>Auteur : {ticket.author}</Text>
      <Text style={styles.ticketMeta}>Date : {ticket.date}</Text>
      <Text style={[styles.ticketPriority, styles[`priority_${ticket.priority}`]]}>
        Priorité : {ticket.priority}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ticketCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  ticketTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  ticketMeta: { fontSize: 14, color: "#6B7280" },
  ticketPriority: { marginTop: 6, fontWeight: "600" },
  priority_low: { color: "green" },
  priority_medium: { color: "orange" },
  priority_high: { color: "red" },
  priority_urgent: { color: "purple" },
});
