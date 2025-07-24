import React, { useState } from "react";
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
import { ScrollView } from "react-native";
import TicketList from "@/components/TicketList";
import { useRouter } from "expo-router";


export default function Index() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets && result.assets.length > 0) {
      setSelectedFile(result.assets[0]);
    }
  };

const ticketsData: Ticket[] = [
    {
      id: "1",
      title: "Titre",
      author: "Lisa",
      date: "12/12/12",
      priority: "urgent",
    },
    {
      id: "2",
      title: "Titre",
      author: "Misa",
      date: "12/12/12",
      priority: "urgent",

    },
    // ...
  ];

  const [isEntrepriseActive, setIsEntrepriseActive] = useState(false);


  return (
    <View style={styles.container}>
      {/* FILTRES */}
      <View style={styles.filters}>
  {/* Champ de recherche */}
  <View style={{ flex: 1 }}>
    <Input size="md" variant="outline">
      <InputField placeholder="Rechercher..." />
    </Input>
  </View>

  {/* Select */}
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


  {/* Texte "Entreprise" cliquable */}
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


      {/* BOUTON CRÉER UN TICKET */}
      <View style={styles.createButtonWrapper}>
        <Pressable
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <PlusIcon size={16} color="#fff" />
          <Text style={styles.createButtonText}>Créer un ticket</Text>
        </Pressable>
      </View>

      {/* STATS */}
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

      <Modal
  visible={modalVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View style={styles.modalWrapper}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.modalContent}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.modalTitle}>Créer votre ticket</Text>

          <Text style={styles.label}>Titre</Text>
          <TextInput style={styles.input} placeholder="Votre titre" />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Votre description"
            multiline
          />

          <Text style={styles.label}>Projet</Text>
          <TextInput style={styles.input} placeholder="Nom du projet" />

          <Text style={styles.label}>Priorité</Text>
          <RadioGroup
            value={priority}
            onChange={(value) => setPriority(value)}
            style={{ flexDirection: "column", gap: 8, marginTop: 8 }}
          >
            <Radio value="low">
              <RadioIndicator style={{ marginRight: 8 }}>
                <RadioIcon />
              </RadioIndicator>
              <RadioLabel>Faible</RadioLabel>
            </Radio>
            <Radio value="medium">
              <RadioIndicator style={{ marginRight: 8 }}>
                <RadioIcon />
              </RadioIndicator>
              <RadioLabel>Moyenne</RadioLabel>
            </Radio>
            <Radio value="high">
              <RadioIndicator style={{ marginRight: 8 }}>
                <RadioIcon />
              </RadioIndicator>
              <RadioLabel>Haute</RadioLabel>
            </Radio>
          </RadioGroup>

          <Text style={styles.label}>Fichier</Text>
          <TouchableOpacity style={styles.fileButton} onPress={handleFilePick}>
            <Text style={{ color: "#374151", fontSize: 14, fontWeight: "500" }}>
              {selectedFile ? selectedFile.name : "Choisir un fichier"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.submitButtonText}>Créer</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>

<TicketList
  data={ticketsData}
  onPress={(ticket) =>
    router.push({
      pathname: "/TicketDetail",
      params: {
        id: ticket.id,
        title: ticket.title,
        author: ticket.author,
        date: ticket.date,
        priority: ticket.priority,
      },
    })
  }
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  createButtonWrapper: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  createButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
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
  statLabel: {
    color: "#6B7280",
    fontSize: 16,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center", 
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  fileButton: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#000",
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
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
  filterTextActive: {
    backgroundColor: "#E5E7EB",
    color: "#111827",
  },
  
});
