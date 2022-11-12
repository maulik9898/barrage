import { z } from "zod";
import client from "../deluge";
import { publicProcedure, router } from "../trpc";
import { auth } from "./auth";
import { deluge } from "./deluge";

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const a = await client.getAllData();
      return {
        a,
      };
    }),
  auth: auth,
  deluge: deluge
});

// export type definition of API
export type AppRouter = typeof appRouter;
