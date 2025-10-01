import { Pin } from "../types/Pin";

const API_URL = "https://upx4-mapadeacessibilidade.onrender.com/api/v1";

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
