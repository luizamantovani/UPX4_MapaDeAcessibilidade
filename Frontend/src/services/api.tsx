import { Pin } from "../types/Pin";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api/v1"
    : "http://localhost:8080/api/v1";

export async function fetchPins(): Promise<Pin[]> {
  const response = await fetch(`${API_URL}/pins`);
  if (!response.ok) throw new Error("Erro ao buscar pins");
  return response.json();
}

export async function savePin(pin: Omit<Pin, "id">): Promise<Pin[]> {
  const response = await fetch(`${API_URL}/pins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pin),
  });
  if (!response.ok) throw new Error("Erro ao salvar pin");
  // retorna todos os pins atualizados
  const pinsResponse = await fetch(`${API_URL}/pins`);
  return pinsResponse.json();
}
