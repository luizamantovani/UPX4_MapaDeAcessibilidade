// src/components/PinDetailsModal.tsx (CORREÇÃO DE ESTRUTURA)

import React from "react";
import { Modal, View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { Pin } from "../types/Pin";
import { localStyles } from "../styles";

type Props = {
  pin: Pin | null;
  visible: boolean;
  onClose: () => void;
};

export default function PinDetailsModal({ pin, visible, onClose }: Props) {
  if (!pin) return null;
  const [isImageLoading, setIsImageLoading] = React.useState(false);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={localStyles.overlay}>
        <View style={localStyles.modalContent}>
          <Text style={localStyles.detailsTitle}>{pin.title}</Text>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
             <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Categoria:</Text>
             <Text style={{ marginLeft: 5, marginBottom: 10, fontSize: 16 }}>
               {pin.category === 'acessivel' ? 'Acessível' : 'Não Acessível'}
             </Text> 
          </View>

          <Text style={{ marginBottom: 10, fontSize: 16 }}>{pin.description}</Text>
         
          {pin.imageUrl && (
            <View style={detailStyles.previewWrapper}>
              <Image
                source={{ uri: pin.imageUrl }}
                style={detailStyles.previewImage}
                resizeMode="cover"
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
              {isImageLoading && (
                <View style={detailStyles.previewOverlay}>
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={localStyles.cancelButtonDetails} onPress={onClose}>
            <Text style={{ color: "white" }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const detailStyles = StyleSheet.create({
  previewWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
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
