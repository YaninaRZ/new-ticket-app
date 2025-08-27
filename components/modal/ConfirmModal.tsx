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
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  title = "Confirmation",
  message = "Êtes-vous sûr ?",
  confirmLabel = "Oui",
  cancelLabel = "Non",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Pressable style={styles.closeBtn} onPress={onCancel}>
            <Text style={{ fontSize: 20 }}>×</Text>
          </Pressable>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnOutline} onPress={onCancel}>
              <Text style={styles.btnOutlineText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnDanger} onPress={onConfirm}>
              <Text style={styles.btnDangerText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  content: {
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
  title: { fontWeight: "700", fontSize: 16, marginBottom: 8 },
  message: { color: "#4B5563", marginBottom: 16 },
  actions: { flexDirection: "row", gap: 12 },
  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutlineText: { color: "#000", fontWeight: "600" },
  btnDanger: {
    flex: 1,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDangerText: { color: "#fff", fontWeight: "700" },
});
