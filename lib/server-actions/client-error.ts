const STALE_DEPLOYMENT_PATTERNS = [
  /failed to find server action/i,
  /server reference id did not match/i,
  /older or newer deployment/i,
  /destination stream closed early/i,
] as const;

const BODY_LIMIT_PATTERNS = [
  /body exceeded .* limit/i,
  /statusCode:\s*413/i,
  /\b413\b/,
] as const;

export const STALE_DEPLOYMENT_MESSAGE =
  "Сессия админки устарела после обновления сайта. Обновите страницу (F5) и повторите действие.";

export const GENERIC_ACTION_ERROR_MESSAGE =
  "Не удалось выполнить действие. Проверьте соединение и попробуйте снова.";

export function formatServerActionClientError(error: unknown): string {
  const text = extractErrorText(error);

  if (BODY_LIMIT_PATTERNS.some((pattern) => pattern.test(text))) {
    return "Файл или запрос слишком большой для текущей конфигурации сервера. Загрузите изображение до 20 MB или обновите страницу и попробуйте снова.";
  }

  if (STALE_DEPLOYMENT_PATTERNS.some((pattern) => pattern.test(text))) {
    return STALE_DEPLOYMENT_MESSAGE;
  }

  return GENERIC_ACTION_ERROR_MESSAGE;
}

function extractErrorText(error: unknown): string {
  if (error instanceof Error) {
    return `${error.message}\n${error.stack ?? ""}`;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "";
  }
}
