import { Icon } from "@gluestack-ui/themed";
import { Paperclip } from "lucide-react-native";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

interface Attachment {
  id: string;
  filename: string;
  url?: string; // ✅ ajoute un champ url pour ouvrir le fichier
}

interface Props {
  attachments: Attachment[];
}

export default function TicketAttachments({ attachments }: Props) {
  const openFile = async (url: string | undefined) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("❌ Impossible d'ouvrir l'URL :", url);
      }
    } catch (err) {
      console.error("❌ Erreur ouverture fichier :", err);
    }
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: "600", marginBottom: 8 }}>📎 Pièces jointes</Text>

      {attachments && attachments.length > 0 ? (
        <View style={{ gap: 8 }}>
          {attachments.map((file) => (
            <TouchableOpacity
              key={file.id}
              onPress={() => openFile(file.url)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Icon as={Paperclip} style={{ width: 16, height: 16 }} color="#6B7280" />
              <Text style={{ fontSize: 14, color: "#1D4ED8" }}>{file.filename}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: 14, color: "#6B7280", fontStyle: "italic" }}>
          Aucune pièce jointe
        </Text>
      )}
    </View>
  );
}
