// src/components/PinFormModal.tsx

import React, { useContext } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native'; // 👈 Importa Dimensions
import { Picker } from '@react-native-picker/picker'; 
import { useFonts, Nunito_700Bold, Nunito_600SemiBold, Nunito_300Light } from '@expo-google-fonts/nunito'; 
import { Pin } from '../types/Pin'; 
import { router } from 'expo-router';
import { savePin } from '../services/api';
import { getUser } from '../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormContext } from '../context/FormContext';
import AlertBox from './AlertBox';
import { theme } from '../styles/theme';

// Obtém a largura da tela para calcular a largura do modal
const { width } = Dimensions.get('window');

interface PinFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: (newPins: Pin[]) => void;
  formData: {
    title: string;
    category: string;
    description?: string | null;
    latitude: number;
    longitude: number;
    imageUrl?: string | null;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    category: string;
    description?: string | null;
    latitude: number;
    longitude: number;
    imageUrl?: string | null;
  }>>;
}

// categorias disponíveis para o dropdown
const CATEGORIES = [
  { label: "Acessível", value: "acessivel" },
  { label: "Não acessível", value: "nao_acessivel" },
];

const PinFormModal: React.FC<PinFormModalProps> = ({ visible, onClose, onSaved, formData, setFormData }) => {
  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_600SemiBold,
    Nunito_300Light,
  });

  const formCtx = useContext(FormContext);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  // estado para alert personalizado
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState<string | undefined>(undefined);
  const [alertMessage, setAlertMessage] = React.useState<string | undefined>(undefined);
  const [alertType, setAlertType] = React.useState<'info'|'success'|'error'>('info');

  const showAlert = (title?: string, message?: string, type: 'info'|'success'|'error' = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    // Se for sucesso, resetar o form e fechar o modal pai
    if (alertType === 'success') {
      if (formCtx && formCtx.resetForm) formCtx.resetForm();
      onClose();
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.category) {
      showAlert('Erro', 'Por favor, preencha título e categoria.', 'error');
      return;
    }
    
  // monta o payload esperado pela API
  const payload = {
    title: formData.title,
    category: formData.category,
  description: formData.description ?? null,
    latitude: formData.latitude,
    longitude: formData.longitude,
    imageUrl: formData.imageUrl || formCtx.formData.imageUrl || null,
    userId: null,
  };

  // tenta salvar no backend e atualizar o parent com os pins retornados
  (async () => {
    try {
      const user = await getUser();
      console.debug('Supabase current user:', user);
      payload.userId = (user && (user as any).id) || null;
    } catch (e) {
      console.warn('Could not get current user for userId', e);
    }

    if (!payload.userId) {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          payload.userId = parsed.id || parsed.userId || parsed.sub || null;
        }
      } catch (e) {
        console.warn('Could not read stored user from AsyncStorage for userId', e);
      }
    }
    // tenta salvar no backend e atualizar o parent com os pins retornados
    try {
  console.debug('Saving pin payload:', payload);
  const pinsFromServer = await savePin(payload as any);
  onSaved(pinsFromServer);
  showAlert('Sucesso', 'Ponto de acessibilidade salvo!', 'success');
    } catch (err) {
      console.error('Erro ao salvar pin:', err);
      showAlert('Erro', 'Não foi possível salvar o ponto. Tente novamente.', 'error');
    }
  })();
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
              {CATEGORIES.map((category) => (
                <Picker.Item
                  key={category.value}
                  label={category.label}
                  value={category.value}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>
          
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            value={formData.description ?? ''}
            multiline
            numberOfLines={4}
          />

          {(formData.imageUrl || formCtx.formData.imageUrl) ? (
            <View style={styles.previewWrapper}>
              <Image
                source={{ uri: formData.imageUrl || formCtx.formData.imageUrl! }}
                style={styles.previewImage}
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
              {isImageLoading && (
                <View style={styles.previewOverlay}>
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              )}
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              // salva no contexto antes de navegar para que os dados sejam preservados
              formCtx.setFormData({
                title: formData.title,
                category: formData.category,
                description: formData.description ?? '',
                latitude: formData.latitude,
                longitude: formData.longitude,
              });
              // cast para 'any' para contornar tipos gerados do expo-router
              router.push('/Camera' as any);
            }}
          >
            <Text style={styles.cameraButtonText}>TIRAR FOTO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SALVAR PONTO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AlertBox
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={handleAlertClose}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.overlay,
  },
  modalView: {
    margin: 20,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
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
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontFamily: theme.fonts.semibold,
    fontSize: theme.fontSizes.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  labelBold: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    fontFamily: theme.fonts.semibold,
    marginBottom: theme.spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  // 🚀 ESTILO DO PICKER (principalmente para Android, pode ter efeito no texto)
  picker: {
    fontFamily: theme.fonts.semibold as any, // Tenta aplicar a fonte aqui
    height: 50,
  },
  // 🚀 ESTILO DO ITEM DO PICKER (específico para iOS, mas boa prática)
  pickerItem: {
    fontFamily: theme.fonts.semibold as any, // Aplica a fonte de subtítulo aos itens
    fontSize: theme.fontSizes.md, // Define um tamanho de fonte para os itens
    color: theme.colors.text, // Cor do texto dos itens
  },
  cameraButton: {
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  cameraButtonText: {
    color: 'white',
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.lg,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.lg,
  },
  cancelButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  cancelButtonText: {
    color: 'white',
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.lg,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.md,
  },
  previewWrapper: {
    width: '100%',
    height: 180,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.md,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

export default PinFormModal;