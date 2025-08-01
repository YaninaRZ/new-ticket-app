import React, { useState } from "react";
import { Stack } from "expo-router";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from "@/components/ui/drawer";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import Header from "@/components/ui/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Text, Pressable, TouchableOpacity } from "react-native";
import { useRouter, usePathname  } from "expo-router";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from "react-native";


export default function RootLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter(); 
  const pathname = usePathname();

  return (
    
    <GluestackUIProvider mode="light">
      <SafeAreaView style={styles.container}>
        <Header onMenuPress={() => setIsDrawerOpen(true)} />

        <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false}} />
        </View>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} size="md" anchor="right">
          <DrawerBackdrop onPress={() => setIsDrawerOpen(false)} />
          <DrawerContent>
            <DrawerHeader style={styles.drawerHeader}>
            <Pressable
                onPress={() => {
                  setIsDrawerOpen(false);
                  router.push("/home");
                }}
              >
                <Image
                  source={require("@/assets/images/Frame.png")}
                  style={{ width: 80, height: 28, resizeMode: "contain" }}
                />
              </Pressable>



              <DrawerCloseButton onPress={() => setIsDrawerOpen(false)}>
                <Text style={styles.drawerClose}>×</Text>
              </DrawerCloseButton>
            </DrawerHeader>

            <DrawerBody style={styles.drawerBody}>
  <View style={styles.navContainer}>
    {/* Tickets */}
    <Pressable
      style={[styles.navItem, pathname === "/home" && styles.navItemActive]}
      onPress={() => {
        setIsDrawerOpen(false);
        router.push("/home");
      }}
    >
      <Text style={[styles.navIcon, pathname === "/home" && styles.navIconActive]}>⚡</Text>
      <Text style={[styles.navText, pathname === "/home" && styles.navTextActive]}>Tickets</Text>
    </Pressable>

    {/* Profil */}
    <Pressable
      style={[styles.navItem, pathname === "/profil" && styles.navItemActive]}
      onPress={() => {
        setIsDrawerOpen(false);
        router.push("/profil");
      }}
    >
      <Text style={[styles.navIcon, pathname === "/profil" && styles.navIconActive]}>⚙️</Text>
      <Text style={[styles.navText, pathname === "/profil" && styles.navTextActive]}>Profil</Text>
    </Pressable>
  </View>
</DrawerBody>


            <DrawerFooter>
              <TouchableOpacity style={styles.logoutButton} onPress={() => setIsDrawerOpen(false)}>
                <Text style={styles.logoutText}>Déconnexion</Text>
              </TouchableOpacity>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  drawerHeader: {
    marginBottom: 32,
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#5A6B7A",
   
  },
  drawerClose: {
    fontSize: 28,
    color: "#5A6B7A",
    fontWeight: "500",
    paddingLeft: 8,
    paddingRight: 8,
  },
  drawerBody: {
  flex: 1,
  paddingHorizontal: 4,
},

item: {
  width: '100%',
  backgroundColor: "#F6F6F6",
  paddingVertical: 14,
  paddingHorizontal: 12,
  borderRadius: 10,
  marginBottom: 12,
},
itemActive: {
  width: '100%',
  backgroundColor: "#E8EDFF",
  paddingVertical: 14,
  paddingHorizontal: 12,
  borderRadius: 10,
  marginBottom: 12,
},

  itemText: {
    fontSize: 16,
    color: "#1F2937",
  },
  itemTextActive: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
  logoutButton: {
    width: '100%', // ← ajoute ceci
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  navContainer: {
    gap: 12,
    marginTop: 8,
  },
  
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  
  navItemActive: {
    backgroundColor: "#E0E7FF",
  },
  
  navIcon: {
    fontSize: 16,
    marginRight: 8,
    color: "#6B7280",
  },
  
  navIconActive: {
    color: "#1F2937",
  },
  
  navText: {
    fontSize: 16,
    color: "#374151",
  },
  
  navTextActive: {
    fontWeight: "600",
    color: "#1F2937",
  },
  
});
