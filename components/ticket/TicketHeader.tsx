import { CircleIcon } from "@gluestack-ui/themed";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  title?: string;
  description?: string;
  company?: string;  // company_name
  project?: string;  // project_name
  id?: string;
  priority: string;
  priorityColor: string;
  isClosed: boolean;
  onToggle: () => void;
}

export default function TicketHeader({
  title,
  description,
  company,
  project,
  id,
  priority,
  priorityColor,
  isClosed,
  onToggle,
}: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      {/* Ligne priorité */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <CircleIcon color={priorityColor} style={{ width: 8, height: 8, marginRight: 6 }} />
        <Text style={{ fontSize: 12, color: "#6B7280" }}>Priorité : {priority}</Text>
      </View>

      {/* Titre + bouton état */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>
            {title || `Titre du ticket N°${id}`}
          </Text>

          {/* Description */}
          {description ? (
            <Text style={{ fontSize: 18, color: "#374151", marginTop: 4 }}>
              {description}
            </Text>
          ) : null}

          {/* Projet / Société */}
          {(project || company) ? (
            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
              {project ? `Projet : ${project}` : ""}{project && company ? " • " : ""}{company ? `Société : ${company}` : ""}
            </Text>
          ) : null}
        </View>

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
