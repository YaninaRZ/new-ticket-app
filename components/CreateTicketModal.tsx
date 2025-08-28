import { Input, InputField } from "@/components/ui/input";
import api from "@/services/api"; // ✅ instance axios authentifiée
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
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
  onClose: () => void;
  onSuccess: (data?: any) => void;
};

type Project = {
  id: string;
  name: string;
};

export default function CreateTicketModal({ visible, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low"|"medium"|"high"|"urgent">("medium");
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);

  // ✅ projet sélectionné
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");

  // ✅ données pour le sélecteur de projet
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSelectorVisible, setProjectSelectorVisible] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // ---- Fetch projects quand la modal s'ouvre ----
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        // 1er essai
        let res = await api.get("/projects");
        let list = (res.data?.projects ?? res.data ?? []) as any[];
        // fallback si l'API renvoie directement un tableau ou une autre clé
        if (!Array.isArray(list)) list = res.data?.items ?? res.data?.data ?? [];

        // 2e essai (route mobile) si vide
        if (!Array.isArray(list) || list.length === 0) {
          try {
            const res2 = await api.get("/mobile/projects");
            let list2 = (res2.data?.projects ?? res2.data ?? []) as any[];
            if (!Array.isArray(list2)) list2 = res2.data?.items ?? res2.data?.data ?? [];
            list = list2;
          } catch {
            // ignore
          }
        }

        const normalized: Project[] = (list || [])
          .map((p: any) => ({
            id: String(p.id ?? p._id ?? p.project_id ?? ""),
            name: String(p.name ?? p.project_name ?? p.title ?? "Projet"),
          }))
          .filter((p: Project) => p.id && p.name);

        setProjects(normalized);
      } catch (e) {
        console.error("❌ Erreur récupération projets :", e);
      } finally {
        setProjectsLoading(false);
      }
    };

    if (visible) {
      fetchProjects();
    } else {
      // reset recherche quand on ferme
      setProjectSearch("");
      setProjectSelectorVisible(false);
    }
  }, [visible]);

  const filteredProjects = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [projectSearch, projects]);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets?.length) {
      setSelectedFile(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!title.trim()) return console.warn("Le titre est requis");
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      if (description.trim()) formData.append("description", description.trim());
      formData.append("priority", priority);

      // n’envoie ces champs que s’ils sont renseignés
      if (projectId.trim()) formData.append("project", projectId.trim());
      if (projectName.trim()) formData.append("project_name", projectName.trim());

      if (selectedFile?.uri) {
        formData.append("files", {
          uri: selectedFile.uri,
          name: selectedFile.name ?? "file",
          type: selectedFile.mimeType ?? "application/octet-stream",
        } as any);
      }

      // ❗ NE PAS fixer "Content-Type": axios gère le boundary
      const res = await api.post("/tickets", formData, {
        headers: { Accept: "application/json" },
      });

      onSuccess(res.data?.ticket ?? res.data);
      onClose();

      // reset local
      setTitle("");
      setDescription("");
      setPriority("medium");
      setProjectId("");
      setProjectName("");
      setSelectedFile(null);
    } catch (error: any) {
      console.error("❌ Erreur création ticket :", error?.response?.data || error?.message || error);
      if (error?.response?.status === 401) {
        console.warn("Votre session a expiré. Veuillez vous reconnecter.");
      }
    } finally {
      setSubmitting(false);
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

          {/* Titre */}
          <View style={styles.field}>
            <Input>
              <InputField placeholder="Titre" value={title} onChangeText={setTitle} />
            </Input>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Input>
              <InputField
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
              />
            </Input>
          </View>

          {/* ✅ Sélecteur de projet */}
          <View style={styles.field}>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setProjectSelectorVisible(true)}
              disabled={projectsLoading}
            >
              <Text style={styles.selectorLabel}>
                Projet :{" "}
                <Text style={styles.selectorValue}>
                  {projectName || (projectsLoading ? "Chargement…" : "Sélectionner")}
                </Text>
              </Text>
            </TouchableOpacity>
            {projectId ? (
              <Text style={styles.selectorHint}>ID sélectionné : {projectId}</Text>
            ) : null}
          </View>

          {/* Priorité */}
          <TouchableOpacity
            style={styles.prioritySelector}
            onPress={() => setPriorityModalVisible(true)}
          >
            <Text style={styles.priorityText}>Priorité : {priority}</Text>
          </TouchableOpacity>

          {/* Modal priorité */}
          <Modal
            transparent
            visible={priorityModalVisible}
            animationType="fade"
            onRequestClose={() => setPriorityModalVisible(false)}
          >
            <View style={styles.overlay}>
              <View style={styles.priorityList}>
                {(["low", "medium", "high", "urgent"] as const).map((p) => (
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

          {/* Modal sélection projet */}
          <Modal
            transparent
            visible={projectSelectorVisible}
            animationType="fade"
            onRequestClose={() => setProjectSelectorVisible(false)}
          >
            <View style={styles.overlay}>
              <View style={styles.projectSheet}>
                <Text style={styles.sheetTitle}>Sélectionner un projet</Text>

                {/* Barre de recherche */}
                <View style={{ marginBottom: 8 }}>
                  <Input>
                    <InputField
                      placeholder="Rechercher un projet…"
                      value={projectSearch}
                      onChangeText={setProjectSearch}
                    />
                  </Input>
                </View>

                <View style={{ maxHeight: 320 }}>
                  <FlatList
                    data={filteredProjects}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                      <Text style={{ textAlign: "center", padding: 12, color: "#6B7280" }}>
                        {projectsLoading ? "Chargement…" : "Aucun projet"}
                      </Text>
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.projectItem}
                        onPress={() => {
                          setProjectId(item.id);
                          setProjectName(item.name);
                          setProjectSelectorVisible(false);
                        }}
                      >
                        <Text style={styles.projectName}>{item.name}</Text>
                        <Text style={styles.projectId}>{item.id}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setProjectSelectorVisible(false)}
                  style={[styles.submitButton, { marginTop: 12 }]}
                >
                  <Text style={styles.submitText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Fichier */}
          <TouchableOpacity onPress={handleFilePick} style={styles.fileButton}>
            <Text style={styles.fileButtonText}>
              {selectedFile ? selectedFile.name : "Ajouter un fichier"}
            </Text>
          </TouchableOpacity>

          {/* Actions */}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitButton, { opacity: submitting ? 0.7 : 1 }]}
              disabled={submitting}
            >
              <Text style={styles.submitText}>{submitting ? "Création..." : "Créer"}</Text>
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

  // Sélecteur de projet
  selector: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#F9FAFB",
  },
  selectorLabel: { fontSize: 16, color: "#111827" },
  selectorValue: { fontWeight: "600" },
  selectorHint: { marginTop: 6, fontSize: 12, color: "#6B7280" },

  // Priorité
  prioritySelector: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
  priorityText: { fontSize: 16, color: "#333" },

  // Overlay générique
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  // Feuille de sélection projet
  projectSheet: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  sheetTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  projectItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  projectName: { fontSize: 15, color: "#111827", fontWeight: "500" },
  projectId: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  // Liste priorité
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

  // Fichier
  fileButton: { marginTop: 10, padding: 10, backgroundColor: "#eee", borderRadius: 6 },
  fileButtonText: { color: "#333" },

  // Actions
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelButton: { padding: 10 },
  cancelText: { color: "#999" },
  submitButton: { backgroundColor: "#000", padding: 10, borderRadius: 6, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "600" },
});
