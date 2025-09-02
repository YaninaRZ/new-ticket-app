import { Button, ButtonText } from "@gluestack-ui/themed";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

// ⚠️ Remplace par TON Client Web (OAuth "Application Web")
const WEB_CLIENT_ID =
  "135662705560-16cbfrutbfrdeqnkga4hm5cn5ia93urv.apps.googleusercontent.com";

export default function App() {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      iosClientId: "135662705560-dij18ofncp8trfsabc3m4p74b88qlpkg.apps.googleusercontent.com"
      // NE PAS mettre iosClientId si tu as déjà iosUrlScheme via le plugin Expo
      // scopes: ["openid", "profile", "email"], // par défaut OK
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      // iOS: pas besoin de hasPlayServices()
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUserInfo(response.data); // contient .user et .idToken si webClientId
      } else {
        // L’utilisateur a annulé
      }
    } catch (error: unknown) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Connexion déjà en cours…");
            break;
          default:
            Alert.alert("Erreur Google Sign-In", error.code);
        }
      } else {
        Alert.alert("Erreur inattendue", String(error));
      }
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
    } catch (e) {
      Alert.alert("Erreur", "Échec de la déconnexion");
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await GoogleSignin.signInSilently();
      if (isSuccessResponse(response)) {
        setUserInfo(response.data);
      } else if (isNoSavedCredentialFoundResponse(response)) {
        Alert.alert("Aucun utilisateur", "Aucun identifiant enregistré.");
      }
    } catch {
      Alert.alert("Erreur", "Impossible de récupérer l’utilisateur courant.");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
      {userInfo ? (
        <ScrollView style={{ gap: 12, maxWidth: 320 }}>
          <Text selectable>{JSON.stringify(userInfo, null, 2)}</Text>

          <Button onPress={handleGoogleSignOut}>
            <ButtonText>Sign Out</ButtonText>
          </Button>

          <Button onPress={getCurrentUser}>
            <ButtonText>Get current user</ButtonText>
          </Button>
        </ScrollView>
      ) : (
        <GoogleSigninButton
          style={{ width: 220, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
        />
      )}
    </View>
  );
}