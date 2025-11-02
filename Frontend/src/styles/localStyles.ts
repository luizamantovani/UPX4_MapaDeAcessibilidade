import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const localStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)", // semi-transparent background
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
    alignItems: "stretch",
  },
  modalContentWithImage: {
    minHeight: 360,
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
    marginTop: 12,
    backgroundColor: "#484D50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  closeButtonDetails: {
    flex: 1,
    backgroundColor: theme.colors.muted, // botão secundário parecido com cadastro
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.md,
    alignItems: 'center',
  },
  deleteButtonDetails: {
    flex: 1,
    backgroundColor: theme.colors.danger, // usar cor de perigo (vermelho) para excluir
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.md,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontFamily: theme.fonts.semibold,
    fontSize: theme.fontSizes.lg,
  }
  ,
  // Modal de confirmação centralizado (não ocupa toda a largura)
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)'
  },
  confirmModalBox: {
    width: '85%',
    maxWidth: 480,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
  }
});
