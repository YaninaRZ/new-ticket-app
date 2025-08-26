import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email?: string;
  company?: string;
  admin?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await SecureStore.getItemAsync("user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (e) {
        console.error("❌ Erreur récupération user :", e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
}
