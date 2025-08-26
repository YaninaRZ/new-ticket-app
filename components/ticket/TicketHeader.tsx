import { CircleIcon } from "@gluestack-ui/themed";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  title?: string;
  id?: string;
  priorityColor: string;
  isClosed: boolean;
  onToggle: () => void;
}

export default function TicketHeader({ title, id, priorityColor, isClosed, onToggle }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <CircleIcon color={priorityColor} style={{ width: 8, height: 8, marginRight: 6 }} />
        <Text style={{ fontSize: 12, color: "#6B7280" }}>Priorité</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "700", flex: 1 }}>
          {title || `Titre du ticket N°${id}`}
        </Text>
        <Pressable
          onPress={onToggle}
          style={{
            backgroundColor: isClosed ? "#dc2626" : "#16a34a",
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 12 }}>
            {isClosed ? "Ticket fermé" : "Ticket ouvert"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
