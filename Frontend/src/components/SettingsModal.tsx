// src/components/SettingsModal.tsx

import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Nunito_700Bold } from '@expo-google-fonts/nunito'; 

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose, onLogout }) => {
  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          
          <Text style={styles.modalTitle}>Opções</Text>

          {/* Botão SAIR */}
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutButtonText}>SAIR</Text>
          </TouchableOpacity>
          
          {/* Botão FECHAR Modal */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>FECHAR</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end", 
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },
  modalView: {
    width: '100%',
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF3B30', 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
  },
  logoutButtonText: {
    color: '#fff', 
    fontFamily: 'Nunito_700Bold', 
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#f0f0f0', 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  closeButtonText: {
    color: '#333', 
    fontFamily: 'Nunito_700Bold', 
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SettingsModal; // <--- ESTA LINHA É ESSENCIAL