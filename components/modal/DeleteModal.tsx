import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ visible, onClose, onConfirm }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
            Êtes-vous sûr de vouloir supprimer ce ticket ?
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={onClose}
              style={{
                flex: 1,
                backgroundColor: "#E5E7EB",
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "600", color: "#111827" }}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={{
                flex: 1,
                backgroundColor: "#dc2626",
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "600", color: "#fff" }}>Supprimer</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
