import { formatServerActionClientError } from "@/lib/server-actions/client-error";

export async function runClientAction<T>(
  action: () => Promise<T>,
): Promise<{ ok: true; value: T } | { ok: false; message: string }> {
  try {
    const value = await action();
    return { ok: true, value };
  } catch (error) {
    return { ok: false, message: formatServerActionClientError(error) };
  }
}
