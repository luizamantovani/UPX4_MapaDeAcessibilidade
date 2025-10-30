import { Request, Response } from "express";
import * as service from "../services/pinsService";
import { logger as pino } from "../utils/logger";
import { pinSchema } from "../schemas/pinSchema";

// Lista todos os pins
export async function list(_req: Request, res: Response) {
  const pins = await service.list();          // Busca todos os pins no banco de dados

  pino.info({req: {method: _req.method, url: _req.url}, result: pins}, "Listed all pins"); // Loga a operação
  res.status(200).json(pins);                 // Retorna os pins encontrados
}

// Busca um pin pelo ID
export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);           // Extrai o ID da URL

  const pin = await service.getById(id);      // Busca o pin no banco

  pino.info({req: {method: req.method, url: req.url}, result: pin}, "Retrieved pin by ID"); // Loga a operação
  if (!pin) {
    return res.status(404).json({ message: "Pin not found" }); // Retorna 404 se não encontrar
  }
  res.status(200).json(pin);                  // Retorna o pin encontrado
}

// Cria um novo pin
export async function create(req: Request, res: Response) {
  // Validação dos dados recebidos
  const result = pinSchema.safeParse(req.body);
  if (!result.success) {
    pino.warn({req: {method: req.method, url: req.url}, error: result.error.issues}, "Invalid pin data"); // Loga o erro de validação
    return res.status(400).json({ error: "Dados inválidos", details: result.error.issues });
  }
  pino.debug({req: {method: req.method, url: req.url}, body: req.body}, "Creating pin with data"); // Loga os dados recebidos

  const { title, category, latitude, longitude, description, imageUrl, userId } = result.data;

  const newPin = await service.create({ title, description: description ?? null, category, latitude, longitude, imageUrl: imageUrl ?? null, userId: userId ?? null }); // Cria o pin no banco

  pino.info({req: {method: req.method, url: req.url}, result: newPin}, "Created new pin"); // Loga a operação
  res.status(201).json(newPin);               // Retorna o novo pin criado
}

// Atualiza um pin existente
export async function update(req: Request, res: Response) {
  // Validação dos dados recebidos
  const result = pinSchema.safeParse(req.body);
  if (!result.success) {
    pino.warn({req: {method: req.method, url: req.url}, error: result.error.issues}, "Invalid pin data"); // Loga o erro de validação
    return res.status(400).json({ error: "Dados inválidos", details: result.error.issues });
  }
  pino.debug({req: {method: req.method, url: req.url}, body: req.body}, "Updating pin with data"); // Loga os dados recebidos

  const id = Number(req.params.id);           // Extrai o ID da URL

  const { title, category, latitude, longitude, description, imageUrl, userId } = result.data;

  const updatedPin = await service.update(id, { title, description: description ?? null, category, latitude, longitude, imageUrl: imageUrl ?? null, userId: userId ?? null }); // Atualiza o pin

  pino.info({req: {method: req.method, url: req.url}, result: updatedPin}, "Updated pin"); // Loga a operação
  if (!updatedPin) {
    return res.status(404).json({ message: "Pin not found" }); // Retorna 404 se não encontrar
  }
  res.status(200).json(updatedPin);           // Retorna o pin atualizado
}

// Remove um pin pelo ID
export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);            // Extrai o ID da URL

  const wasRemoved = await service.remove(id); // Remove o pin do banco

  pino.info({req: {method: req.method, url: req.url}, result: wasRemoved}, "Removed pin"); // Loga a operação
  if (!wasRemoved) {
    return res.status(404).json({ message: "Pin not found" }); // Retorna 404 se não encontrar
  }
  res.status(200).send();                      // Retorna status 200 se remover com sucesso
}