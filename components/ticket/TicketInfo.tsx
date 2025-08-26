import React from "react";
import { Text, View } from "react-native";

interface Props {
  author?: string;
  date?: string;
}

export default function TicketInfo({ author, date }: Props) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 16, color: "#4B5563" }}>
        Créé par {author || "Inconnu"}
      </Text>
      <Text style={{ fontSize: 16, color: "#4B5563" }}>Date de création</Text>
      <Text style={{ fontSize: 16, color: "#1F2937" }}>{date || "N/A"}</Text>
    </View>
  );
}
