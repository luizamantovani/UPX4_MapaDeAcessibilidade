// app/index.tsx
import { Stack } from "expo-router";
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
import { Pin } from "../src/types/Pin";
import { fetchPins } from "../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MapPressEvent } from "react-native-maps";
import { useFonts, Nunito_700Bold, Nunito_300Light } from '@expo-google-fonts/nunito'; 

const { width } = Dimensions.get('window');

// 🚀 Cores e Importação de Imagens (Caminho e nome corrigidos)
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
    console.log("Botão Engrenagem Direita Pressionado: Abrir Configurações");
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
                
                {/* Botão Direita: engrenagem_dir */}
                <TouchableOpacity style={styles.navButton} onPress={handleEngrenagemDirPress}>
                    <Image source={engrenagemDir} style={styles.iconStyle} />
                </TouchableOpacity>
            </View>
        </View>
        {/* FIM DA BARRA DE NAVEGAÇÃO */}

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
  
  // Botões laterais (Pin e Engrenagem) - SEM BOLAS BRANCAS
  navButton: {
    backgroundColor: 'transparent', 
    width: 55, 
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Ícones laterais (Pin e Engrenagem)
  iconStyle: {
    width: 30, // Reduzido de 70 para 30
    height: 30, // Reduzido de 70 para 30
    resizeMode: 'contain',
    tintColor: '#fff', // Ícone BRANCO
    marginBottom: 0, // Removido o marginBottom extra
  },
  
  // Botão Central (Passos)
  centerButton: {
    backgroundColor: '#fff', // Fundo BRANCO
    borderRadius: 50, 
    width: 70, // Reduzido de 80 para 70
    height: 70, // Reduzido de 80 para 70
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, // Ajustado de -40 para -30 (para corresponder ao 70px)
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
    width: 40, // Reduzido de 60 para 40
    height: 40, // Reduzido de 60 para 40
    resizeMode: 'contain',
    tintColor: '#000', // Ícone PRETO
  }
});