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
          <Text style={{ marginBottom: 5 }}>Categoria: {pin.category}</Text>
          <Text style={{ marginBottom: 10 }}>{pin.description}</Text>

          <TouchableOpacity style={localStyles.cancelButtonDetails} onPress={onClose}>
            <Text style={{ color: "white" }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
