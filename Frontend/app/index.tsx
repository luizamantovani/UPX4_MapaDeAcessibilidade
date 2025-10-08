import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import Map from "../src/components/Map";
import PinFormModal from "../src/components/PinFormModal";
import PinDetailsModal from "../src/components/PinDetailsModal";
import { Pin } from "../src/types/Pin";
import { fetchPins } from "../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MapPressEvent } from "react-native-maps";
export default function Page() {
  const router = useRouter();

const handleLogout = async () => {
  await AsyncStorage.removeItem("user");
  router.replace("/register"); // volta para a tela de cadastro
};
  const [pins, setPins] = useState<Pin[]>([]);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    fetchPins().then(setPins).catch(console.error);
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setFormData({
      title: "",
      category: "",
      description: "",
      latitude,
      longitude,
    });
    setFormModalVisible(true);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Mapa de Acessibilidade" }} />

      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", marginVertical: 10 }}>
          Veja pontos acessíveis na cidade de Sorocaba.
          <Button title="Sair" onPress={handleLogout} />
        </Text>

        <Map
          pins={pins}
          onMapPress={handleMapPress}
          onMarkerPress={setSelectedPin}
        />

        <PinFormModal
          visible={formModalVisible}
          onClose={() => setFormModalVisible(false)}
          onSaved={(newPins) => {
            setPins(newPins);
            setFormModalVisible(false);
          }}
          formData={formData}
          setFormData={setFormData}
        />

        <PinDetailsModal
          pin={selectedPin}
          visible={detailsModalVisible}
          onClose={() => setDetailsModalVisible(false)}
        />
        
      </View>
    </>
  );
}
