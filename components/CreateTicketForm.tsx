import React, { useState } from "react";
import { Modal, View } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import CreateTicketForm from "@/components/CreateTicketForm"; 
import * as DocumentPicker from "expo-document-picker";

type CreateTicketFormProps = {
    onClose: () => void;
  };
  export default function TicketForm({ onClose }: CreateTicketFormProps) {
  const [showModal, setShowModal] = useState(false);
  

  return (
    <>
      <Pressable
        onPress={() => setShowModal(true)}
        style={{
          backgroundColor: "#000",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          margin: 20,
        }}
      >
        <Text style={{ color: "#fff" }}>Créer un ticket</Text>
      </Pressable>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end", // pour effet bottom sheet
            backgroundColor: "rgba(0,0,0,0.3)",
            paddingTop: 80, // espace en haut
          }}
        >
          <CreateTicketForm onClose={() => setShowModal(false)} />
        </View>
      </Modal>
    </>
  );
}
