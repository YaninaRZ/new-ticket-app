import { Input, InputField } from "@/components/ui/input";
import api from "@/services/api";
import { Pencil } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  ticketId: string;
  initialTitle?: string;
  initialDescription?: string;
  onClose: () => void;
  onUpdated: (payload: any) => void; // renvoie la réponse API (ticket ou {ticket})
};

export default function EditTicketModal({
  visible,
  ticketId,
  initialTitle,
  initialDescription,
  onClose,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload: Record<string, any> = {};
      if (title?.trim()) payload.title = title.trim();
      if (description?.trim()) payload.description = description.trim();

      // Si rien à envoyer, on ferme sans call
      if (!Object.keys(payload).length) {
        onClose();
        return;
      }

      const res = await api.put(`/tickets/${ticketId}`, payload, {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      onUpdated(res.data?.ticket ?? res.data);
      onClose();
    } catch (e: any) {
      console.error("❌ Erreur update ticket :", e?.response?.data || e?.message || e);
      setErrorMsg("Impossible de mettre à jour le ticket. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  };

  // reset quand on ouvre
  useEffect(() => {
    if (visible) {
      setTitle(initialTitle ?? "");
      setDescription(initialDescription ?? "");
      setErrorMsg(null);
    }
  }, [visible, initialTitle, initialDescription]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modifier le ticket</Text>

          <View style={styles.field}>
            <Input>
              <InputField
                placeholder="Titre"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#9CA3AF"
              />
            </Input>
          </View>

          <View style={styles.field}>
            <Input>
              <InputField
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                placeholderTextColor="#9CA3AF"
              />
            </Input>
          </View>

          {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            {/* ➜ Style identique au bouton “Modifier” du profil (pilule blanche) */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitButton, { opacity: submitting ? 0.7 : 1 }]}
              disabled={submitting}
              activeOpacity={0.9}
            >
              <Pencil size={16} color="#111827" />
              <Text style={styles.submitText}>
                {submitting ? "Enregistrement..." : "Enregistrer"}
              </Text>
            </TouchableOpacity>
          </View>

       
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.2)" },
  modalContent: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  field: { marginBottom: 12 },
  error: { color: "#DC2626", marginTop: 4 },

  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelButton: { padding: 10 },
  cancelText: { color: "#999" },

  // ➜ Pilule blanche comme le bouton “Modifier” du profil
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    justifyContent: "center",
    minWidth: 140,
  },
  submitText: { fontSize: 13, fontWeight: "600", color: "#111827" },

  hint: { marginTop: 10, fontSize: 12, color: "#6B7280" },
});
