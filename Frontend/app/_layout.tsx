import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

import {
  useFonts,
  NunitoSans_300Light_Italic,
  NunitoSans_400Regular_Italic,
} from "@expo-google-fonts/nunito-sans";
import { Nunito_300Light } from "@expo-google-fonts/nunito";

export default function Layout() {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  const [fontsLoaded] = useFonts({
    NunitoSans_300Light_Italic,
    NunitoSans_400Regular_Italic,
    Nunito_300Light,
  });

  useEffect(() => {
    const checkRegistration = async () => {
      const user = await AsyncStorage.getItem("user");
      setIsRegistered(!!user);
    };
    checkRegistration();
  }, []);

  if (!fontsLoaded || isRegistered === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

   return (
    <Stack initialRouteName={isRegistered ? "index" : "register"}>
      <Stack.Screen name="index" options={{ title: "Mapa" }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}