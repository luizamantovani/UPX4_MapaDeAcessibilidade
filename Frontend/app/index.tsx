// app/index.tsx
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react"; 
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions 
} from "react-native"; 
import Map from "../src/components/Map";
import PinFormModal from "../src/components/PinFormModal";
import PinDetailsModal from "../src/components/PinDetailsModal";
import SettingsModal from "../src/components/SettingsModal"; 
import { Pin } from "../src/types/Pin";
import { fetchPins } from "../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MapPressEvent } from "react-native-maps";
import * as Location from 'expo-location';
import { useFonts, Nunito_700Bold, Nunito_300Light } from '@expo-google-fonts/nunito'; 

const { width } = Dimensions.get('window');

// 🚀 Cores e Importação de Imagens
const BLUE_COLOR = '#00A9F4'; // Cor azul principal
const pinEsq = require('../assets/images/pin_esq.png'); 
const passosCentro = require('../assets/images/centro_passos_ofc.png'); 
const engrenagemDir = require('../assets/images/engrenagem_dir.png');


export default function Page() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_300Light,
  });
  
  const [settingsModalVisible, setSettingsModalVisible] = useState(false); 
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/register"); 
  };
  
  const handlePinEsqPress = () => {
    console.log("Botão Pin Esquerda Pressionado: Mostrar Pins Salvos");
  };

  const handlePassosCentroPress = () => {
    console.log("Botão Passos Centro Pressionado: Iniciar Ação Principal");
  };

  const handleEngrenagemDirPress = () => {
    setSettingsModalVisible(true);
    console.log("Botão Engrenagem Direita Pressionado: Abrir Configurações");
  };

  const [, setLocation] = useState<Location.LocationObject | null>(null);
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
    ( async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (e) {
        console.error('Error getting location:', e);
      }
    })();

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
        headerRight: () => null, 
      }} />
      <View style={styles.container}>
        
        {/* REINCLUSÃO: O texto da descrição, que pode ser a causa do erro se a string for renderizada em outro lugar. */}
        {/* Se o erro persistir, você DEVE verificar seus componentes modais. */}
        <Text style={styles.descriptionText}>
          Veja pontos acessíveis na cidade de Sorocaba.
        </Text>
  
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
        
        {/* BARRA DE NAVEGAÇÃO */}
        <View style={styles.navBarContainer}>
            <View style={styles.navBar}>
                {/* Botão Esquerda: pin_esq */}
                <TouchableOpacity style={styles.navButton} onPress={handlePinEsqPress}>
                    <Image source={pinEsq} style={styles.iconStyle} /> 
                </TouchableOpacity>
                
                {/* Botão Central: centro_passos_ofc (Maior e Elevado) */}
                <TouchableOpacity style={styles.centerButton} onPress={handlePassosCentroPress}>
                    <Image source={passosCentro} style={styles.centerIconStyle} />
                </TouchableOpacity>
                
                {/* Botão Direita: engrenagem_dir (Abre o modal de configurações) */}
                <TouchableOpacity style={styles.navButton} onPress={handleEngrenagemDirPress}>
                    <Image source={engrenagemDir} style={styles.iconStyle} />
                </TouchableOpacity>
            </View>
        </View>
        {/* FIM DA BARRA DE NAVEGAÇÃO */}

        {/* MODAIS */}
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
        <SettingsModal
          visible={settingsModalVisible}
          onClose={() => setSettingsModalVisible(false)}
          onLogout={handleLogout} 
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
  mapContainer: {
    flex: 1,
    borderWidth: 5, 
    borderColor: BLUE_COLOR, 
  },
  
  // --- ESTILOS DA BARRA DE NAVEGAÇÃO ---
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 75, 
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70, 
    backgroundColor: BLUE_COLOR, 
    borderTopWidth: 5, 
    borderTopColor: BLUE_COLOR, 
    paddingHorizontal: 10,
  },
  
  // Botões laterais (Pin e Engrenagem)
  navButton: {
    backgroundColor: 'transparent', 
    width: 55, 
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Ícones laterais (Pin e Engrenagem)
  iconStyle: {
    // Aumentei o tamanho aqui para garantir que pareçam maiores, como na imagem.
    width: 35, 
    height: 35,
    resizeMode: 'contain',
    tintColor: '#fff', // Ícone BRANCO
    marginBottom: 0, 
  },
  
  // Botão Central (Passos)
  centerButton: {
    backgroundColor: '#fff', // Fundo BRANCO
    borderRadius: 50, 
    width: 75, // Ajustado para ser maior
    height: 75, // Ajustado para ser maior
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, 
    borderWidth: 5, 
    borderColor: BLUE_COLOR, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  // Ícone central (Passos)
  centerIconStyle: {
    width: 45, 
    height: 45,
    resizeMode: 'contain',
    tintColor: '#000', // Ícone PRETO
  }
});