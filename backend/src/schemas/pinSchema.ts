import { z } from "zod";

export const pinSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(), // <- campo opcional
  category: z.enum(["acessivel", "nao_acessivel"]),
  latitude: z.number(),
  longitude: z.number(),
});