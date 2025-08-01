// db/entities.ts
import { z } from "zod";

// Enums basados en tu schema.prisma
const Role = z.enum(["ADMIN", "CAJERO"]);
const HorarioTipo = z.enum(["MATUTINO", "VESPERTINO"]);
const UnidadMedida = z.enum(["PIEZA", "KG", "LITRO"]);
const Talla = z.enum(["CH", "M", "G", "XL", "UNICA"]);
const TipoMerma = z.enum(["CADUCADO", "DAÑADO", "PERDIDO"]);

export const entities = {
  store: z.object({
    name: z.string(),
    address: z.string().optional(),
    phone: z.string().optional(),
    image: z.string().optional(),
    active: z.boolean().default(true),
  }),

  socialMedia: z.object({
    type: z.string(),
    url: z.string().url(),
    storeId: z.number().int(),
  }),

  user: z.object({
    name: z.string(),
    role: Role,
    image: z.string().optional(),
    shiftId: z.number().int(),
    active: z.boolean().default(true),
  }),

  shift: z.object({
    name: HorarioTipo,
    active: z.boolean().default(true),
  }),

  product: z.object({
    name: z.string(),
    image: z.string().optional(),
    price: z.number().nonnegative().default(0),
    unit: UnidadMedida.optional(),
    size: Talla.optional(),
    active: z.boolean().default(true),
  }),

  batch: z.object({
    name: z.string(),
    expirationDate: z.coerce.date().optional(),
    active: z.boolean().default(true),
  }),

  productBatch: z.object({
    productId: z.number().int(),
    batchId: z.number().int(),
    supplierId: z.number().int(),
    active: z.boolean().default(true),
  }),

  supplier: z.object({
    name: z.string(),
    address: z.string().optional(),
    phone: z.string().optional(),
    active: z.boolean().default(true),
  }),

  inventoryLog: z.object({
    description: z.string(),
    type: TipoMerma,
    productBatchId: z.number().int(),
    active: z.boolean().default(true),
  }),

  receipt: z.object({
    name: z.string(),
    total: z.number().nonnegative(),
    userId: z.number().int(),
  }),

  receiptProduct: z.object({
    productId: z.number().int(),
    receiptId: z.number().int(),
    quantity: z.number().int().positive(),
  }),
};

export type EntitySchemas = typeof entities;
