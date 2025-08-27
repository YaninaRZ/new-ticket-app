import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  initialUsername: string;
  initialEmail: string;
  saving?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: { username: string; email: string }) => void;
};

export default function EditProfileModal({
  visible,
  initialUsername,
  initialEmail,
  saving = false,
  error = null,
  onClose,
  onSubmit,
}: Props) {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);

  // Quand on (ré)ouvre, réinitialiser les champs
  useEffect(() => {
    if (visible) {
      setUsername(initialUsername);
      setEmail(initialEmail);
    }
  }, [visible, initialUsername, initialEmail]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={{ fontSize: 20 }}>×</Text>
          </Pressable>

          <Text style={styles.title}>Modifier le profil</Text>

          <Text style={styles.label}>Nom d'utilisateur</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Votre nom d'utilisateur"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.btnPrimary, { opacity: saving ? 0.7 : 1 }]}
            disabled={saving}
            onPress={() => onSubmit({ username: username.trim(), email: email.trim() })}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnPrimaryText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    width: "90%",
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
  title: { fontWeight: "700", fontSize: 16, marginBottom: 12 },
  label: { fontSize: 13, color: "#6B7280", marginTop: 8, marginBottom: 6 },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  input: { fontSize: 16, color: "#111827" },
  error: { color: "#DC2626", marginTop: 8 },
  btnPrimary: {
    marginTop: 16,
    backgroundColor: "#000",
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});
