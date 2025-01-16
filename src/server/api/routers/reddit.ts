import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import flairOptions from "~/server/api/flair-options";

const REDDIT_OAUTH_URL = "https://www.reddit.com/api/v1/authorize";
const REDDIT_TOKEN_URL = "https://www.reddit.com/api/v1/access_token";
const REDDIT_API_URL = "https://oauth.reddit.com";

export const redditRouter = createTRPCRouter({
  getCurrentFlair: publicProcedure.query(async () => {
    // Generate random state for OAuth security
    const state = Math.random().toString(36).substring(7);
    const authUrl = `${REDDIT_OAUTH_URL}?client_id=${env.REDDIT_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${env.REDDIT_REDIRECT_URI}&duration=temporary&scope=flair`;

    return { authUrl };
  }),
  getFlairOptions: publicProcedure.query(async () => {
    return flairOptions;
  }),

  oauthCallback: publicProcedure
    .input(
      z.object({
        code: z.string(),
        state: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const params = new URLSearchParams({
        grant_type: "authorization_code",
        code: input.code,
        redirect_uri: env.REDDIT_REDIRECT_URI,
      });

      const response = await fetch(REDDIT_TOKEN_URL, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      const data = await response.json();
      return { accessToken: data.access_token };
    }),

  setUserFlair: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        flairText: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // change this so its the mod that sets it, since users dont have perms
      const response = await fetch(`${REDDIT_API_URL}/r/${env.REDDIT_SUBREDDIT}/api/selectflair`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          api_type: "json",
          text: input.flairText,
        }),
      });

      const data = await response.json();
      return { success: true, data };
    }),
});
