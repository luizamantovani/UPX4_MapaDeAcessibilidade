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

export async function deletePin(id: number | string, sessionUserId?: string | null): Promise<void> {
  const headers: Record<string, string> = {};
  if (sessionUserId) headers["x-user-id"] = String(sessionUserId);

  const response = await fetch(`${API_URL}/pins/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => null);
    throw new Error(`Erro ao excluir pin: ${response.status} ${response.statusText} ${text || ""}`);
  }
}
