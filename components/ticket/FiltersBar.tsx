import { Input, InputField } from "@/components/ui/input";
import { Select, SelectBackdrop, SelectContent, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export type TicketsFilters = {
  status: string;
  search: string;
  company: string;
  sortBy: string;
  sortOrder: string;
};

type Props = {
  value: TicketsFilters;
  onChange: (next: TicketsFilters) => void;
  /** déclenché quand l’utilisateur a “vraiment” changé un filtre (debounce pour la recherche) */
  onApply?: (next: TicketsFilters) => void;
  /** ms de debounce pour la recherche */
  searchDebounceMs?: number;
};

export default function FiltersBar({ value, onChange, onApply, searchDebounceMs = 300 }: Props) {
  // on garde un état local seulement pour 'search' afin de debouncer
  const [localSearch, setLocalSearch] = useState(value.search);

  // sync si value.search change depuis l’extérieur
  useEffect(() => {
    setLocalSearch(value.search);
  }, [value.search]);

  // debounce pour notifier onApply quand la recherche change
  useEffect(() => {
    const id = setTimeout(() => {
      if (localSearch !== value.search) {
        const next = { ...value, search: localSearch };
        onChange(next);
        onApply?.(next);
      }
    }, searchDebounceMs);
    return () => clearTimeout(id);
  }, [localSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const pillStyle = styles.filterPill;
  const textStyle = styles.filterText;

  return (
    <View style={{ marginBottom: 16 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
        {/* Statut */}
        <View style={styles.filterItem}>
          <Select
            selectedValue={value.status}
            onValueChange={(v) => {
              const next = { ...value, status: v };
              onChange(next);
              onApply?.(next);
            }}
          >
            <SelectTrigger style={pillStyle}>
              <SelectInput placeholder="Statut" style={textStyle} />
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

        {/* Recherche (debounced) */}
        <View style={styles.filterItem}>
          <Input size="md" variant="outline" style={pillStyle}>
            <InputField
              placeholder="Rechercher…"
              placeholderTextColor="#6B7280"
              style={textStyle}
              value={localSearch}
              onChangeText={setLocalSearch}
              returnKeyType="search"
              onSubmitEditing={() => {
                const next = { ...value, search: localSearch };
                onChange(next);
                onApply?.(next);
              }}
            />
          </Input>
        </View>

        {/* Trier par */}
        <View style={styles.filterItem}>
          <Select
            selectedValue={value.sortBy}
            onValueChange={(v) => {
              const next = { ...value, sortBy: v };
              onChange(next);
              onApply?.(next);
            }}
          >
            <SelectTrigger style={pillStyle}>
              <SelectInput placeholder="Trier par…" style={textStyle} />
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

        {/* Ordre */}
        <View style={styles.filterItem}>
          <Select
            selectedValue={value.sortOrder}
            onValueChange={(v) => {
              const next = { ...value, sortOrder: v };
              onChange(next);
              onApply?.(next);
            }}
          >
            <SelectTrigger style={pillStyle}>
              <SelectInput placeholder="Ordre" style={textStyle} />
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
  );
}

const styles = StyleSheet.create({
  filtersScroll: { paddingVertical: 8, paddingRight: 8 },
  filterItem: { marginRight: 12 },
  filterPill: {
    backgroundColor: "#F3F4F6", // gris clair
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
  },
  filterText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
