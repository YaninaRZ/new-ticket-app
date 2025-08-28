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
  onEdit?: () => void; 
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
  onEdit,
}: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      {/* Ligne priorité + bouton modifier */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CircleIcon color={priorityColor} style={{ width: 8, height: 8, marginRight: 6 }} />
          <Text style={{ fontSize: 12, color: "#6B7280" }}>Priorité : {priority}</Text>
        </View>

      
         {onEdit && (
          <Pressable
            onPress={onEdit}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#fff",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 2,
              elevation: 2,
           
            }}
          >
            <Text style={{ color: "#111827", fontWeight: "600", fontSize: 12 }}>
              Modifier
            </Text>
          </Pressable>
        )}

      </View>

      {/* Ligne titre + bouton statut */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
        <Text style={{ fontSize: 20, fontWeight: "700", flex: 1, marginRight: 12 }}>
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

      {/* Description en dessous */}
      {description ? (
        <Text style={{ fontSize: 16, lineHeight: 22, color: "#374151", marginTop: 6 }}>
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
  );
}
