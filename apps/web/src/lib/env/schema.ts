type Parser<T> = (raw: string, key: string) => T;

type EnvField<T> = {
  parser: Parser<T>;
  optional?: boolean;
};

type EnvShape = Record<string, EnvField<unknown>>;

type InferEnv<TShape extends EnvShape> = {
  [TKey in keyof TShape]: TShape[TKey]["optional"] extends true
    ? ReturnType<TShape[TKey]["parser"]> | undefined
    : ReturnType<TShape[TKey]["parser"]>;
};

function readRawValue(key: string): string | undefined {
  const value = process.env[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseString(raw: string): string {
  return raw;
}

export function parseUrl(raw: string, key: string): string {
  try {
    return new URL(raw).toString();
  } catch {
    throw new Error(`Invalid environment variable "${key}": expected a valid URL`);
  }
}

export function readEnv<TShape extends EnvShape>(shape: TShape): InferEnv<TShape> {
  const result: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(shape)) {
    const raw = readRawValue(key);
    if (!raw) {
      if (field.optional) {
        result[key] = undefined;
        continue;
      }
      throw new Error(`Missing required environment variable "${key}"`);
    }
    result[key] = field.parser(raw, key);
  }

  return result as InferEnv<TShape>;
}
