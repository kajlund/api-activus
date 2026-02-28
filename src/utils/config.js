import "dotenv/config"; // Ensure env variables before configuring
import vine, { errors } from "@vinejs/vine";

const DEFAULTS = Object.freeze({
  env: "production",
  port: 3000,
  logLevel: "info",
  logHttp: false,
});

function fromEnv(env = process.env) {
  return {
    env: env.NODE_ENV,
    port: env.PORT ? Number(env.PORT) : undefined,
    logLevel: env.LOG_LEVEL,
    logHttp: env.LOG_HTTP,
    dbUrl: env.DATABASE_URL,
    accessTokenSecret: env.ACCESS_TOKEN_SECRET,
    allowedOrigins: env.ALLOWED_ORIGINS
      ? env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
      : undefined,
    authUrl: process.env.AUTH_URL,
  };
}

const validator = vine.create({
  env: vine.enum(["development", "production", "test"]),
  port: vine.number(),
  logLevel: vine.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]),
  logHttp: vine.boolean(),
  dbUrl: vine.string().trim().minLength(20),
  accessTokenSecret: vine.string().trim().minLength(25),
  allowedOrigins: vine.array(vine.string().trim().url()).minLength(1),
  authUrl: vine.string().trim(),
});

function deepFreeze(obj) {
  if (!obj || typeof obj !== "object") return obj;
  for (const v of Object.values(obj)) deepFreeze(v);
  return Object.freeze(obj);
}

export async function getConfig(overrides = {}) {
  const data = { ...DEFAULTS, ...fromEnv(), ...overrides };

  try {
    const validated = await validator.validate(data);

    const finalConfig = {
      ...validated,
      isDev: validated.env === "development",
      isProd: validated.env === "production",
    };

    return deepFreeze(finalConfig);
  } catch (err) {
    const e = new Error("Invalid configuration. See `cause` for validation details.");
    e.name = "ConfigValidationError";
    e.cause = err;

    if (err instanceof errors.E_VALIDATION_ERROR) {
      e.validation = err.messages;
    }

    throw e;
  }
}
