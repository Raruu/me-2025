import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_EXTERNAL_RESOURCE: z.url(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_EXTERNAL_RESOURCE: process.env.NEXT_PUBLIC_EXTERNAL_RESOURCE,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
