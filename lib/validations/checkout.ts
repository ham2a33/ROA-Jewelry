import { z } from "zod";

export const deliveryMethodSchema = z.enum(["delivery", "pickup"]);

export const checkoutFormSchema = z
  .object({
    name: z.string().trim().min(1, "Укажите имя").max(120),
    phone: z
      .string()
      .trim()
      .min(1, "Укажите телефон")
      .max(32)
      .refine(
        (value) => value.replace(/\D/g, "").length >= 10,
        "Укажите корректный номер телефона",
      ),
    city: z.string().trim().min(1, "Укажите город").max(120),
    deliveryMethod: deliveryMethodSchema,
    address: z.string().trim().max(240).optional(),
    comment: z.string().trim().max(500).optional(),
  })
  .superRefine((data, context) => {
    if (data.deliveryMethod === "delivery" && !data.address?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Укажите адрес доставки",
        path: ["address"],
      });
    }
  });

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;

export const checkoutCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  variantId: z.string().nullable().optional(),
});

export const checkoutSubmissionSchema = z.object({
  cartItems: z.array(checkoutCartItemSchema).min(1),
  form: checkoutFormSchema,
});

export type CheckoutSubmissionInput = z.infer<typeof checkoutSubmissionSchema>;

export const deliveryMethodLabels = {
  delivery: "Доставка",
  pickup: "Самовывоз",
} as const;
