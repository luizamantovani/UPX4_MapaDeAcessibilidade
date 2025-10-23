import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Alert,
  ActivityIndicator,
  Button,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { uploadImage, getUser, getPublicUrl } from "../src/utils/supabase";
import { useContext } from "react";
import { FormContext } from "../src/context/FormContext";
import { router } from 'expo-router';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);
  const [image, setImage] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const formCtx = useContext(FormContext);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
        console.log("Taking photo...");
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.5,
                skipProcessing: true,
                shutterSound: false,
            });
            console.log("Photo taken:", photo.uri);
            return photo;
        } catch (error) {
            console.error("Error taking photo:", error);
        }
    }
  };

  // Gera um UUID simples (sem dependências externas)
  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16);
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleTakePress = async () => {
    const response = await takePhoto();
    if (response?.uri) {
      setImage(response.uri);
      setPreviewVisible(true);
    }
  };

  const handleSend = async () => {
    if (!image) return;
    try {
      setUploading(true);
      // tentar obter userId, caso exista
      let userId = 'anon';
      try {
        const user = await getUser();
        userId = (user && (user as any).id) || 'anon';
      } catch (e) {
        // não bloquear o upload se não conseguir user
        console.warn('Não foi possível obter userId:', e);
      }
      const filename = `pins/${userId}-${uuidv4()}.jpg`;
      const uploadRes = await uploadImage({ fileUri: image, bucket: 'images', path: filename });

      // obter URL pública (getPublicUrl utiliza o cliente supabase)
      const publicUrl = getPublicUrl('images', filename);

      // salva no contexto do formulário para o PinFormModal ler
      if (formCtx && formCtx.setFormData) {
        formCtx.setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
      }

      setUploading(false);
      setPreviewVisible(false);
      setImage(null);
      Alert.alert('Sucesso', 'Imagem enviada.');

      // volta para o formulário (navegação)
      router.back();
    } catch (err: any) {
      console.error('Erro upload:', err);
      setUploading(false);
      Alert.alert('Erro', err?.message || 'Falha ao enviar imagem');
    }
  };

  const handleRepeat = () => {
    // Limpa a imagem e fecha o preview para forçar nova captura
    setImage(null);
    setPreviewVisible(false);
  };

  const handleCancel = () => {
    setPreviewVisible(false);
    setImage(null);
  };

  const renderPreviewModal = () => (
    <Modal
      visible={previewVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setPreviewVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <Text>Nenhuma imagem</Text>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#4caf50' }]}
              onPress={handleSend}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.text}>Enviar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#2196f3' }]}
              onPress={handleRepeat}
            >
              <Text style={styles.text}>Repetir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#f44336' }]}
              onPress={handleCancel}
            >
              <Text style={styles.text}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.text}>Virar Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} onPress={handleTakePress}>
          <Text style={styles.text}>Tirar foto</Text>
        </TouchableOpacity>
      </View>
      {renderPreviewModal()}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffffff",
    opacity: 0.8,
    overflow: "hidden", // garante que as bordas arredondadas cortem o conteúdo interno
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    overflow: "hidden",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
    paddingVertical: 16,
  },
  flipButton: {
    flex: 1,
    textAlign: "center",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    borderRadius: 12, // bordas arredondadas para o botão
    marginRight: 8, // espaço entre os botões
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  photoButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#b8cabeff",
    borderRadius: 12, // bordas arredondadas para o botão
    paddingVertical: 8,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 360,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
