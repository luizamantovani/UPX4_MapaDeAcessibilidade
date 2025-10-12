// src/components/PinFormModal.tsx

import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native'; // 👈 Importa Dimensions
import { Picker } from '@react-native-picker/picker'; 
import { useFonts, Nunito_700Bold, Nunito_600SemiBold, Nunito_300Light } from '@expo-google-fonts/nunito'; 
import { Pin } from '../types/Pin'; 

// Obtém a largura da tela para calcular a largura do modal
const { width } = Dimensions.get('window');

interface PinFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: (newPins: Pin[]) => void;
  formData: {
    title: string;
    category: string;
    description: string;
    latitude: number;
    longitude: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    category: string;
    description: string;
    latitude: number;
    longitude: number;
  }>>;
}

const CATEGORIES = ["Rampa", "Banheiro Acessível", "Elevador", "Vaga Especial"]; 

const PinFormModal: React.FC<PinFormModalProps> = ({ visible, onClose, onSaved, formData, setFormData }) => {
  
  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_600SemiBold,
    Nunito_300Light,
  });

  const handleSave = () => {
    if (!formData.title || !formData.category || !formData.description) {
        Alert.alert("Erro", "Por favor, preencha todos os campos.");
        return;
    }
    
    const newPin: Pin = {
        id: Math.floor(Math.random() * 100000), 
        ...formData, 
    };
    
    Alert.alert("Sucesso", "Ponto de acessibilidade salvo!");
    onClose(); 
  };

  if (!fontsLoaded) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}> {/* 🚀 AQUI VAI A LARGURA AJUSTADA */}
          
          <Text style={styles.modalTitle}>Cadastrar novo ponto</Text>
          
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            value={formData.title}
          />

          <Text style={styles.labelBold}>Selecione a Categoria</Text> 
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(itemValue) => setFormData({ ...formData, category: itemValue })}
              // O estilo para a fonte no Picker é mais complexo, aplicando no container e item
              style={styles.picker} 
              itemStyle={styles.pickerItem} // 👈 Adiciona itemStyle para iOS
            >
              <Picker.Item label="Selecione" value="" style={styles.pickerItem} />
              {CATEGORIES.map(category => (
                <Picker.Item key={category} label={category} value={category} style={styles.pickerItem} />
              ))}
            </Picker>
          </View>
          
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            value={formData.description}
            multiline
            numberOfLines={4}
          />
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SALVAR PONTO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // 🚀 AUMENTA A LARGURA DO MODAL
    width: width * 0.9, // 90% da largura da tela. Ajuste este valor (ex: 0.85 para 85%)
    // minWidth: 300, // Opcional: Garante uma largura mínima
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold', 
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Nunito_600SemiBold', 
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  labelBold: {
    fontFamily: 'Nunito_700Bold', 
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  // 🚀 ESTILO DO PICKER (principalmente para Android, pode ter efeito no texto)
  picker: {
    fontFamily: 'Nunito_600SemiBold', // Tenta aplicar a fonte aqui
    height: 50,
  },
  // 🚀 ESTILO DO ITEM DO PICKER (específico para iOS, mas boa prática)
  pickerItem: {
    fontFamily: 'Nunito_600SemiBold', // Aplica a fonte de subtítulo aos itens
    fontSize: 14, // Define um tamanho de fonte para os itens
    color: '#333', // Cor do texto dos itens
  },
  saveButton: {
    backgroundColor: '#00A9F4',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
});

export default PinFormModal;