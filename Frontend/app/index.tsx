// app/index.tsx
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native"; 
import Map from "../src/components/Map";
import PinFormModal from "../src/components/PinFormModal";
import PinDetailsModal from "../src/components/PinDetailsModal";
import { Pin } from "../src/types/Pin";
import { fetchPins } from "../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MapPressEvent } from "react-native-maps";
import { useFonts, Nunito_700Bold, Nunito_300Light } from '@expo-google-fonts/nunito'; 

const BLUE_COLOR = '#00A9F4'; 

export default function Page() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_300Light,
  });

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/register"); 
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


  if (!fontsLoaded) return null;

  return (
    <>

      <Stack.Screen options={{ 
        title: "Mapa de Acessibilidade",
        headerTitleAlign: 'center', 
        headerStyle: { 
          backgroundColor: BLUE_COLOR, 
        },
        headerTintColor: '#fff', 
        headerTitleStyle: styles.headerTitle, 
      }} />

      <View style={styles.container}>
        
        <Text style={styles.descriptionText}>
          Veja pontos acessíveis na cidade de Sorocaba.
        </Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>SAIR</Text>
        </TouchableOpacity>

  
        <View style={styles.mapContainer}> 
            <Map
              pins={pins}
              onMapPress={handleMapPress}
              onMarkerPress={(pin) => {
                setSelectedPin(pin);
                setDetailsModalVisible(true);
              }}
            />
        </View>

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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold', 
    fontSize: 20,
  },
  descriptionText: {
    fontFamily: 'Nunito_300Light', 
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  logoutButton: {
    backgroundColor: BLUE_COLOR, 
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center', 
    marginBottom: 10, 
    marginTop: 5, 
  },
  logoutButtonText: {
    color: '#fff', 
    fontFamily: 'Nunito_700Bold', 
    fontSize: 14,
  },
 
  mapContainer: {
    flex: 1,
    borderWidth: 5, 
    borderColor: BLUE_COLOR, 
  }
});