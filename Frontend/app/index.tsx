import { Stack } from "expo-router";
import {
  Text,
  View,
  Platform,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { localStyles, styles } from "./styles";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api/v1"
    : "http://localhost:8080/api/v1";

type Pin = {
  id: number;
  title: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
};

export default function Page() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    latitude: 0,
    longitude: 0,
  });

  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  // Se quiser buscar do backend
  useEffect(() => {
    fetch(`${API_URL}/pins`)
      .then((response) => response.json())
      .then((data) => setPins(data))
      .catch((error) => console.error("Erro ao buscar pins:", error));
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

  const handleMarkerPress = (pin: Pin) => {
    setSelectedPin(pin);
    setDetailsModalVisible(true);
  };

  const handleSave = async () => {
    if (
      !formData.title ||
      !formData.category ||
      !formData.latitude ||
      !formData.longitude
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/pins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Erro ao salvar pin");
      }
      const pinsResponse = await fetch(`${API_URL}/pins`);
      const pinsData = await pinsResponse.json();
      setPins(pinsData);
      setFormModalVisible(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o ponto. Tente novamente.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Mapa de Acessibilidade" }} />

      <View style={styles.container}>
        <Text style={styles.title}>
          Veja pontos acessíveis na cidade de Sorocaba.
        </Text>

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
              coordinate={{
                latitude: pin.latitude,
                longitude: pin.longitude,
              }}
              title={pin.title}
              description={pin.description}
              pinColor={
                pin.category === "Acessivel"
                  ? "green"
                  : pin.category === "Nao Acessivel"
                  ? "red"
                  : "gray"
              }
              onPress={() => handleMarkerPress(pin)}
            />
          ))}
        </MapView>

        {/* Modal de cadastro */}
        <Modal
          visible={formModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setFormModalVisible(false)}
        >
          <View style={localStyles.overlay}>
            <View style={localStyles.modalContent}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Cadastrar novo ponto
              </Text>

              <TextInput
                placeholder="Título"
                style={styles.input}
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
              />

              <TextInput
                placeholder="Categoria (Acessível / Não Acessível)"
                style={styles.input}
                value={formData.category}
                onChangeText={(text) =>
                  setFormData({ ...formData, category: text })
                }
              />

              <TextInput
                placeholder="Descrição"
                style={[styles.input, { height: 80 }]}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
              />

              <Button title="Salvar ponto" onPress={handleSave} />

              <TouchableOpacity
                style={localStyles.cancelButton}
                onPress={() => setFormModalVisible(false)}
              >
                <Text style={{ color: "white" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de detalhes */}
        <Modal
          visible={detailsModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setDetailsModalVisible(false)}
        >
          <View style={localStyles.overlay}>
            <View style={localStyles.modalContent}>
              {selectedPin && (
                <>
                  <Text style={localStyles.detailsTitle}>
                    {selectedPin.title}
                  </Text>
                  <Text style={{ marginBottom: 5 }}>
                    Categoria: {selectedPin.category}
                  </Text>
                  <Text style={{ marginBottom: 10 }}>
                    {selectedPin.description}
                  </Text>

                  <TouchableOpacity
                    style={localStyles.cancelButtonDetails}
                    onPress={() => setDetailsModalVisible(false)}
                  >
                    <Text style={{ color: "white" }}>Fechar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
