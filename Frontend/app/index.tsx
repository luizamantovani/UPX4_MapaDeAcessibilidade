import { Stack } from "expo-router";
import { Alert, Text, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { useState } from "react";
import { styles } from "./styles";

type Pin = {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  color: string;
};

export default function Page() {
  const [pins, setPins] = useState<Pin[]>([]);
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
              pinColor={pin.color}
            />
          ))}
        </MapView>

      </View>
    </>
  );
}


