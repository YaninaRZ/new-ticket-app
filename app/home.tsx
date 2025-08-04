import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
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
import axios from "axios";
import { useRouter } from "expo-router";
import CreateTicketModal from "@/components/CreateTicketModal";

// Define the ticket type
interface Ticket {
  id: string;
  title: string;
  author: string;
  date: string;
  priority: string;
}

export default function Index() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [isEntrepriseActive, setIsEntrepriseActive] = useState(false);
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam1haXZrZjFuaHgyeW41IiwiZXhwIjoxNzU0MzgxNjMxLCJpYXQiOjE3NTQyOTUyMzF9.pSN-hJudJEnWkoMCl10OwMYuUpiwEvYGTwqMFK2vLak";

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "https://ticketing.development.atelier.ovh/api/mobile/tickets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("\ud83d\udcc5 Tickets re\u00e7us du backend :", response.data.tickets);

      const formatted: Ticket[] = response.data.tickets.map((ticket) => ({
        id: ticket.id,
        title: ticket.title,
        author: ticket.author || "Inconnu",
        date: new Date(ticket.created).toLocaleDateString(),
        priority: ticket.priority,
      }));

      setTicketsData(formatted);
    } catch (error) {
      console.error("\u274c Erreur r\u00e9cup\u00e9ration des tickets :", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const renderTicket = ({ item }: { item: Ticket }) => (
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
      <View style={styles.filters}>
        <View style={{ flex: 1 }}>
          <Input size="md" variant="outline">
            <InputField placeholder="Rechercher..." />
          </Input>
        </View>

        <View style={{ flex: 1 }}>
          <Select>
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="S\u00e9lectionner" />
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

      <View style={styles.createButtonWrapper}>
        <Pressable style={styles.createButton} onPress={() => setModalVisible(true)}>
          <PlusIcon size={16} color="#fff" />
          <Text style={styles.createButtonText}>Créer un ticket</Text>
        </Pressable>
      </View>

      <CreateTicketModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={(newTicket) => {
          setModalVisible(false);
          const formattedTicket: Ticket = {
            id: newTicket.id,
            title: newTicket.title,
            author: newTicket.author || "Inconnu",
            date: new Date(newTicket.created).toLocaleDateString(),
            priority: newTicket.priority,
          };
          setTicketsData((prev) => [formattedTicket, ...prev]);
        }}
      />

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