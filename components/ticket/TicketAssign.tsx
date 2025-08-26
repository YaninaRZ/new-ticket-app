import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface User {
  id: string;
  name: string;
  initials: string;
}

interface Props {
  users: User[];
  assignedUser: User | null;
  onAssign: (userId: string) => void;
}

export default function TicketAssign({ users, assignedUser, onAssign }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 16, color: "#111827" }}>Assigné à</Text>
        <View
          style={{
            backgroundColor: "#fbbf24",
            borderRadius: 9999,
            width: 32,
            height: 32,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {assignedUser ? assignedUser.initials : "?"}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={{
          backgroundColor: "#3B82F6",
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}>
          Gérer l’assignement
        </Text>
      </Pressable>

      {/* Modal sélection utilisateur */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable
          onPress={() => setModalVisible(false)}
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
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
              Sélectionner un utilisateur
            </Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {users.map((user) => (
                <Pressable
                  key={user.id}
                  onPress={() => {
                    onAssign(user.id);
                    setModalVisible(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderBottomColor: "#E5E7EB",
                    borderBottomWidth: 1,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#facc15",
                      borderRadius: 9999,
                      width: 32,
                      height: 32,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      {user.initials}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: "#111827" }}>{user.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
