import { z } from "zod";

const gridSchema = z.object({
  rows: z.number().int().positive(),
  cols: z.number().int().positive(),
});

const positionSchema = z.object({
  row: z.number().int().nonnegative(),
  col: z.number().int().nonnegative(),
});

const buttonSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string().optional(),
  color: z.string().optional(),
  actionId: z.string(),
  position: positionSchema,
});

const pageSchema = z.object({
  id: z.string(),
  name: z.string(),
  grid: gridSchema,
  buttons: z.array(buttonSchema),
});

export const layoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  isDefault: z.boolean().optional(),
  pages: z.array(pageSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const layoutListSchema = z.array(layoutSchema);
