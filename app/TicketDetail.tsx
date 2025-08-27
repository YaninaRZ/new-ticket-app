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

interface Attachment {
  id: string;
  filename: string;
  url?: string;
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

  const { user: currentUser } = useAuth();

  // ✅ States principaux
  const [isClosed, setIsClosed] = useState(status === "closed");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [assignedUser, setAssignedUser] = useState<User | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [ticketDescription, setTicketDescription] = useState<string>("");
  const [ticketPriority, setTicketPriority] = useState<string>(priority || "");
  const [ticketCompany, setTicketCompany] = useState<string>("");
  const [ticketProject, setTicketProject] = useState<string>("");
  const [ticketAuthor, setTicketAuthor] = useState<string>(author || "");

  const priorityColor =
    ticketPriority === "urgent" ? "#dc2626" : "#16a34a";

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

      if (res.data.ticket) {
        setTicketDescription(res.data.ticket.description || "");
        setTicketPriority(res.data.ticket.priority || "");
        setTicketCompany(res.data.ticket.company_name || "");
        setTicketProject(res.data.ticket.project_name || "");
      }
    
      if (res.data.author) {
      if (typeof res.data.author === "object" && res.data.author.username) {
        setTicketAuthor(res.data.author.username);
      } else if (typeof res.data.author === "string") {
        // cas où c'est un ID → on fetch le user
        try {
          const userRes = await api.get(`/users/${res.data.author}`);
          setTicketAuthor(userRes.data.username || res.data.author);
        } catch (e) {
          console.error("❌ Erreur fetch auteur par ID", e);
          setTicketAuthor(res.data.author); // fallback ID
        }
      }
    }

      // 🔻 Fichiers (string JSON -> array)
      if (res.data.ticket?.files) {
        try {
          const rawList: string[] = JSON.parse(res.data.ticket.files) || [];
          const list = rawList.map((fname, idx) => {
            const displayName = decodeURIComponent(fname);
            const url = `https://ticketing.development.atelier.ovh/api/files/tickets/${res.data.ticket.id}/${fname}`;
            return {
              id: `${res.data.ticket.id}-${idx}`,
              filename: displayName,
              url,
            };
          });
          setAttachments(list);
        } catch (e) {
          console.error("❌ Erreur parsing files", e);
          setAttachments([]);
        }
      } else {
        setAttachments([]);
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
        author: c.username, // on affiche bien le username
      }));
      setComments(formatted);
    } catch (err: any) {
      console.error("❌ Erreur fetch comments", err?.response?.data || err);
    }
  };
  const addComment = async (content: string) => {
    try {
      if (!id) {
        console.warn("⚠️ Pas d'id de ticket, impossible d'ajouter un commentaire.");
        return;
      }
  
      const formData = new FormData();
      formData.append("ticket_id", String(id));
      if (content?.trim()) formData.append("content", content.trim());
  
      const res = await api.post(`/comments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // L'API peut renvoyer soit directement l'objet, soit { comment: {...} }
      const server = (res.data?.comment ?? res.data) as any;
  
      if (server?.id) {
        // ✅ On a un vrai id retourné par le backend → push immédiat
        const newComment = {
          id: server.id,
          content: server.content ?? content,
          author: server.username ?? currentUser?.username ?? "Moi",
        };
        setComments((prev) => [...prev, newComment]);
      } else {
        // 🔁 Pas d'ID fiable dans la réponse → on refetch pour récupérer les vrais IDs
        await fetchComments();
      }
    } catch (err: any) {
      console.error("❌ Erreur ajout commentaire", err?.response?.data || err);
    }
  };
  
  

  // ✅ suppression d’un commentaire
  const deleteComment = async (commentId: string) => {
    try {
      console.log(`🗑️ Suppression du commentaire ${commentId}...`);
      await api.delete(`/comments/${commentId}`); // ✅ chemin correct
      // mise à jour du state local
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      console.log("✅ Commentaire supprimé !");
    } catch (err: any) {
      console.error("❌ Erreur suppression commentaire", err.response?.data || err.message);
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
          description={ticketDescription}
          company={ticketCompany}
          project={ticketProject}
          id={id}
          priority={ticketPriority}
          priorityColor={priorityColor}
          isClosed={isClosed}
          onToggle={toggleTicketStatus}
        />

        <TicketInfo author={ticketAuthor} date={date} />


        <TicketAssign
          users={users}
          assignedUser={assignedUser}
          onAssign={assignTicket}
        />

        {/* ✅ Pièces jointes dynamiques */}
        <TicketAttachments attachments={attachments} />

        {/* ✅ Commentaires + suppression */}
        <TicketComments
          comments={comments}
          onAdd={addComment}
          onDelete={deleteComment}
        />
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
