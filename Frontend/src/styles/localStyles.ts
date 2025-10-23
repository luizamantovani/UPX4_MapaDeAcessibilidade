import { StyleSheet } from "react-native";

export const localStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)", // semi-transparent background
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
    alignItems: "stretch",
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cancelButtonDetails: {
    marginTop: 60,
    backgroundColor: "#484D50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  }
});
