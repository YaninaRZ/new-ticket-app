import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Pressable,
  CircleIcon,
  Input,
  InputField,
  Button,
  ButtonText,
  Icon,
  ScrollView,
} from "@gluestack-ui/themed";
import { Paperclip } from "lucide-react-native";
import { View } from "react-native";

export default function TicketDetail() {
  const router = useRouter();
  const { id, title, author, date, priority } = useLocalSearchParams<{
    id?: string;
    title?: string;
    author?: string;
    date?: string;
    priority?: string;
  }>();

  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([
    { id: "1", author: "Alice", content: "Je regarde ça dès que possible." },
    { id: "2", author: "Bob", content: "Merci pour le signalement." },
  ]);

  const attachments = [
    { id: "1", filename: "capture-erreur.png" },
    { id: "2", filename: "logs.txt" },
  ];

  const priorityColor = priority === "urgent" ? "#dc2626" : "#16a34a";

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), author: "Moi", content: commentInput },
    ]);
    setCommentInput("");
  };

  return (
    <Box style={{ backgroundColor: "#fff", flex: 1, padding: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Priorité */}
        <HStack style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <CircleIcon
  color={priorityColor}
  style={{ width: 8, height: 8, marginRight: 6 }}
/>

          <Text style={{ fontSize: 12, color: "#6B7280" }}>Priorité</Text>
        </HStack>

        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>
          {title || `Titre du ticket N°${id}`}
        </Text>

        {/* Infos */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: "#4B5563" }}>
            Créé par {author || "Inconnu"}
          </Text>
          <Text style={{ fontSize: 16, color: "#4B5563" }}>Date de création</Text>
          <Text style={{ fontSize: 16, color: "#1F2937" }}>{date || "N/A"}</Text>
        </View>

        {/* Description */}
        <Text style={{ fontSize: 16, marginBottom: 20 }}>
          Commodo in viverra nunc, ullamcorper ut. Non, amet, aliquet
          scelerisque nullam sagittis, pulvinar.
        </Text>

        {/* Pièces jointes */}
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>📎 Pièces jointes</Text>
        <View style={{ gap: 8, marginBottom: 20 }}>
          {attachments.map((file) => (
            <HStack key={file.id} style={{ alignItems: "start", gap: 8 }}>
              <Icon
  as={Paperclip}
  style={{ width: 16, height: 16 }}
  color="#6B7280"
/>

              <Text style={{ fontSize: 14, color: "#374151" }}>{file.filename}</Text>
            </HStack>
          ))}
        </View>

        {/* Commentaires */}
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>💬 Commentaires</Text>
        <View style={{ gap: 12, marginBottom: 20 }}>
          {comments.map((c) => (
            <Box
              key={c.id}
              style={{
                backgroundColor: "#F3F4F6",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontWeight: "600" }}>{c.author}</Text>
              <Text>{c.content}</Text>
            </Box>
          ))}
        </View>

        {/* Ajout de commentaire */}
      {/* Ajout de commentaire */}
<View style={{ rowGap: 12, marginBottom: 24 }}>
  <Text style={{ fontWeight: "600", fontSize: 16 }}>Ajouter un commentaire</Text>

  <Input style={{ borderColor: "#D1D5DB", borderWidth: 1, borderRadius: 8 }}>
    <InputField
      placeholder="Écris ton commentaire ici..."
      value={commentInput}
      onChangeText={setCommentInput}
      multiline
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 14,
      }}
    />
  </Input>

  <Button
    onPress={handleAddComment}
    style={{
      backgroundColor: "#000",
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
    }}
  >
    <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
      Envoyer
    </ButtonText>
  </Button>
</View>

        <Divider style={{ backgroundColor: "#E5E7EB", height: 1, marginBottom: 24 }} />

        <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 6,
    marginTop: 32,
  }}
>
  {/* Bouton Retour */}
  <Pressable
    onPress={() => router.back()}
    style={{
      flex: 1,
      backgroundColor: "#000",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    }}
  >
    <Text style={{ color: "#fff", fontWeight: "600" }}>← Retour</Text>
  </Pressable>

  {/* Bouton Supprimer */}
  <Pressable
    onPress={() => console.log("Suppression du ticket")}
    style={{
      flex: 1,
      backgroundColor: "#dc2626",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    }}
  >
    <Text style={{ color: "#fff", fontWeight: "600" }}>🗑️ Supprimer</Text>
  </Pressable>
</View>


      </ScrollView>
    </Box>
  );
}
