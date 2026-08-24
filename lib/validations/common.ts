import { z } from "zod";
import { slugPattern } from "@/lib/utils/slug";

export const idSchema = z.string().min(1);
export const slugSchema = z.string().regex(slugPattern);
export const emailSchema = z.string().email();
export const moneySchema = z.string().regex(/^\d+(\.\d{1,2})?$/);
export const weightSchema = z.string().regex(/^\d+(\.\d{1,3})?$/);
export const sortOrderSchema = z.number().int();
export const ratingSchema = z.number().int().min(1).max(5);

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(24),
});
