import { Stack } from "expo-router";


export default function RootLayout() {
  return <Stack />;
}
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  title: {
    fontSize: 20,
    textAlign: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  description: { fontSize: 14, textAlign: "center", marginBottom: 16 },
  map: { flex: 1 },
   input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
  },
});