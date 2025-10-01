import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { savePin } from "../services/api";
import { Pin } from "../types/Pin";
// Update the import path below if your styles file is located elsewhere, e.g. "../styles/styles"
import { localStyles, styles } from "../styles";
type PinFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSaved: (pins: Pin[]) => void;
  formData: {
    title: string;
    category: string;
    description: string;
    latitude: number;
    longitude: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export default function PinFormModal({ visible, onClose, onSaved, formData, setFormData }: PinFormModalProps) {

  const [items] = useState([
    { label: "Acessível", value: "acessivel" },
    { label: "Não acessível", value: "nao_acessivel" },
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  async function handleSave() {
    if (!formData.title || !formData.category) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      const pins = await savePin(formData);
      onSaved(pins);
      setFormData({ title: "", category: "", description: "", latitude: 0, longitude: 0 });
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o ponto. Tente novamente.");
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={localStyles.overlay}>
        <View style={localStyles.modalContent}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Cadastrar novo ponto</Text>

          <TextInput
            placeholder="Título"
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />

          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const selectedValue = callback(value);
              setValue(selectedValue);
              setFormData({ ...formData, category: selectedValue || "" });
            }}
            placeholder="Selecione a Categoria"
            style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 20 }}
            dropDownContainerStyle={{ borderWidth: 1, borderColor: "#ccc" }}
          />

          <TextInput
            placeholder="Descrição"
            style={[styles.input, { height: 80 }]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
          />

          <Button title="Salvar ponto" onPress={handleSave} />

          <TouchableOpacity style={localStyles.cancelButton} onPress={onClose}>
            <Text style={{ color: "white" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
