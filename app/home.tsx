import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import "react-native-reanimated";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { PlusIcon } from "lucide-react-native";
import {
  RadioGroup,
  Radio,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { useRouter } from "expo-router";
import axios from "axios";

export default function Index() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEntrepriseActive, setIsEntrepriseActive] = useState(false);
  const [ticketsData, setTicketsData] = useState([]);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets && result.assets.length > 0) {
      setSelectedFile(result.assets[0]);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "https://ticketing.development.atelier.ovh/api/mobile/tickets",
          {
            headers: {
              Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam1haXZrZjFuaHgyeW41IiwiZXhwIjoxNzU0MTQ0MjExLCJpYXQiOjE3NTQwNTc4MTF9.OU1m2m8QD391SPBjiBsk51elo0hrEqfi8tVrfJ5_heU"}`,
              Accept: "application/json",
            },
          }
        );

        const formatted = response.data.tickets.map((ticket) => ({
          id: ticket.id,
          title: ticket.title,
          author: ticket.author || "Inconnu",
          date: new Date(ticket.created).toLocaleDateString(),
          priority: ticket.priority,
        }));

        setTicketsData(formatted);
      } catch (error) {
        console.error("❌ Erreur récupération des tickets :", error);
      }
    };

    fetchTickets();
  }, []);

  const renderTicket = ({ item }) => (
    <Pressable
      style={styles.ticketCard}
      onPress={() =>
        router.push({
          pathname: "/TicketDetail",
          params: item,
        })
      }
    >
      <Text style={styles.ticketTitle}>{item.title}</Text>
      <Text style={styles.ticketMeta}>Auteur : {item.author}</Text>
      <Text style={styles.ticketMeta}>Date : {item.date}</Text>
      <Text style={[styles.ticketPriority, styles[`priority_${item.priority}`]]}>
        Priorité : {item.priority}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Filtres UI */}
      <View style={styles.filters}>
        <View style={{ flex: 1 }}>
          <Input size="md" variant="outline">
            <InputField placeholder="Rechercher..." />
          </Input>
        </View>

        <View style={{ flex: 1 }}>
          <Select>
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="Sélectionner" />
              <SelectIcon as={ChevronDownIcon} style={{ marginLeft: 8 }} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label="UX Research" value="ux" />
                <SelectItem label="Web Development" value="web" />
                <SelectItem label="Cross Platform Development Process" value="cross" />
                <SelectItem label="UI Designing" value="ui" isDisabled />
                <SelectItem label="Backend Development" value="backend" />
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        <TouchableOpacity onPress={() => setIsEntrepriseActive(!isEntrepriseActive)}>
          <Text
            style={[
              styles.filterText,
              isEntrepriseActive && styles.filterTextActive,
            ]}
          >
            Entreprise
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Créer un ticket */}
      <View style={styles.createButtonWrapper}>
        <Pressable style={styles.createButton} onPress={() => setModalVisible(true)}>
          <PlusIcon size={16} color="#fff" />
          <Text style={styles.createButtonText}>Créer un ticket</Text>
        </Pressable>
      </View>

      {/* Statistiques */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tickets fermés</Text>
          <Text style={styles.statValue}>30</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tickets en attente</Text>
          <Text style={styles.statValue}>30</Text>
        </View>
      </View>

      {/* Liste des tickets */}
      <FlatList
        data={ticketsData}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  filters: { flexDirection: "row", alignItems: "center", gap: 12 },
  createButtonWrapper: { marginTop: 16, alignItems: "flex-end" },
  createButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontWeight: "600", marginLeft: 8 },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  statBox: {
    flex: 1,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
  },
  statLabel: { color: "#6B7280", fontSize: 16, marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: "700", color: "#000" },
  filterText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginLeft: 8,
  },
  filterTextActive: { backgroundColor: "#E5E7EB", color: "#111827" },
  ticketCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  ticketTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  ticketMeta: { fontSize: 14, color: "#6B7280" },
  ticketPriority: { marginTop: 6, fontWeight: "600" },
  priority_low: { color: "green" },
  priority_medium: { color: "orange" },
  priority_high: { color: "red" },
  priority_urgent: { color: "purple" },
});
