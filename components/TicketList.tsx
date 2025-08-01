import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Trash2 } from "lucide-react-native";

type Ticket = {
  id: string;
  title: string;
  author: string;
  date: string;
  priority: "urgent" | "normal";
};

type TicketListProps = {
  data: Ticket[];
  onDelete?: (id: string) => void;
  onPress?: (ticket: Ticket) => void; // ✅ Passe tout l'objet
};



export default function TicketList({ data, onDelete, onPress }: TicketListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPress?.(item)}>
          <View style={styles.card}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>créé par {item.author}</Text>
              <Text style={styles.subtitle}>le {item.date}</Text>
            </View>

            <View style={styles.right}>
              <View style={styles.priorityRow}>
                <View style={styles.priority}>
                  <Text style={styles.priorityText}>{item.priority}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => onDelete?.(item.id)}
                  style={{ marginLeft: 8 }}
                >
                  <Trash2 size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
  },
  right: {
    alignItems: "flex-end",
    gap: 8,
  },
  priority: {
    backgroundColor: "#dc2626",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  priorityText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "lowercase",
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    opacity: 0.2,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
