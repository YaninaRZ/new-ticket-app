import ConfirmModal from "@/components/modal/ConfirmModal";
import EditProfileModal from "@/components/modal/EditProfileModal";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import { Mail, Pencil } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Profile = { id: string; email: string; username: string };

export default function Profil() {
  const { user } = useAuth();

  // Modals
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);

  // State profil & tickets
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);

  // State edition
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      let res;
      try {
        res = await api.get("/profile");
      } catch {
        res = await api.get("/mobile/profile");
      }
      const src = res.data?.profile ?? res.data?.user ?? res.data ?? {};
      const p: Profile = {
        id: src.id ?? user?.id ?? "",
        email: src.email ?? user?.email ?? "",
        username: src.username ?? src.name ?? user?.username ?? "Utilisateur",
      };
      setProfile(p);
    } catch (err) {
      console.error("❌ Erreur récupération profil :", err);
      if (user?.id) {
        setProfile({
          id: user.id,
          email: user.email ?? "",
          username: user.username ?? "Utilisateur",
        });
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchMyTickets = async (authorId: string) => {
    try {
      if (!authorId) return;
      let res = await api.get(`/tickets/user/${authorId}`, { params: { page: 1, limit: 200 } });
      let tickets: any[] = Array.isArray(res.data) ? res.data : (res.data?.tickets ?? []);
      if (!tickets.length) {
        try {
          const alt = await api.get(`/mobile/tickets`, {
            params: { author: authorId, page: 1, limit: 200 },
          });
          tickets = alt.data?.tickets ?? [];
        } catch {
          const altAll = await api.get(`/mobile/tickets`, { params: { page: 1, limit: 200 } });
          const all = altAll.data?.tickets ?? [];
          tickets = all.filter((t: any) => t.author === authorId);
        }
      }
      setTotalCount(tickets.length);
      setClosedCount(tickets.filter((t) => t.status === "closed").length);
      setOpenedCount(tickets.filter((t) => t.status === "opened").length);
    } catch (err) {
      console.error("❌ Erreur récupération tickets user :", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    if (profile?.id) fetchMyTickets(profile.id);
  }, [profile?.id]);

  const openEdit = () => {
    setSaveError(null);
    setIsEditVisible(true);
  };

  const handleSaveProfile = async ({ username, email }: { username: string; email: string }) => {
    if (!username || !email) {
      setSaveError("Veuillez renseigner un nom d'utilisateur et un email.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await api.put("/profile", { username, email });
      const updated = res.data?.profile ?? res.data ?? {};
      const next: Profile = {
        id: updated.id ?? profile?.id ?? "",
        email: updated.email ?? email,
        username: updated.username ?? username,
      };
      setProfile(next);
      setIsEditVisible(false);
    } catch (err: any) {
      console.error("❌ Erreur mise à jour profil :", err?.response?.data || err?.message || err);
      setSaveError("Impossible de mettre à jour le profil. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setIsConfirmVisible(false);
    console.log("Suppression du compte…");
  };

  const displayUsername =
    (loadingProfile ? "Chargement…" : profile?.username) || "Utilisateur";
  const displayEmail = loadingProfile ? "" : profile?.email ?? "";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {/* Header / Avatar + bouton Modifier */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
            <Pencil size={16} color="#000" />
            <Text style={styles.editText}>Modifier</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{displayUsername}</Text>
        </View>

        {/* Email */}
        <Text style={styles.sectionTitle}>Votre mail</Text>
        <View style={styles.inputWrapper}>
          <Mail color="#A1A1AA" style={styles.icon} size={18} />
          <TextInput
            style={styles.input}
            placeholder={loadingProfile ? "Chargement..." : ""}
            placeholderTextColor="#A1A1AA"
            editable={false}
            value={displayEmail}
          />
        </View>

        {/* Tickets */}
        <Text style={styles.sectionTitle}>Vos Tickets</Text>
        <View style={styles.cardFull}>
          <Text style={styles.cardTitle}>Total</Text>
          <Text style={styles.cardValue}>{totalCount}</Text>
        </View>
        <View style={styles.cardsRow}>
          <View style={styles.cardHalf}>
            <Text style={styles.cardTitle}>Fermés</Text>
            <Text style={styles.cardValue}>{closedCount}</Text>
          </View>
          <View style={styles.cardHalf}>
            <Text style={styles.cardTitle}>Ouverts</Text>
            <Text style={styles.cardValue}>{openedCount}</Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => setIsConfirmVisible(true)}>
          <Text style={styles.deleteText}>Supprimer le compte</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={isEditVisible}
        initialUsername={profile?.username ?? ""}
        initialEmail={profile?.email ?? ""}
        saving={saving}
        error={saveError}
        onClose={() => setIsEditVisible(false)}
        onSubmit={handleSaveProfile}
      />

      <ConfirmModal
        visible={isConfirmVisible}
        title="Supprimer votre compte ?"
        message="Cette action est irréversible."
        confirmLabel="Oui"
        cancelLabel="Non"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 24 },
  avatarContainer: { alignItems: "center", marginBottom: 24, position: "relative" },
  avatar: { width: 120, height: 120, borderRadius: 60, marginTop: 40 },
  name: { fontSize: 20, fontWeight: "700", marginTop: 12 },
  editBtn: {
    position: "absolute",
    top: 0,
    right: 0,
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
  },
  editText: { fontSize: 13, fontWeight: "600", color: "#111827" },
  sectionTitle: { fontWeight: "600", marginBottom: 8, fontSize: 16 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#000" },
  cardTitle: { color: "#6B7280", fontSize: 14, marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: "700" },
  cardFull: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    alignItems: "center",
  },
  cardsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  cardHalf: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 4,
    alignItems: "center",
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  logoutText: { color: "#000", fontSize: 16, fontWeight: "600" },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  deleteText: { color: "#DC2626", fontSize: 16, fontWeight: "600" },
});
