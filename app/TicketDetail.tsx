import api from "@/services/api";
import { Box, ScrollView } from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

// ✅ Sous-composants
import DeleteModal from "@/components/modal/DeleteModal";
import TicketAssign from "@/components/ticket/TicketAssign";
import TicketAttachments from "@/components/ticket/TicketAttachments";
import TicketComments from "@/components/ticket/TicketComments";
import TicketHeader from "@/components/ticket/TicketHeader";
import TicketInfo from "@/components/ticket/TicketInfo";
import { Pressable, Text, View } from "react-native";

// ✅ Hook auth
import { useAuth } from "@/hooks/useAuth";

interface User {
  id: string;
  name: string;
  initials: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
}

export default function TicketDetail() {
  const router = useRouter();
  const { id, title, author, date, priority, status } = useLocalSearchParams<{
    id?: string;
    title?: string;
    author?: string;
    date?: string;
    priority?: string;
    status?: "opened" | "closed";
  }>();

  const { user: currentUser } = useAuth(); // 👈 récupère l’utilisateur connecté

  // ✅ States
  const [isClosed, setIsClosed] = useState(status === "closed");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [assignedUser, setAssignedUser] = useState<User | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);

  const attachments = [
    { id: "1", filename: "capture-erreur.png" },
    { id: "2", filename: "logs.txt" },
  ];

  const priorityColor = priority === "urgent" ? "#dc2626" : "#16a34a";

  // ✅ API calls
  const toggleTicketStatus = async () => {
    try {
      await api.patch(`/tickets/${id}/status`);
      setIsClosed((prev) => !prev);
    } catch (err) {
      console.error("❌ Erreur toggle status", err);
    }
  };

  const assignTicket = async (userId: string) => {
    try {
      await api.post(`/tickets/${id}/assign`, { userId });
      const user = users.find((u) => u.id === userId);
      if (user) setAssignedUser(user);
    } catch (err) {
      console.error("❌ Erreur assignation", err);
    }
  };

  const deleteTicket = async () => {
    try {
      await api.delete(`/tickets/${id}`);
      router.replace("/home");
    } catch (err) {
      console.error("❌ Erreur suppression ticket", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const formatted = res.data.users.map((user: any) => ({
        id: user.id,
        name: user.username,
        initials: `${user.username[0] ?? ""}${user.username[1] ?? ""}`,
      }));
      setUsers(formatted);
    } catch (err) {
      console.error("❌ Erreur fetch users", err);
    }
  };

  const fetchTicketDetails = async () => {
    try {
      const res = await api.get(`/tickets/${id}`);

      if (res.data.assignedUser) {
        setAssignedUser({
          name: res.data.assignedUser.username,
          initials: `${res.data.assignedUser.username[0] ?? ""}${
            res.data.assignedUser.username[1] ?? ""
          }`,
          id: res.data.assignedUser.id,
        });
      }
    } catch (err) {
      console.error("❌ Erreur fetch ticket details", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/ticket/${id}`);
      const formatted = res.data.comments.map((c: any) => ({
        id: c.id,
        content: c.content,
        author: c.username, // 👈 affiche bien le username
      }));
      setComments(formatted);
    } catch (err: any) {
      console.error("❌ Erreur fetch comments", err.response?.data || err);
    }
  };

  const addComment = async (content: string) => {
    try {
      const formData = new FormData();
      formData.append("ticket_id", id as string);
      formData.append("content", content);

      const res = await api.post(`/comments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newComment = {
        id: res.data.id ?? Date.now().toString(),
        content,
        author: res.data.username ?? currentUser?.username ?? "Moi", // 👈 utilise ton vrai username
      };

      setComments((prev) => [...prev, newComment]);
    } catch (err: any) {
      console.error("❌ Erreur ajout commentaire", err.response?.data || err);
    }
  };

  // ✅ useEffect
  useEffect(() => {
    fetchUsers();
    fetchTicketDetails();
    fetchComments();
  }, []);

  return (
    <Box style={{ backgroundColor: "#fff", flex: 1, padding: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TicketHeader
          title={title}
          id={id}
          priorityColor={priorityColor}
          isClosed={isClosed}
          onToggle={toggleTicketStatus}
        />

        <TicketInfo author={author} date={date} />

        <TicketAssign
          users={users}
          assignedUser={assignedUser}
          onAssign={assignTicket}
        />

        <TicketAttachments attachments={attachments} />

        <TicketComments comments={comments} onAdd={addComment} />
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
          paddingHorizontal: 6,
          marginTop: 16,
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

      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={deleteTicket}
      />
    </Box>
  );
}
