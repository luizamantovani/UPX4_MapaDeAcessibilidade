import { Pool } from 'pg';          // Importa a classe Pool do pacote 'pg' para gerenciar conexões com o PostgreSQL
import { drizzle } from 'drizzle-orm/node-postgres'; // Importa a função drizzle para integração ORM
import * as schema from './schema'; // Importa o schema do banco de dados definido localmente

// Cria um pool de conexões com o banco de dados usando a URL definida em DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inicializa a instância do ORM drizzle usando o pool e o schema do banco
export const db = drizzle(pool, { schema });