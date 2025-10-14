// src/components/PinDetailsModal.tsx (CORREÇÃO DE ESTRUTURA)

import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Pin } from "../types/Pin";
import { localStyles } from "../styles";

type Props = {
  pin: Pin | null;
  visible: boolean;
  onClose: () => void;
};

export default function PinDetailsModal({ pin, visible, onClose }: Props) {
  if (!pin) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={localStyles.overlay}>
        <View style={localStyles.modalContent}>
          <Text style={localStyles.detailsTitle}>{pin.title}</Text>
          
          {/* 🛑 CORREÇÃO AQUI: Dividindo a linha em 3 componentes Text separados dentro de uma View */}
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
             <Text style={{ fontWeight: 'bold' }}>Categoria:</Text> 
             <Text style={{ marginLeft: 5 }}>{pin.category}</Text> 
          </View>
          
          <Text style={{ marginBottom: 10 }}>{pin.description}</Text>

          <TouchableOpacity style={localStyles.cancelButtonDetails} onPress={onClose}>
            <Text style={{ color: "white" }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
