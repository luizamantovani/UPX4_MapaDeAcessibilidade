import React, { useState } from "react"; //importa o useState
import { StyleSheet, Text, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps"; //cloca o evento click no mapa

export default function App() {
  //Estado inicial com um pin em Sorocaba
  const [pins, setPins] = useState([
    {
      id: 1,
      latitude: -23.5015,
      longitude: -47.4526,
      title: "Sorocaba",
    },
  ]);
  //Função para adicionar um novo pin ao clicar no mapa
  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const novoPin = {
      id: Date.now(),//Gera um id único baseado no timestamp
      latitude,// Coordenadas do clique
      longitude,//Coordenadas do clique
      title: "Novo Ponto",//Título padrão para o novo pin
    };
    setPins([...pins, novoPin]);//Adiciona o novo pin ao estado
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
        onPress={handleMapPress} //Adiciona o evento de clique no mapa
      >
        {pins.map((pin) => (//Renderiza todos os pins no mapa
          <Marker
            key={pin.id}//Chave única para cada pin
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            title={pin.title}
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
