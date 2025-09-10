import "dotenv/config"; // Carrega variáveis de ambiente do arquivo .env

import { migrate } from "drizzle-orm/node-postgres/migrator"; // Importa função para executar as migrations
import { drizzle } from "drizzle-orm/node-postgres"; // Importa função para inicializar o ORM drizzle
import { Client } from "pg";    // Importa o cliente do PostgreSQL

// Cria uma instância do cliente PostgreSQL usando a URL do banco
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Função principal para executar as migrations
const main = async () => {
    try {
        console.log("Migrating...");  // Informa início da migração
        await client.connect();       // Conecta ao banco de dados
        const db = drizzle(client);   // Inicializa o ORM drizzle
        await migrate(db, { migrationsFolder: "drizzle" }); // Executa as migrations
        console.log("Migrated!");     // Informa sucesso
        await client.end();           // Encerra a conexão
    } catch (error) {
        console.error(error);         // Exibe erro no console
        throw new Error("Migration failed"); // Lança erro customizado
    }
};

main();     // Executa a função principal