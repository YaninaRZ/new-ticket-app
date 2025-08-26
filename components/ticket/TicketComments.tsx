import { Box, Button, ButtonText, Input, InputField } from "@gluestack-ui/themed";
import React, { useState } from "react";
import { Text, View } from "react-native";

interface Comment {
  id: string;
  author: string;
  content: string;
}

interface Props {
  comments: Comment[];
  onAdd: (content: string) => void;
}

export default function TicketComments({ comments, onAdd }: Props) {
  const [commentInput, setCommentInput] = useState("");

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontWeight: "600", marginBottom: 8 }}>💬 Commentaires</Text>

      {/* Liste des commentaires */}
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

      {/* Champ d’ajout */}
      <Input style={{ borderColor: "#D1D5DB", borderWidth: 1, borderRadius: 8, marginTop: 12 }}>
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
        onPress={() => {
          if (!commentInput.trim()) return;
          onAdd(commentInput); // 👉 appelle la fonction de TicketDetail
          setCommentInput("");
        }}
        style={{
          marginTop: 12,
          backgroundColor: "#000",
          borderRadius: 8,
          paddingVertical: 10,
          alignItems: "center",
        }}
      >
        <ButtonText style={{ color: "#fff", fontWeight: "600" }}>Envoyer</ButtonText>
      </Button>
    </View>
  );
}
