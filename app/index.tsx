import api from "@/services/api";
import { Button, ButtonText } from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { Linking, View } from "react-native";

export default function App() {
  const [loading, setLoading] = useState(false);

  const handleDeepLink = (event) => {
    const url = event.url;
    console.log("Redirect URL:", url);

    const params = new URLSearchParams(url.split("?")[1]);
    const code = params.get("code");
    const state = params.get("state");

    if (code) {
      console.log("Code:", code);
      console.log("State:", state);
      // Ici tu peux appeler ton backend pour échanger le code contre un token
    }
  };

  useEffect(() => {
    // Pour les liens ouverts pendant que l'app est en background
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Écoute les redirections actives
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => subscription.remove();
  }, []);

  const getGoogleUrl = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/google/url");
      await Linking.openURL(data.auth_url);
    } catch (error) {
      console.log("error", error);
      Alert.alert("Erreur", "Impossible d'ouvrir l'URL Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
      <Button onPress={getGoogleUrl} disabled={loading}>
        <ButtonText>{loading ? "Chargement..." : "Se connecter avec Google"}</ButtonText>
      </Button>
    </View>
  );
}