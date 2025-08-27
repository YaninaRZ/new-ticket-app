import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import { Mail } from "lucide-react-native";
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

export default function Profil() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuth();

  const [closedCount, setClosedCount] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);

  const fetchMyTickets = async () => {
    try {
      if (!user?.id) return;
      const res = await api.get(`/tickets?author=${user.id}`);
      const tickets = res.data.tickets || [];

      const closed = tickets.filter((t: any) => t.status === "closed").length;
      const opened = tickets.filter((t: any) => t.status === "opened").length;

      setClosedCount(closed);
      setOpenedCount(opened);
    } catch (err) {
      console.error("❌ Erreur récupération tickets user :", err);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [user]);

  const handleDelete = () => {
    setIsModalVisible(false);
    console.log("Suppression du compte...");
    // 👉 ajoute ici la vraie logique de suppression
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://randomuser.me/api/portraits/women/44.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.username || "Utilisateur"}</Text>
      </View>

      {/* Email */}
      <Text style={styles.sectionTitle}>Votre mail</Text>
      <View style={styles.inputWrapper}>
        <Mail color="#A1A1AA" style={styles.icon} size={18} />
        <TextInput
          style={styles.input}
          placeholder="xxx@gmail.com"
          placeholderTextColor="#A1A1AA"
          editable={false}
          value={user?.email || ""}
        />
      </View>

      {/* Tickets */}
      <Text style={styles.sectionTitle}>Vos Tickets</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tickets fermés</Text>
        <Text style={styles.cardValue}>{closedCount}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tickets ouverts</Text>
        <Text style={styles.cardValue}>{openedCount}</Text>
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

      {/* Modal de confirmation */}
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
  avatarContainer: { alignItems: "center", marginBottom: 32 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  name: { fontSize: 20, fontWeight: "700", marginTop: 12 },
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
});
