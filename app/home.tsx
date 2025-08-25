import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { PlusIcon } from "lucide-react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import CreateTicketModal from "@/components/CreateTicketModal";
import { useFocusEffect } from "@react-navigation/native";


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
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    company: "",
    sortBy: "",
    sortOrder: "",
  });

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam1haXZrZjFuaHgyeW41IiwiZXhwIjoxNzU2MjAxMjYwLCJpYXQiOjE3NTYxMTQ4NjB9.FkP9hYalt72u2bXOb3wQa3ATQ1L2dqsCdWfpRxR1ZEU";

  const fetchTickets = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "20",
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.company && { company: filters.company }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      });

      const response = await axios.get(
        `https://ticketing.development.atelier.ovh/api/mobile/tickets?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const formatted: Ticket[] = response.data.tickets.map((ticket) => ({
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

  useEffect(() => {
    fetchTickets();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      fetchTickets();
    }, [])
  );

  const renderTicket = ({ item }: { item: Ticket }) => (
    <Pressable
      style={styles.ticketCard}
      onPress={() => router.push({ pathname: "/TicketDetail", params: item })}
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
  <View style={{ marginBottom: 16 }}>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filtersScroll}
  >


    <View style={styles.filterItem}>
      <Select
        selectedValue={filters.status}
        onValueChange={(value) => {
          setFilters((prev) => ({ ...prev, status: value }));
          fetchTickets();
        }}
      >
        <SelectTrigger>
          <SelectInput placeholder="Statut" />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectItem label="Tous" value="" />
            <SelectItem label="Ouverts" value="opened" />
            <SelectItem label="Fermés" value="closed" />
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>

    <View style={styles.filterItem}>
      <Input size="md" variant="outline">
        <InputField
          placeholder="Rechercher par titre..."
          onChangeText={(text) => {
            setFilters((prev) => ({ ...prev, search: text }));
            fetchTickets();
          }}
        />
      </Input>
    </View>

    <View style={styles.filterItem}>
      <Select
        selectedValue={filters.sortBy}
        onValueChange={(value) => {
          setFilters((prev) => ({ ...prev, sortBy: value }));
          fetchTickets();
        }}
      >
        <SelectTrigger>
          <SelectInput placeholder="Trier par..." />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectItem label="Création" value="created" />
            <SelectItem label="Priorité" value="priority" />
            <SelectItem label="Titre" value="title" />
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>

    <View style={styles.filterItem}>
      <Select
        selectedValue={filters.sortOrder}
        onValueChange={(value) => {
          setFilters((prev) => ({ ...prev, sortOrder: value }));
          fetchTickets();
        }}
      >
        <SelectTrigger>
          <SelectInput placeholder="Ordre de tri" />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectItem label="Ascendant" value="ASC" />
            <SelectItem label="Descendant" value="DESC" />
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  </ScrollView>
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
        onEndReached={() => fetchTickets(page)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <Text>Chargement...</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  filtersScroll: { paddingVertical: 8 },
  filters: { flexDirection: "row", alignItems: "center" },
  filterItem: { marginRight: 16, minWidth: 150 },
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
