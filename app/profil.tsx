import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import { Mail, Pencil } from "lucide-react-native";

import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Profile = {
  id: string;
  email: string;
  username: string;
};

export default function Profil() {
  const { user } = useAuth(); // fallback si besoin
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  const [totalCount, setTotalCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);
  const [openedCount, setOpenedCount] = useState(0); // <- tu peux le garder ou le retirer

  // ---- PROFILE ----
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      let res;
      try {
        // 1) route principale
        res = await api.get("/profile");
      } catch (e) {
        console.warn("⚠️ /profile -> 404, j'essaie /mobile/profile");
        res = await api.get("/mobile/profile");
      }
  
      // 👉 d'après ton log: { profile: { id, email, username, ... } }
      const src = res.data?.profile ?? res.data?.user ?? res.data ?? {};
  
      const p: Profile = {
        id: src.id ?? user?.id ?? "",
        email: src.email ?? user?.email ?? "",
        username: src.username ?? src.name ?? user?.username ?? "Utilisateur",
      };
  
      setProfile(p);
    } catch (err) {
      console.error("❌ Erreur récupération profil :", err);
      // fallback sur useAuth si dispo
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
  
  

  // ---- MY TICKETS ----
  const fetchMyTickets = async (authorId: string) => {
    try {
      if (!authorId) return;
  
      // ✅ 1) Route recommandée
      let res = await api.get(`/tickets/user/${authorId}`, {
        params: { page: 1, limit: 200 }, // si la route supporte la pagination
      });
  
      // Normalise la forme des données (certains back renvoient {tickets: [...]}, d’autres un tableau direct)
      let tickets: any[] = Array.isArray(res.data) ? res.data : (res.data?.tickets ?? []);
  
      // 🔁 2) Fallback si jamais 404/structure vide → on tente l’ancienne route mobile
      if (!tickets.length) {
        try {
          const alt = await api.get(`/mobile/tickets`, {
            params: { author: authorId, page: 1, limit: 200 },
          });
          tickets = alt.data?.tickets ?? [];
        } catch {
          // dernier secours : récupère tout puis filtre côté client
          const altAll = await api.get(`/mobile/tickets`, { params: { page: 1, limit: 200 } });
          const all = altAll.data?.tickets ?? [];
          tickets = all.filter((t: any) => t.author === authorId);
        }
      }
  
      // 🧮 Compteurs
      setTotalCount(tickets.length);
      const closed = tickets.filter((t) => t.status === "closed").length;
      const opened = tickets.filter((t) => t.status === "opened").length;
  
      setClosedCount(closed);
      setOpenedCount(opened);
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

  const handleDelete = () => {
    setIsModalVisible(false);
    console.log("Suppression du compte...");
  };

  const displayUsername =
    (loadingProfile ? "Chargement..." : profile?.username) || "Utilisateur";
  const displayEmail = loadingProfile ? "" : (profile?.email ?? "");

  return (
    
    <View style={styles.container}>
      {/* Avatar */}
      {/* Header / Avatar + bouton Modifier */}
<View style={styles.avatarContainer}>
  <TouchableOpacity style={styles.editBtn} onPress={() => console.log("Editar profil")}>
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

{/* Carte large pour le total */}
<View style={styles.cardFull}>
  <Text style={styles.cardTitle}>Total</Text>
  <Text style={styles.cardValue}>{totalCount}</Text>
</View>

{/* Ligne pour fermés / ouverts */}
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




      {/* Boutons */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.deleteText}>Supprimer le compte</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.closeBtn}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={{ fontSize: 20 }}>×</Text>
            </Pressable>

            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              <View style={styles.emojiBox}>
                <Text style={{ fontSize: 26 }}>😐</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  Supprimer votre compte ?
                </Text>
                <Text style={{ color: "#4B5563", marginTop: 4 }}>
                  Cette action est irréversible.
                </Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnOutline}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.btnOutlineText}>Non</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnBlack} onPress={handleDelete}>
                <Text style={styles.btnBlackText}>Oui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 24 },

  // — Header
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",  
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 40
  },
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
  editText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },


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
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardTitle: { color: "#6B7280", fontSize: 14, marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: "700" },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    position: "relative",
  },
  closeBtn: { position: "absolute", right: 16, top: 16, zIndex: 10 },
  emojiBox: {
    backgroundColor: "#FDE68A",
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnOutlineText: { color: "#000", fontWeight: "600" },
  btnBlack: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnBlackText: { color: "#fff", fontWeight: "600" },

  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },


  cardFull: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    alignItems: "center", // centrer le texte
  },
  
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  
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
  
  
});
