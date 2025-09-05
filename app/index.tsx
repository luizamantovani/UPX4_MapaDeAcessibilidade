import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function App() {
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
      >
        <Marker
          coordinate={{ latitude: -23.5015, longitude: -47.4526 }}
          title="Sorocaba"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  description: { fontSize: 14, textAlign: "center", marginBottom: 16 },
  map: { flex: 1 },
});