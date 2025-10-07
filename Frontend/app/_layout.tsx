// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRegistration = async () => {
      const user = await AsyncStorage.getItem("user");
      setIsRegistered(!!user); // se tem user salvo → cadastrado
    };
    checkRegistration();
  }, []);

  if (isRegistered === null) {
    // Enquanto carrega, mostra um loading
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack initialRouteName={isRegistered ? "index" : "register"}>
      <Stack.Screen name="index" options={{ title: "Mapa" }} />
      <Stack.Screen name="register" options={{ title: "Cadastro" }} />
    </Stack>
  );
}
