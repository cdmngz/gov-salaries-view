// src/lib/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  DATA_API_URL: z.url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const _env = EnvSchema.safeParse(process.env);
if (!_env.success) {
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
