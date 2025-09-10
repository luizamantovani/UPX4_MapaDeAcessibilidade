import { Router } from "express";       // Importa o Router do Express para criar rotas modularizadas
import pinsRouter from "./pins.routes"; // Importa o módulo de rotas específico para "pins"
const router = Router();                // Cria uma nova instância de Router para agrupar rotas
router.use("/pins", pinsRouter);       // Associa todas as rotas de pinsRouter ao caminho "/pins"
export default router;                 // Exporta o router para ser usado em outras partes da aplicação