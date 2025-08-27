import { Input, InputField } from "@/components/ui/input";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateTicketModal({ visible, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets && result.assets.length > 0) {
      setSelectedFile(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("project", projectId);
      formData.append("project_name", projectName);

      if (selectedFile) {
        formData.append("files", {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "application/octet-stream",
        });
      }

      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam1haXZrZjFuaHgyeW41IiwiZXhwIjoxNzU2MzAyMzY3LCJpYXQiOjE3NTYyMTU5Njd9.L9HibVPvOTZ1zS2PXnZrv1_rwae_qDm9wF3a8m0J3ZQ";

      const response = await axios.post(
        "https://ticketing.development.atelier.ovh/api/mobile/tickets",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Ticket créé avec succès :", response.data);
      onSuccess(response.data.ticket);
      onClose();
    } catch (error) {
      console.error("❌ Erreur création ticket :", error.response?.data || error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Créer un Ticket</Text>

          <View style={styles.field}>
            <Input>
              <InputField placeholder="Titre" value={title} onChangeText={setTitle} />
            </Input>
          </View>

          <View style={styles.field}>
            <Input>
              <InputField placeholder="Description" value={description} onChangeText={setDescription} />
            </Input>
          </View>

          <View style={styles.field}>
            <Input>
              <InputField placeholder="ID Projet" value={projectId} onChangeText={setProjectId} />
            </Input>
          </View>

          <View style={styles.field}>
            <Input>
              <InputField placeholder="Nom du projet" value={projectName} onChangeText={setProjectName} />
            </Input>
          </View>

          {/* Sélecteur custom pour la priorité */}
          <TouchableOpacity
            style={styles.prioritySelector}
            onPress={() => setPriorityModalVisible(true)}
          >
            <Text style={styles.priorityText}>Priorité : {priority}</Text>
          </TouchableOpacity>

          {/* Modal pour afficher la liste des choix */}
          <Modal
            transparent
            visible={priorityModalVisible}
            animationType="fade"
            onRequestClose={() => setPriorityModalVisible(false)}
          >
            <View style={styles.overlay}>
              <View style={styles.priorityList}>
                {["low", "medium", "high", "urgent"].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={styles.priorityItem}
                    onPress={() => {
                      setPriority(p);
                      setPriorityModalVisible(false);
                    }}
                  >
                    <Text style={styles.priorityItemText}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>

          <TouchableOpacity onPress={handleFilePick} style={styles.fileButton}>
            <Text style={styles.fileButtonText}>
              {selectedFile ? selectedFile.name : "Ajouter un fichier"}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitText}>Créer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  modalContent: { margin: 20, backgroundColor: "white", borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  field: { marginBottom: 12 },
  prioritySelector: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
  priorityText: { fontSize: 16, color: "#333" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  priorityList: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    width: "70%",
  },
  priorityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  priorityItemText: { fontSize: 16, textAlign: "center" },
  fileButton: { marginTop: 10, padding: 10, backgroundColor: "#eee", borderRadius: 6 },
  fileButtonText: { color: "#333" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelButton: { padding: 10 },
  cancelText: { color: "#999" },
  submitButton: { backgroundColor: "#000", padding: 10, borderRadius: 6 },
  submitText: { color: "#fff" },
});
