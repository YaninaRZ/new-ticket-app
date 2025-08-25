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
import { Modal } from "react-native";


export default function TicketDetail() {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);


  const router = useRouter();
  const { id, title, author, date, priority, status } = useLocalSearchParams<{
    id?: string;
    title?: string;
    author?: string;
    date?: string;
    priority?: string;
    status?: "opened" | "closed";
  }>();
  const [isClosed, setIsClosed] = useState(status === "closed");
  
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

  const [assignModalVisible, setAssignModalVisible] = useState(false);
const [assignedUser, setAssignedUser] = useState({ name: "Alice Granger", initials: "AG" });

const users = [
  { id: "1", name: "Alice Granger", initials: "AG" },
  { id: "2", name: "Bob Martin", initials: "BM" },
  { id: "3", name: "Charlie Dupond", initials: "CD" },
];
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam1haXZrZjFuaHgyeW41IiwiZXhwIjoxNzU2MTk0Mzc0LCJpYXQiOjE3NTYxMDc5NzR9.jI88yJp5N0hshsXB9kLr90OJmnSta5_K7OKZODS8eWg"; 

const toggleTicketStatus = async () => {
  try {
    const response = await fetch(
      `https://ticketing.development.atelier.ovh/api/mobile/tickets/${id}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      console.log("✅ Statut du ticket modifié avec succès");
      setIsClosed((prev) => !prev); // met à jour le statut localement
    } else {
      const result = await response.json();
      console.error("❌ Erreur lors du changement de statut :", result);
    }
  } catch (error) {
    console.error("❌ Erreur réseau :", error);
  }
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
        <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  }}
>
  <Text style={{ fontSize: 20, fontWeight: "700", flex: 1 }}>
    {title || `Titre du ticket N°${id}`}
  </Text>

  <Pressable
  onPress={toggleTicketStatus}
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

        {/* Assignation */}
        <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  }}
>
  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
    <Text style={{ fontSize: 16, color: "#111827" }}>Assigné à</Text>
    <View
      style={{
        backgroundColor: "#fbbf24",
        borderRadius: 9999,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>
        {assignedUser.initials}
      </Text>
    </View>
  </View>

  <Pressable
    onPress={() => setAssignModalVisible(true)}
    style={{
      backgroundColor: "#3B82F6",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    }}
  >
    <Text style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}>
      Gérer l’assignement
    </Text>
  </Pressable>
</View>



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
  onPress={() => setDeleteModalVisible(true)}
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
      <Modal
  transparent
  visible={deleteModalVisible}
  animationType="fade"
  onRequestClose={() => setDeleteModalVisible(false)}
>
  <Pressable
    onPress={() => setDeleteModalVisible(false)}
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    }}
  >
    <Pressable
      onPress={() => {}}
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
        Êtes-vous sûr de vouloir supprimer ce ticket ?
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Annuler */}
        <Pressable
          onPress={() => setDeleteModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "#E5E7EB",
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "600", color: "#111827" }}>Annuler</Text>
        </Pressable>

        {/* Supprimer */}
        <Pressable
          onPress={async () => {
            setDeleteModalVisible(false);
            try {
              const response = await fetch(
                `https://ticketing.development.atelier.ovh/api/mobile/tickets/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                }
              );

              if (response.ok) {
                console.log("✅ Ticket supprimé");
                router.replace("/home");
              } else {
                const result = await response.json();
                console.error("❌ Échec suppression", result);
              }
            } catch (error) {
              console.error("❌ Erreur réseau", error);
            }
          }}
          style={{
            flex: 1,
            backgroundColor: "#dc2626",
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "600", color: "#fff" }}>Supprimer</Text>
        </Pressable>
      </View>
    </Pressable>
  </Pressable>
</Modal>

<Modal
  transparent
  visible={assignModalVisible}
  animationType="fade"
  onRequestClose={() => setAssignModalVisible(false)}
>
  <Pressable
    onPress={() => setAssignModalVisible(false)}
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    }}
  >
    <Pressable
      onPress={() => {}}
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
        Sélectionner un utilisateur
      </Text>

      {users.map((user) => (
        <Pressable
          key={user.id}
          onPress={() => {
            setAssignedUser(user);
            setAssignModalVisible(false);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            borderBottomColor: "#E5E7EB",
            borderBottomWidth: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "#facc15",
              borderRadius: 9999,
              width: 32,
              height: 32,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>{user.initials}</Text>
          </View>
          <Text style={{ fontSize: 16, color: "#111827" }}>{user.name}</Text>
        </Pressable>
      ))}
    </Pressable>
  </Pressable>
</Modal>

    </Box>
  );
}
