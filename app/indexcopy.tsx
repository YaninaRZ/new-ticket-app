// import api from "@/services/api";
// import { Button, ButtonText } from "@gluestack-ui/themed";
// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     isErrorWithCode,
//     isNoSavedCredentialFoundResponse,
//     isSuccessResponse,
//     statusCodes,
// } from "@react-native-google-signin/google-signin";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Alert, Linking, ScrollView, Text, View } from "react-native";

// // ⚠️ Remplace par TON Client Web (OAuth "Application Web")
// const WEB_CLIENT_ID = "135662705560-16cbfrutbfrdeqnkga4hm5cn5ia93urv.apps.googleusercontent.com";

// // URL de votre API
// const API_BASE_URL = "https://votre-api.com"; // Remplace par l'URL de ton API

// export default function App() {
//   const [userInfo, setUserInfo] = useState<any>(null);
//   const [apiUser, setApiUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId: WEB_CLIENT_ID,
//       iosClientId: "135662705560-dij18ofncp8trfsabc3m4p74b88qlpkg.apps.googleusercontent.com"
//     });
//   }, []);

//   const authenticateWithBackend = async (code: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(`${API_BASE_URL}/auth/google`, {
//         code: code,
//         state: "random-state-string" // Tu peux générer un state unique si nécessaire
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       // Stocke les informations de l'utilisateur retournées par ton API
//       setApiUser(response.data);
//       Alert.alert("Succès", "Authentification réussie avec l'API");
      
//       return response.data;
//     } catch (error: any) {
//       console.error("Erreur API:", error);
//       Alert.alert(
//         "Erreur d'authentification", 
//         error.response?.data?.message || "Erreur lors de la connexion à l'API"
//       );
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const response = await GoogleSignin.signIn();
      
//       if (isSuccessResponse(response)) {
//         setUserInfo(response.data);
        
//         // Récupère le code d'autorisation pour l'envoyer à ton API
//         const { serverAuthCode } = response.data;
        
//         if (serverAuthCode) {
//           // Envoie le code à ton backend
//           await authenticateWithBackend(serverAuthCode);
//         } else {
//           Alert.alert("Erreur", "Aucun code d'autorisation reçu de Google");
//         }
//       } else {
//         // L'utilisateur a annulé
//         Alert.alert("Annulé", "Connexion annulée par l'utilisateur");
//       }
//     } catch (error: unknown) {
//       if (isErrorWithCode(error)) {
//         switch (error.code) {
//           case statusCodes.IN_PROGRESS:
//             Alert.alert("Connexion déjà en cours…");
//             break;
//           default:
//             Alert.alert("Erreur Google Sign-In", error.code);
//         }
//       } else {
//         Alert.alert("Erreur inattendue", String(error));
//       }
//     }
//   };

//   const handleGoogleSignOut = async () => {
//     try {
//       await GoogleSignin.signOut();
//       setUserInfo(null);
//       setApiUser(null);
//     } catch (e) {
//       Alert.alert("Erreur", "Échec de la déconnexion");
//     }
//   };

//   const getCurrentUser = async () => {
//     try {
//       const response = await GoogleSignin.signInSilently();
//       if (isSuccessResponse(response)) {
//         setUserInfo(response.data);
//       } else if (isNoSavedCredentialFoundResponse(response)) {
//         Alert.alert("Aucun utilisateur", "Aucun identifiant enregistré.");
//       }
//     } catch {
//       Alert.alert("Erreur", "Impossible de récupérer l'utilisateur courant.");
//     }
//   };

//   const getGoogelUrl = async ()=>{
//     console.log('tot')
//     try {
//       const { data } = await api.get("/auth/google/url")
//       console.log('data',data)
//       await Linking.openURL(data.auth_url)
//     } catch (error) {
//       console.log('error', error)
//     }
//     // redirect to the url
//   }

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
//       {userInfo ? (
//         <ScrollView style={{ gap: 12, maxWidth: 320 }}>
//           <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Informations Google:</Text>
//           <Text selectable>{JSON.stringify(userInfo.user, null, 2)}</Text>
          
//           {apiUser && (
//             <>
//               <Text style={{ fontWeight: "bold", marginTop: 16, marginBottom: 8 }}>
//                 Informations API:
//               </Text>
//               <Text selectable>{JSON.stringify(apiUser, null, 2)}</Text>
//             </>
//           )}

//           <Button onPress={handleGoogleSignOut} disabled={loading}>
//             <ButtonText>Sign Out</ButtonText>
//           </Button>

//           <Button onPress={getCurrentUser} disabled={loading}>
//             <ButtonText>Get current user</ButtonText>
//           </Button>
//         </ScrollView>
//       ) : (
// <>
//         <Button onPress={getGoogelUrl} disabled={loading}>
//         <ButtonText>Get google url</ButtonText>
//       </Button>


//         <GoogleSigninButton
//           style={{ width: 220, height: 48 }}
//           size={GoogleSigninButton.Size.Wide}
//           color={GoogleSigninButton.Color.Dark}
//           onPress={handleGoogleSignIn}
//           disabled={loading}
//         />

// </>
//       )}
      
//       {loading && <Text>Connexion en cours...</Text>}
//     </View>
//   );
// }

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