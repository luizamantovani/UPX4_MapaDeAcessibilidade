import { Stack } from "expo-router";
import { Alert, Text, View , Platform } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { styles } from "./styles";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api/v1" // Android Emulator
    : "http://localhost:8080/api/v1"; // iOS Simulator

// se rodar no celular físico, substitui por seu IP local, ex: "http://192.168.0.15:8080/api/v1"


type Pin = {
  id: number;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
};

export default function Page() {
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
  fetch(`${API_URL}/pins`)
    .then((response) => response.json())
    .then((data) => setPins(data))
    .catch((error) => console.error("Erro ao buscar pins:", error));
}, []);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    Alert.alert(
      "Adicionar Pin",
      "Deseja adicionar um novo ponto aqui?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Adicionar",
          onPress: () => {
            Alert.alert(
              "Confirme",
              "Este ponto é acessível?",
              [
                {
                  text: "É acessível",
                  onPress: () => {
                    const novoPin = {
                      id: Date.now(), // Usando timestamp como ID temporário, idealmente o ID viria do backend(banco de dados)
                      title: "Ponto Acessível",
                      category: "Acessivel",
                      latitude,
                      longitude,
                    };
                    setPins([...pins, novoPin]);
                  },
                },
                {
                  text: "Não é acessível",
                  onPress: () => {
                    const novoPin = {
                      id: Date.now(),     // Usando timestamp como ID temporário, idealmente o ID viria do backend(banco de dados)
                      title: "Ponto Não Acessível",
                      category: "Nao Acessivel",
                      latitude,
                      longitude,
                    };
                    setPins([...pins, novoPin]);
                  },
                  style: "destructive",
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Mapa de Acessibilidade" }} />

      <View style={styles.container}>
        <Text style={styles.title}>Veja pontos acessíveis na cidade de Sorocaba.</Text>

        <MapView
          style={styles.map}
          initialCamera={{
            center: { latitude: -23.5015, longitude: -47.4526 },
            zoom: 12,
            heading: 0,
            pitch: 0,
          }}
          onPress={handleMapPress}
        >
            {pins.map((pin) => (
              <Marker
                key={pin.id}
                coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                title={pin.title}
                pinColor={
                  pin.category === "Acessivel"
                    ? "green"
                    : pin.category === "Nao Acessivel"
                    ? "red"
                    : pin.category === "Parcialmente Acessivel"
                    ? "blue"
                    : "gray"
                }
              />
            ))}
        </MapView>

      </View>
    </>
  );
}