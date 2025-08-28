import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function DeleteModal({
  visible,
  onClose,
  onConfirm,
  title = "Supprimer ce ticket ?",
  message = "Êtes-vous sûr de vouloir supprimer ce ticket ?",
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Card */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Actions style iOS */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={onClose}
              style={styles.actionBtn}
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>

            {/* séparateur vertical */}
            <View style={styles.vDivider} />

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={onConfirm}
              style={styles.actionBtn}
            >
              <Text style={styles.deleteText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const IOS_BLUE = "#007AFF";
const IOS_RED = "#FF3B30";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
    color: "#111827",
    marginBottom: 4,
  },
  message: {
    textAlign: "center",
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  vDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: IOS_BLUE,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "600",
    color: IOS_RED,
  },
});
