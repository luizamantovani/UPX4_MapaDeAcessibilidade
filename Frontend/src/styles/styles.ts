import { StyleSheet } from "react-native";
import { theme } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    textAlign: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    fontFamily: theme.fonts.bold,
  },
  description: {
    fontSize: theme.fontSizes.md,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
});