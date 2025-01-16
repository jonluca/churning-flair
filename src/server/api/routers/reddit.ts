import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import flairOptions from "~/server/api/flair-options";
import { RedditClient } from "~/server/reddit/client";

const redditClient = new RedditClient({
  clientId: env.REDDIT_CLIENT_ID,
  clientSecret: env.REDDIT_CLIENT_SECRET,
  redirectUri: env.REDDIT_REDIRECT_URI,
  subreddit: env.REDDIT_SUBREDDIT,
  modUsername: env.MOD_USERNAME,
  modPassword: env.MOD_PASSWORD,
  modScriptId: env.MOD_SCRIPT_ID,
  modScriptSecret: env.MOD_SCRIPT_SECRET,
});

export const redditRouter = createTRPCRouter({
  getCurrentFlair: publicProcedure.query(async () => {
    const state = Math.random().toString(36).substring(7);
    const authUrl = redditClient.generateAuthUrl(state);
    return { authUrl };
  }),
  getFlairOptions: publicProcedure.query(async () => {
    return flairOptions;
  }),
  oauthCallback: publicProcedure.input(z.object({ code: z.string(), state: z.string() })).query(async ({ input }) => {
    const data = await redditClient.getAccessToken(input.code);
    return { accessToken: data.access_token };
  }),

  setUserFlair: publicProcedure
    .input(
      z.object({
        code: z.string(),
        state: z.string(),
        flairText: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const isValid = input.flairText.every((flair) => flairOptions.some((option) => option.flair === flair));
      if (!isValid) {
        throw new Error("Invalid flair");
      }

      try {
        const userToken = await redditClient.getAccessToken(input.code);
        const userData = await redditClient.getUserData(userToken.access_token);
        const modToken = await redditClient.getModAccessToken();

        const response = await redditClient.setUserFlair(modToken.access_token, userData.name, input.flairText.join(" | "));

        return { success: true, data: response };
      } catch (error) {
        console.error(error);
        return { success: false, data: error };
      }
    }),
});
