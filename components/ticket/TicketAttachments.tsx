import { Icon } from "@gluestack-ui/themed";
import { Paperclip, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Attachment {
  id: string;
  filename: string;
  url?: string;
}

interface Props {
  attachments: Attachment[];
  /**
   * Called when the user confirms deletion of an attachment.
   * Implement the API call in the parent. If it throws, the
   * component will reset the pending state so the user can retry.
   */
  onDelete?: (attachment: Attachment) => Promise<void> | void;
}

export default function TicketAttachments({ attachments, onDelete }: Props) {
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const openFile = async (url?: string) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else console.error("❌ Impossible d'ouvrir l'URL :", url);
    } catch (err) {
      console.error("❌ Erreur ouverture fichier :", err);
    }
  };

  const confirmDelete = (att: Attachment) => {
    if (!onDelete) return; // pas d'action si non fourni
    Alert.alert(
      "Supprimer la pièce jointe ?",
      att.filename,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setPendingIds((prev) => [...prev, att.id]);
              await onDelete(att);
            } catch (e) {
              console.error("❌ Erreur suppression pièce jointe :", e);
            } finally {
              setPendingIds((prev) => prev.filter((x) => x !== att.id));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.title}>📎 Pièces jointes</Text>

      {attachments?.length ? (
        <View style={{ gap: 8 }}>
          {attachments.map((file) => {
            const isDeleting = pendingIds.includes(file.id);
            return (
              <View key={file.id} style={styles.row}>
                {/* Lien fichier */}
                <TouchableOpacity
                  style={styles.linkArea}
                  onPress={() => openFile(file.url)}
                  activeOpacity={0.7}
                >
                  <Icon as={Paperclip} style={styles.clipIcon} color="#6B7280" />
                  <Text style={styles.linkText} numberOfLines={1}>
                    {file.filename}
                  </Text>
                </TouchableOpacity>

                {/* Poubelle */}
                {onDelete ? (
                  <TouchableOpacity
                    onPress={() => !isDeleting && confirmDelete(file)}
                    style={[styles.trashBtn, isDeleting && { opacity: 0.5 }]}
                    disabled={isDeleting}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Trash2 size={16} color="#DC2626" />
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.empty}>Aucune pièce jointe</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: "600", marginBottom: 8 },
  empty: { fontSize: 14, color: "#6B7280", fontStyle: "italic" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },

  linkArea: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  clipIcon: { width: 16, height: 16 },
  linkText: { fontSize: 14, color: "#1D4ED8", flexShrink: 1 },

  trashBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
