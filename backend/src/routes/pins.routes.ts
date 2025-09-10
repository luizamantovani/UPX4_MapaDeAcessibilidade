// Importa o Router do Express para criar rotas modularizadas
import { Router } from "express";
// Importa todas as funções do controller de pins
import * as controller from "../controllers/pins.controller";
// Middleware para tratar funções assíncronas e capturar erros
import { asyncHandler } from "../middlewares/asyncHandler";

// Cria uma instância de Router para definir as rotas relacionadas aos pins
const router = Router();

router.get("/", asyncHandler(controller.list)); // Rota para listar todos os pins

router.get("/:id", asyncHandler(controller.getById)); // Rota para buscar um pin pelo ID

router.post("/", asyncHandler(controller.create)); // Rota para criar um novo pin

router.patch("/:id", asyncHandler(controller.update)); // Rota para atualizar um pin existente pelo ID

router.delete("/:id", asyncHandler(controller.remove)); // Rota para remover um pin pelo ID

// Exporta o router para ser utilizado no app principal
export default router;