import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

export default function App() {
  // Estado inicial com um pin em Sorocaba
  const [pins, setPins] = useState([
    {
      id: 1,
      latitude: -23.5015,
      longitude: -47.4526,
      title: "Sorocaba",
      color: "red",
    },
  ]);

  // Função para adicionar um novo pin ao clicar no mapa
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
                    id: Date.now(),
                    latitude,
                    longitude,
                    title: "Ponto Acessível",
                    color: "green",
                  };
                  setPins([...pins, novoPin]);
                },
              },
              {
                text: "Não é acessível",
                onPress: () => {
                  const novoPin = {
                    id: Date.now(),
                    latitude,
                    longitude,
                    title: "Ponto Não Acessível",
                    color: "red",
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
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de Acessibilidade - Sorocaba</Text>
      <Text style={styles.description}>
        Veja pontos acessíveis na cidade de Sorocaba.
      </Text>
      <MapView
        style={styles.map}
        initialCamera={{
          center: {
            latitude: -23.5015,
            longitude: -47.4526,
          },
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
            pinColor={pin.color} // cor única para cada pin
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: { fontSize: 14, textAlign: "center", marginBottom: 16 },
  map: { flex: 1 },
});
