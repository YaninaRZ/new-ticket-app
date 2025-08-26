import {
  Button,
  ButtonText,
  Center,
  GluestackUIProvider,
  Heading,
  Text,
  VStack
} from "@gluestack-ui/themed";
import axios from "axios";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store"; // 👈 ajout
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

const App = () => {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "135662705560-dij18ofncp8trfsabc3m4p74b88qlpkg.apps.googleusercontent.com",
    androidClientId: "135662705560-gfl6qm7suem5ji83ntmvdtql501c6kvc.apps.googleusercontent.com",
    webClientId: "135662705560-16cbfrutbfrdeqnkga4hm5cn5ia93urv.apps.googleusercontent.com",
  });

  useEffect(() => {
    const fetchGoogleData = async () => {
      if (response?.type === "success") {
        const { authentication } = response;
        console.log("✅ Google Token reçu :", authentication?.accessToken);

        try {
          const backendResponse = await axios.post(
            "https://ticketing.development.atelier.ovh/api/mobile/auth/google-login",
            { access_token: authentication?.accessToken },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          console.log("✅ Backend login success:", backendResponse.data);

          // ✅ Étape 1 : stocker access_token, refresh_token et user
          const { access_token, refresh_token, user } = backendResponse.data;
          await SecureStore.setItemAsync("access_token", access_token);
          await SecureStore.setItemAsync("refresh_token", refresh_token);
          await SecureStore.setItemAsync("user", JSON.stringify(user));

          // Redirection après login
          router.push("/home");
        } catch (err) {
          console.error("❌ Backend error:", err);
        }
      }
    };

    fetchGoogleData();
  }, [response]);

  return (
    <GluestackUIProvider>
      <Center className="flex-1 bg-white px-4 pb-10 justify-center">
        <VStack className="bg-white w-full max-w-[400px] p-8 rounded-2xl border border-gray-200 shadow-md">
          <Heading className="text-2xl text-gray-900 text-center mb-1">
            Log in
          </Heading>
          <Text className="text-sm text-gray-500 text-center mb-6">
            Login to start using Brex
          </Text>

          <Button
            className="w-full bg-black py-3 rounded-lg"
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <ButtonText className="text-white font-semibold text-base text-center">
              Login with Google
            </ButtonText>
          </Button>
        </VStack>
      </Center>
    </GluestackUIProvider>
  );
};

export default App;
