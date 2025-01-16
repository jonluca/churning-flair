import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Mocked DB
interface Reddit {
  id: number;
  name: string;
}
const posts: Reddit[] = [
  {
    id: 1,
    name: "Hello World",
  },
];

export const redditRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),

  create: publicProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ input }) => {
    const post: Reddit = {
      id: posts.length + 1,
      name: input.name,
    };
    posts.push(post);
    return post;
  }),

  getLatest: publicProcedure.query(() => {
    return posts.at(-1) ?? null;
  }),
});
