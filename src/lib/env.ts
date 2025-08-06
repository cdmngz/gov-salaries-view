import { z } from "zod";

// ✅ Server-only variables
const ServerEnvSchema = z.object({
  DATA_API_URL: z.url(),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

// ✅ Public variables (client-safe)
const PublicEnvSchema = z.object({
  NEXT_PUBLIC_GIT_VERSION: z.string().default("dev"),
});

export const serverEnv = (() => {
  if (typeof window !== "undefined") return {} as never; // prevent loading on client
  const parsed = ServerEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error("❌ Invalid server environment variables");
  }
  return parsed.data;
})();

export const publicEnv = (() => {
  const parsed = PublicEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error("❌ Invalid public environment variables");
  }
  return parsed.data;
})();
