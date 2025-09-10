// Importações dos principais middlewares e rotas
import express from "express";      // Framework para criar o servidor HTTP
import cors from "cors";            // Middleware para permitir requisições de outros domínios
import helmet from "helmet";        // Middleware para adicionar cabeçalhos de segurança HTTP
import compression from "compression"; // Middleware para comprimir respostas HTTP
import routes from "./routes";      // Rotas da aplicação
import { errorMiddleware } from "./middlewares/error.middleware"; // Middleware de tratamento de erros
import { HttpLogger } from "./middlewares/httpLogger";           // Middleware para logar requisições HTTP

// Cria a instância principal do Express
const app = express();

// Middlewares globais
app.use(express.json());        // Interpreta requisições com corpo em JSON
app.use(helmet());              // Adiciona cabeçalhos de segurança
app.use(compression());         // Comprime respostas HTTP
app.use(cors());                // Permite acesso de outros domínios
app.use(HttpLogger);            // Loga todas as requisições HTTP

// Rotas principais
app.get("/", (_req, res) => res.send("Hello, World!"));         // Rota raiz simples
app.get("/healthcheck", (_req, res) => res.status(200).send()); // Rota para verificação de saúde
app.use("/api/v1", routes);                                      // Rotas da API

// Middleware de tratamento de erros (deve ser o último)
app.use(errorMiddleware);

// Exporta a instância do Express
export default app;