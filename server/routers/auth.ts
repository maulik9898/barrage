import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const auth = router({
  login: publicProcedure
    .input(
      z.object({
        password: z.string(),
      })
    )
    .mutation(({ input }) => {
      if (input.password == process.env.BARRAGE_PASSWORD) {
        return {
          status: "ok",
          token: Buffer.from(input.password).toString("base64"),
        };
      } else {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid Password"
        })
      }
    }),
});
