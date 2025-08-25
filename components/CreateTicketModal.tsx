import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import axios from "axios";

export default function CreateTicketModal({ visible, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [projectId, setProjectId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectName, setProjectName] = useState("");


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
      formData.append("project", projectId); // ✅ Champ correct
      formData.append("project_name", projectName);

      if (selectedFile) {
        formData.append("files", {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "application/octet-stream",
        });
      }
  
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam1haXZrZjFuaHgyeW41IiwiZXhwIjoxNzU2MTk0Mzc0LCJpYXQiOjE3NTYxMDc5NzR9.jI88yJp5N0hshsXB9kLr90OJmnSta5_K7OKZODS8eWg";
  
      // 🔍 LOG des champs envoyés
      for (let [key, value] of formData.entries()) {
        console.log(`📤 ${key}: ${value}`);
      }
  
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
      onSuccess(response.data.ticket); // passe le ticket à Index

      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Erreur création ticket - Réponse serveur :", error.response?.data);
      } else {
        console.error("❌ Erreur inconnue :", error);
      }
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

          <Input>
            <InputField placeholder="Titre" value={title} onChangeText={setTitle} />
          </Input>

          <Input>
            <InputField placeholder="Description" value={description} onChangeText={setDescription} />
          </Input>

          <Input>
            <InputField placeholder="ID Projet" value={projectId} onChangeText={setProjectId} />
          </Input>

          <Input>
  <InputField placeholder="Nom du projet" value={projectName} onChangeText={setProjectName} />
</Input>

          <Select selectedValue={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectInput placeholder="Priorité" />
              <ChevronDownIcon />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectItem label="Low" value="low" />
                <SelectItem label="Medium" value="medium" />
                <SelectItem label="High" value="high" />
                <SelectItem label="Urgent" value="urgent" />
              </SelectContent>
            </SelectPortal>
          </Select>

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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  fileButton: { marginTop: 10, padding: 10, backgroundColor: "#eee", borderRadius: 6 },
  fileButtonText: { color: "#333" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelButton: { padding: 10 },
  cancelText: { color: "#999" },
  submitButton: { backgroundColor: "#000", padding: 10, borderRadius: 6 },
  submitText: { color: "#fff" },
});
