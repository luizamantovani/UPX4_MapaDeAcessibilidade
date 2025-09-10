// Carrega variáveis de ambiente do arquivo .env
import "dotenv/config";
// Importa função para criar servidor HTTP nativo
import { createServer } from "http";
// Importa a aplicação Express configurada
import app from "./app";
// Importa o logger para registrar logs
import { logger as pino} from "./utils/logger";

// Cria o servidor HTTP usando a aplicação Express
const server = createServer(app);
// Define a porta do servidor (padrão 8080 se não houver variável de ambiente)
const PORT = process.env.PORT || 8080;

// Inicia o servidor e exibe mensagem no log
server.listen(PORT, () => {
  pino.info(`Server is running on http://localhost:${PORT}`);
});

// Captura promessas rejeitadas não tratadas e registra no log
process.on("unhandledRejection", (reason, promise) => {
  pino.error({ promise, reason }, "Unhandled Rejection");
});

// Captura exceções não tratadas, registra no log e encerra o servidor de forma segura
process.on("uncaughtException", (error) => {
  pino.error({ error }, "Uncaught Exception");
  server.close(() => {
    pino.info("Server closed");
    process.exit(1);
  });
  // Garante que o processo será encerrado mesmo se o close travar
  setTimeout(() => process.exit(1), 10_000).unref();
});