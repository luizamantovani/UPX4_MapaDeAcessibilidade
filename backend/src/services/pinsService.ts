// Importa a instância do banco de dados e o modelo de pins
import { db, pins } from "../db";
// Importa funções auxiliares do drizzle-orm para SQL e comparação
import { sql, eq } from "drizzle-orm";

// Define o tipo base para um pin
type PinBase = {
  // userId: number;
  title: string;
  description: string | null;
  category: string;
  latitude: number;
  longitude: number;
};

// Define o formato dos dados retornados nas consultas
const selectShape = {
  id: pins.id,
  // userId: pins.userId,
  title: pins.title,
  description: pins.description,
  category: pins.category,

  // Extrai latitude e longitude do campo de localização (geometria)
  latitude: sql<number>`ST_Y(${pins.location}::geometry)`,
  longitude: sql<number>`ST_X(${pins.location}::geometry)`,
  
  createdAt: pins.createdAt,
  updatedAt: pins.updatedAt,
};

// Lista todos os pins do banco de dados
export async function list() {
  return db.select(selectShape).from(pins);
}

// Busca um pin pelo ID
export async function getById(id: number) {
  const [pin] = await db
    .select(selectShape)
    .from(pins)
    .where(eq(pins.id, id));
  return pin;
}

// Cria um novo pin no banco de dados
export async function create(data: PinBase) {
  const { title, description, category, latitude, longitude } = data;
  // Insere o novo pin, convertendo latitude/longitude para tipo geográfico
  const [pin] = await db
    .insert(pins)
    .values({
      // userId,
      title,
      description: description ?? null,
      category,
      location: sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
    })
    .returning();
  return pin;
}

// Atualiza um pin existente pelo ID
export async function update(id: number, data: PinBase) {
  const { title, description, category, latitude, longitude } = data;
  // Atualiza os dados do pin e a localização
  const [pin] = await db
    .update(pins)
    .set({
      // userId,
      title,
      description,
      category,
      location: sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
      updatedAt: new Date(), // Atualiza o timestamp
    })
    .where(eq(pins.id, id))
    .returning();
  return pin;
}

// Remove um pin pelo ID
export async function remove(id: number) {
  const result = await db.delete(pins).where(eq(pins.id, id));
  // Retorna true se um registro foi removido
  return result.rowCount === 1;
}