import { z } from "zod";

type FieldKey = string;

export function mapZodFieldErrors<T extends FieldKey>(
  error: z.ZodError,
): Partial<Record<T, string>> {
  const fieldErrors: Partial<Record<T, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field as T]) {
      fieldErrors[field as T] = issue.message;
    }
  }

  return fieldErrors;
}

export function getFirstZodErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Проверьте данные формы.";
}
