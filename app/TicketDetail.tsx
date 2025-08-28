import api from "@/services/api";
import { Box, ScrollView } from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

// Sous-composants
import DeleteModal from "@/components/modal/DeleteModal";
import TicketAssign from "@/components/ticket/TicketAssign";
import TicketAttachments from "@/components/ticket/TicketAttachments";
import TicketComments from "@/components/ticket/TicketComments";
import TicketHeader from "@/components/ticket/TicketHeader";
import TicketInfo from "@/components/ticket/TicketInfo";
import { Pressable, Text, View } from "react-native";

// Modal d'édition
import EditTicketModal from "@/components/modal/EditTicketModal";

// Hook auth
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
  const params = useLocalSearchParams<{
    id?: string | string[];
    title?: string | string[];
    author?: string | string[];
    date?: string | string[];
    priority?: string | string[];
    status?: "opened" | "closed" | string | string[];
  }>();

  // utilitaires pour convertir params potentiellement arrays
  const asStr = (v?: string | string[]) =>
    Array.isArray(v) ? v[0] : v ?? "";

  const id = asStr(params.id);
  const initialTitle = asStr(params.title);
  const initialAuthor = asStr(params.author);
  const initialDate = asStr(params.date);
  const initialPriority = asStr(params.priority);
  const initialStatus = asStr(params.status) as "opened" | "closed" | "";

  const { user: currentUser } = useAuth();

  // States principaux
  const [isClosed, setIsClosed] = useState(initialStatus === "closed");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [assignedUser, setAssignedUser] = useState<User | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [ticketTitle, setTicketTitle] = useState<string>(initialTitle || "");
  const [ticketDescription, setTicketDescription] = useState<string>("");
  const [ticketPriority, setTicketPriority] = useState<string>(initialPriority || "");
  const [ticketCompany, setTicketCompany] = useState<string>("");
  const [ticketProject, setTicketProject] = useState<string>("");
  const [ticketAuthor, setTicketAuthor] = useState<string>(initialAuthor || "");

  const priorityColor = useMemo(
    () => (ticketPriority === "urgent" ? "#dc2626" : "#16a34a"),
    [ticketPriority]
  );

  // === API calls ===
  const toggleTicketStatus = async () => {
    if (!id) return;
    try {
      await api.patch(`/tickets/${id}/status`);
      setIsClosed((prev) => !prev);
    } catch (err) {
      console.error("❌ Erreur toggle status", err);
    }
  };

  const assignTicket = async (userId: string) => {
    if (!id) return;
    try {
      await api.post(`/tickets/${id}/assign`, { userId });
      const user = users.find((u) => u.id === userId);
      if (user) setAssignedUser(user);
    } catch (err) {
      console.error("❌ Erreur assignation", err);
    }
  };

  const deleteTicket = async () => {
    if (!id) return;
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
      const formatted: User[] = (res.data?.users ?? []).map((user: any) => ({
        id: user.id,
        name: user.username,
        initials: `${user.username?.[0] ?? ""}${user.username?.[1] ?? ""}`,
      }));
      setUsers(formatted);
    } catch (err) {
      console.error("❌ Erreur fetch users", err);
    }
  };

  const fetchTicketDetails = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/tickets/${id}`);

      if (res.data?.assignedUser) {
        const au = res.data.assignedUser;
        setAssignedUser({
          id: au.id,
          name: au.username,
          initials: `${au.username?.[0] ?? ""}${au.username?.[1] ?? ""}`,
        });
      }

      if (res.data?.ticket) {
        const t = res.data.ticket;
        setTicketTitle(t.title || ticketTitle);
        setTicketDescription(t.description || "");
        setTicketPriority(t.priority || "");
        setTicketCompany(t.company_name || "");
        setTicketProject(t.project_name || "");
      }

      // auteur
      if (res.data?.author) {
        if (typeof res.data.author === "object" && res.data.author.username) {
          setTicketAuthor(res.data.author.username);
        } else if (typeof res.data.author === "string") {
          try {
            const userRes = await api.get(`/users/${res.data.author}`);
            setTicketAuthor(userRes.data?.username || res.data.author);
          } catch (e) {
            console.error("❌ Erreur fetch auteur par ID", e);
            setTicketAuthor(res.data.author);
          }
        }
      }

      // fichiers
      if (res.data?.ticket?.files) {
        try {
          const rawList: string[] = JSON.parse(res.data.ticket.files) || [];
          const list: Attachment[] = rawList.map((fname, idx) => {
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
    if (!id) return;
    try {
      const res = await api.get(`/comments/ticket/${id}`);
      const formatted: Comment[] = (res.data?.comments ?? []).map((c: any) => ({
        id: c.id,
        content: c.content,
        author: c.username,
      }));
      setComments(formatted);
    } catch (err: any) {
      console.error("❌ Erreur fetch comments", err?.response?.data || err);
    }
  };

  const addComment = async (content: string) => {
    if (!id) return;
    try {
      const formData = new FormData();
      formData.append("ticket_id", String(id));
      if (content?.trim()) formData.append("content", content.trim());
      const res = await api.post(`/comments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const server = (res.data?.comment ?? res.data) as any;

      if (server?.id) {
        const newComment: Comment = {
          id: server.id,
          content: server.content ?? content,
          author: server.username ?? currentUser?.username ?? "Moi",
        };
        setComments((prev) => [...prev, newComment]);
      } else {
        await fetchComments();
      }
    } catch (err: any) {
      console.error("❌ Erreur ajout commentaire", err?.response?.data || err);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err: any) {
      console.error("❌ Erreur suppression commentaire", err.response?.data || err.message);
    }
  };

  // suppression d'une pièce jointe (adapte l'endpoint à ton backend)
  const handleDeleteAttachment = async (att: Attachment) => {
    if (!id) return;
    try {
      await api.delete(`/tickets/${id}/files`, { params: { filename: att.filename } });
      setAttachments((prev) => prev.filter((f) => f.id !== att.id));
    } catch (err) {
      console.error("❌ Erreur suppression pièce jointe :", err);
    }
  };

  // Effects
  useEffect(() => {
    fetchUsers();
    fetchTicketDetails();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // callback après update
  const handleUpdated = (payload: any) => {
    const t = payload?.ticket ?? payload ?? {};
    if (t.title) setTicketTitle(t.title);
    if (typeof t.description === "string") setTicketDescription(t.description);

    // si l’API renvoie files (JSON)
    if (t.files) {
      try {
        const list: string[] = JSON.parse(t.files) || [];
        const mapped: Attachment[] = list.map((fname: string, idx: number) => ({
          id: `${t.id}-${idx}`,
          filename: decodeURIComponent(fname),
          url: `https://ticketing.development.atelier.ovh/api/files/tickets/${t.id}/${fname}`,
        }));
        setAttachments(mapped);
      } catch {
        // ignore
      }
    }
  };

  return (
    <Box style={{ backgroundColor: "#fff", flex: 1, padding: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TicketHeader
          title={ticketTitle}
          description={ticketDescription}
          company={ticketCompany}
          project={ticketProject}
          id={id}
          priority={ticketPriority}
          priorityColor={priorityColor}
          isClosed={isClosed}
          onToggle={toggleTicketStatus}
          onEdit={() => setEditModalVisible(true)}
        />

        <TicketInfo author={ticketAuthor} date={initialDate} />

        <TicketAssign users={users} assignedUser={assignedUser} onAssign={assignTicket} />

        {/* Pièces jointes + suppression */}
        <TicketAttachments attachments={attachments} onDelete={handleDeleteAttachment} />

        {/* Commentaires */}
        <TicketComments comments={comments} onAdd={addComment} onDelete={deleteComment} />
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

      {/* Modales */}
      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={deleteTicket}
      />

      <EditTicketModal
        visible={editModalVisible}
        ticketId={id}
        initialTitle={ticketTitle}
        initialDescription={ticketDescription}
        onClose={() => setEditModalVisible(false)}
        onUpdated={handleUpdated}
      />
    </Box>
  );
}
