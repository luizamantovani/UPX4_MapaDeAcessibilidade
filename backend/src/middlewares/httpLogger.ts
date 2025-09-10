import pinoHttp from "pino-http";                // Importa o middleware pino-http para logging HTTP.
import { logger as pino} from "../utils/logger"; // Importa uma instância personalizada do logger.
import type { IncomingMessage, ServerResponse } from "http"; // Tipos do Node.js para requisição e resposta HTTP.

// Exporta o middleware de logging HTTP configurado.
export const HttpLogger = pinoHttp({
  logger: pino,                                          // Usa o logger personalizado para registrar logs.
  genReqId: function (req: IncomingMessage, res: ServerResponse) { // Função para gerar ou recuperar o ID da requisição.
    const existingId =
      req.headers["x-request-id"] as string | undefined; // Tenta obter o ID da requisição do header 'x-request-id'.
    if (existingId) {
      return existingId; // Se já existe, retorna esse ID.
    }

    const id =
      (req.headers["x-correlation-id"] as string) || // Tenta obter o ID de correlação de diferentes headers.
      (req.headers["x-correlationid"] as string) ||
      (req.headers["x-ms-correlation-id"] as string) ||
      "";

    if (id) {
      res.setHeader("X-Request-Id", id); // Se encontrou algum ID, define o header 'X-Request-Id' na resposta.
    }
    return id;       // Retorna o ID encontrado (ou vazio se não houver).
  }
});