import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { use, useState, useEffect, useRef } from "react";
import {
    Alert,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);

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

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} onPress={async () => {
            const response = await takePhoto();
            Alert.alert("Photo taken!", `Photo URI: ${response?.uri}`);
            }}>
          <Text style={styles.text}>Tirar foto</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#878a88",
    borderRadius: 12, // bordas arredondadas para o botão
    paddingVertical: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
