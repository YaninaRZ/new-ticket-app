import { HStack, Icon } from "@gluestack-ui/themed";
import { Paperclip } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface Attachment {
  id: string;
  filename: string;
}

interface Props {
  attachments: Attachment[];
}

export default function TicketAttachments({ attachments }: Props) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: "600", marginBottom: 8 }}>📎 Pièces jointes</Text>
      <View style={{ gap: 8 }}>
        {attachments.map((file) => (
          <HStack key={file.id} style={{ alignItems: "center", gap: 8 }}>
            <Icon as={Paperclip} style={{ width: 16, height: 16 }} color="#6B7280" />
            <Text style={{ fontSize: 14, color: "#374151" }}>{file.filename}</Text>
          </HStack>
        ))}
      </View>
    </View>
  );
}
