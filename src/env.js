import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    REDDIT_CLIENT_ID: z.string(),
    REDDIT_CLIENT_SECRET: z.string(),
    REDDIT_REDIRECT_URI: z.string(),
    REDDIT_SUBREDDIT: z.string(),
    MOD_USERNAME: z.string(),
    MOD_PASSWORD: z.string(),
    MOD_SCRIPT_ID: z.string(),
    MOD_SCRIPT_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_REDDIT_SUBREDDIT: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID || "pdgOat07Rq6waQ",
    REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
    REDDIT_SUBREDDIT: process.env.REDDIT_SUBREDDIT || "churning",
    NEXT_PUBLIC_REDDIT_SUBREDDIT: process.env.REDDIT_SUBREDDIT || "churning",
    REDDIT_REDIRECT_URI:
      process.env.REDDIT_REDIRECT_URI ||
      (process.env.NODE_ENV === "production" ? "https://www.rchurning.com/redirect" : "http://localhost:3000/redirect"),
    MOD_USERNAME: process.env.MOD_USERNAME || "ChurningMod",
    MOD_PASSWORD: process.env.MOD_PASSWORD,
    MOD_SCRIPT_ID: process.env.MOD_SCRIPT_ID || "oznbaimFTnztguB3wagUKw",
    MOD_SCRIPT_SECRET: process.env.MOD_SCRIPT_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
