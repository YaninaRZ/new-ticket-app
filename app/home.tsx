import CreateTicketModal from "@/components/CreateTicketModal";
import FiltersBar, { type TicketsFilters } from "@/components/ticket/FiltersBar";
import TicketCard from "@/components/ticket/TicketCard";
import TicketsStats from "@/components/ticket/TicketsStats";

import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

type UserMap = Record<string, string>;

interface Ticket {
  id: string;
  title: string;
  author: string; // username affichable
  date: string;
  priority: string;
  status: string;
}

const LIMIT = 20;

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  const [userMap, setUserMap] = useState<UserMap>({});
  const [modalVisible, setModalVisible] = useState(false);

  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(false); // infinite scroll
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh

  const [filters, setFilters] = useState<TicketsFilters>({
    status: "",
    search: "",
    company: "",
    sortBy: "",
    sortOrder: "",
  });

  // ---------- Helpers auteur ----------
  const extractUsernameFromTicket = (t: any): string | undefined =>
    t.username ||
    t.author_name ||
    t.authorUsername ||
    t.author?.username ||
    t.createdBy?.username ||
    t.owner?.username ||
    t.user?.username ||
    undefined;

  const getAuthorId = (t: any): string | undefined =>
    (typeof t.author === "string" && t.author) ||
    t.author_id ||
    t.user_id ||
    t.createdById ||
    t.owner_id ||
    t.user?.id ||
    t.author?.id ||
    undefined;

  const resolveAuthor = (
    raw: any,
    map: Record<string, string>,
    me?: { id?: string; username?: string }
  ): string => {
    const direct = extractUsernameFromTicket(raw);
    if (direct) return direct;

    const aid = getAuthorId(raw);
    if (aid && map[aid]) return map[aid];

    if (aid && me?.id && aid === me.id && me.username) return me.username;

    return (typeof raw.author === "string" && raw.author) || "Inconnu";
  };

  // ===== FETCH TICKETS (pagination) =====
  const fetchTickets = async ({ reset = false }: { reset?: boolean } = {}) => {
    if (isLoading || refreshing) return;

    const nextPage = reset ? 1 : page;
    try {
      reset ? setRefreshing(true) : setIsLoading(true);

      const { data } = await api.get("/tickets", {
        params: {
          page: nextPage,
          limit: LIMIT,
          ...(filters.status && { status: filters.status }),
          ...(filters.search && { search: filters.search }),
          ...(filters.company && { company: filters.company }),
          ...(filters.sortBy && { sortBy: filters.sortBy }),
          ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        },
      });

      const rawTickets: any[] = data?.tickets ?? [];

      // enrichir le cache {authorId -> username}
      const nextMap: UserMap = reset ? {} : { ...userMap };

      for (const t of rawTickets) {
        const u = extractUsernameFromTicket(t);
        const aid = getAuthorId(t);
        if (u && aid) nextMap[aid] = u;
      }

      // chercher les ids inconnus et les résoudre
      const unknownIds = Array.from(
        new Set(
          rawTickets
            .map((t) => getAuthorId(t))
            .filter((id): id is string => !!id && !nextMap[id])
        )
      );

      if (unknownIds.length) {
        const lookups = await Promise.allSettled(
          unknownIds.map((id) => api.get(`/users/${id}`))
        );
        lookups.forEach((r, i) => {
          if (r.status === "fulfilled") {
            const u =
              r.value.data?.username ||
              r.value.data?.name ||
              r.value.data?.user?.username ||
              r.value.data?.user?.name;
            if (u) nextMap[unknownIds[i]] = u;
          }
        });
      }

      const formattedPage: Ticket[] = rawTickets.map((t) => ({
        id: t.id,
        title: t.title,
        author: resolveAuthor(t, nextMap, { id: user?.id, username: user?.username }),
        date: new Date(t.created ?? t.createdAt ?? Date.now()).toLocaleDateString(),
        priority: t.priority,
        status: t.status,
      }));

      setUserMap(nextMap);

      // merge / reset
      setTicketsData((prev) => (reset ? formattedPage : [...prev, ...formattedPage]));

      // ===== HAS MORE =====
      const total: number | undefined = data?.total;
      const limitFromApi: number | undefined = data?.limit;
      const currentPage: number | undefined = data?.page;

      if (typeof total === "number" && (limitFromApi || LIMIT)) {
        const limit = limitFromApi || LIMIT;
        const usedPage = currentPage || nextPage;
        setHasMore(usedPage * limit < total);
      } else {
        setHasMore(rawTickets.length === LIMIT);
      }

      if (reset) {
        setPage(2); // on vient de charger page 1
      } else if (rawTickets.length > 0) {
        setPage(nextPage + 1);
      }
    } catch (err) {
      console.error("❌ Erreur récupération des tickets :", err);
    } finally {
      reset ? setRefreshing(false) : setIsLoading(false);
    }
  };

  // init (1ère page)
  useEffect(() => {
    fetchTickets({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (on re-fetch via le bouton "Appliquer" de FiltersBar)
  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, [])
  );

  const onEndReached = () => {
    if (!isLoading && hasMore) fetchTickets();
  };

  const onRefresh = () => fetchTickets({ reset: true });

  return (
    <View style={styles.container}>
      {/* ✅ Filtres factorisés */}
      <FiltersBar
        value={filters}
        onChange={setFilters}
        onApply={() => fetchTickets({ reset: true })}
      />

      {/* Bouton créer */}
      <View style={styles.createButtonWrapper}>
        <Pressable style={styles.createButton} onPress={() => setModalVisible(true)}>
          <PlusIcon size={16} color="#fff" />
          <Text style={styles.createButtonText}>Créer un ticket</Text>
        </Pressable>
      </View>

      {/* Modal création */}
      <CreateTicketModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={(payload) => {
          setModalVisible(false);
          const t = payload?.ticket ?? payload ?? {};
          const createdISO = t.created ?? t.createdAt ?? t.date ?? new Date().toISOString();

          const authorDisplay =
            t.username ||
            t.author_name ||
            t.authorUsername ||
            t.author?.username ||
            (typeof t.author === "string" && userMap[t.author] ? userMap[t.author] : undefined) ||
            (t.author === user?.id ? user?.username : undefined) ||
            "Inconnu";

          const formatted: Ticket = {
            id: t.id,
            title: t.title ?? "(Sans titre)",
            author: authorDisplay,
            date: new Date(createdISO).toLocaleDateString(),
            priority: t.priority ?? "low",
            status: t.status ?? "opened",
          };

          // on insère en tête de liste
          setTicketsData((prev) => [formatted, ...prev]);

          // enrichir le cache si possible
          const aid = getAuthorId(t);
          if (aid && authorDisplay && authorDisplay !== "Inconnu") {
            setUserMap((prev) => ({ ...prev, [aid]: authorDisplay }));
          }
        }}
      />

      {/* Stats rapides */}
      <TicketsStats
        opened={ticketsData.filter((x) => x.status === "opened").length}
        closed={ticketsData.filter((x) => x.status === "closed").length}
      />

      {/* Liste paginée */}
      <FlatList
        data={ticketsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TicketCard ticket={item} />}
        style={{ marginTop: 20 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={
          isLoading ? (
            <Text style={{ textAlign: "center", padding: 12 }}>Chargement…</Text>
          ) : !hasMore && ticketsData.length > 0 ? (
            <Text style={{ textAlign: "center", padding: 12, color: "#6B7280" }}>
              — fin de liste —
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },

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
});
